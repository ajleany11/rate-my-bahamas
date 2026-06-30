from better_profanity import profanity as _profanity_filter
from django.db.models import Avg, Count, Prefetch, Q
from django.utils.text import slugify
from rest_framework import serializers

from .models import Course, Professor, ProfessorCourse, Review

_profanity_filter.load_censor_words()


def _check_profanity(value, field_label='Text'):
    if _profanity_filter.contains_profanity(value):
        raise serializers.ValidationError(
            f'{field_label} contains inappropriate language. Please revise your submission.'
        )


def get_or_create_professor_by_name(name, department):
    """Find a professor by name (case-insensitive), or create a new one with a unique slug."""
    name = name.strip()
    existing = Professor.objects.filter(name__iexact=name).first()
    if existing:
        return existing

    base_slug = slugify(name) or 'professor'
    slug = base_slug
    counter = 2
    while Professor.objects.filter(slug=slug).exists():
        slug = f'{base_slug}-{counter}'
        counter += 1
    return Professor.objects.create(name=name, department=department, slug=slug)


def professor_courses_with_stats(course):
    """ProfessorCourse pairings for `course`, annotated with rating/would-take-again stats."""
    return ProfessorCourse.objects.filter(course=course).select_related('professor').annotate(
        avg_rating=Avg('professor__reviews__rating', filter=Q(professor__reviews__course=course)),
        review_count=Count('professor__reviews', filter=Q(professor__reviews__course=course)),
        would_take_again_count=Count(
            'professor__reviews', filter=Q(professor__reviews__course=course, professor__reviews__would_take_again=True)
        ),
    ).order_by('professor__name')


def courses_taught_for_professor(professor):
    """Every course `professor` has reviews for, each with its own rating/would-take-again stats
    and the full (anonymous) list of reviews for that course.

    Expects `professor` to come from a queryset with
    `prefetch_related('professor_courses__course', 'reviews')` so this performs no extra queries.
    """
    reviews_by_course = {}
    for review in professor.reviews.all():
        reviews_by_course.setdefault(review.course_id, []).append(review)

    results = []
    for pc in professor.professor_courses.all():
        course_reviews = sorted(
            reviews_by_course.get(pc.course_id, []), key=lambda r: r.created_at, reverse=True
        )
        review_count = len(course_reviews)
        results.append({
            'id': pc.id,
            'course': CourseSerializer(pc.course).data,
            'confirmed': pc.confirmed,
            'review_count': review_count,
            'average_rating': (
                round(sum(r.rating for r in course_reviews) / review_count, 1) if review_count else None
            ),
            'would_take_again_percent': (
                round(sum(1 for r in course_reviews if r.would_take_again) / review_count * 100)
                if review_count else None
            ),
            'reviews': ReviewSerializer(course_reviews, many=True).data,
        })
    return results


def overall_stats_for_professor(courses_taught):
    """Overall rating / would-take-again %, averaged across each ProfessorCourse record (every course counts equally)."""
    rated = [c for c in courses_taught if c['average_rating'] is not None]
    review_count = sum(c['review_count'] for c in courses_taught)

    if not rated:
        return {'average_rating': None, 'would_take_again_percent': None, 'review_count': review_count}

    return {
        'average_rating': round(sum(c['average_rating'] for c in rated) / len(rated), 1),
        'would_take_again_percent': round(sum(c['would_take_again_percent'] for c in rated) / len(rated)),
        'review_count': review_count,
    }


def top_rated_professors(limit=5):
    """The `limit` professors with the highest overall rating, highest review count breaking ties."""
    professors = Professor.objects.prefetch_related(
        Prefetch('professor_courses', queryset=ProfessorCourse.objects.select_related('course')),
        'reviews',
    )

    ranked = []
    for professor in professors:
        overall = overall_stats_for_professor(courses_taught_for_professor(professor))
        if overall['average_rating'] is None:
            continue
        ranked.append((professor, overall))

    ranked.sort(key=lambda pair: (pair[1]['average_rating'], pair[1]['review_count']), reverse=True)
    return ranked[:limit]


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'code', 'name', 'department')


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ('id', 'name', 'department', 'slug', 'photo_url')


class ProfessorCourseStatsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    professor = ProfessorSerializer(read_only=True)
    confirmed = serializers.BooleanField()
    review_count = serializers.IntegerField()
    average_rating = serializers.SerializerMethodField()
    would_take_again_percent = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        return round(obj.avg_rating, 1) if obj.avg_rating is not None else None

    def get_would_take_again_percent(self, obj):
        if not obj.review_count:
            return None
        return round(obj.would_take_again_count / obj.review_count * 100)


class CourseDetailSerializer(serializers.ModelSerializer):
    professors = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ('id', 'code', 'name', 'department', 'description', 'professors')

    def get_professors(self, obj):
        professor_courses = professor_courses_with_stats(obj)
        return ProfessorCourseStatsSerializer(professor_courses, many=True).data


class ReviewSerializer(serializers.ModelSerializer):
    """Deliberately omits `user` — reviews are shown anonymously."""

    class Meta:
        model = Review
        fields = ('id', 'rating', 'difficulty', 'would_take_again', 'uses_textbook', 'comment', 'created_at')


class ProfessorCourseDetailSerializer(serializers.ModelSerializer):
    professor = ProfessorSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    would_take_again_percent = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model = ProfessorCourse
        fields = (
            'id', 'professor', 'course', 'confirmed', 'review_count', 'average_rating', 'would_take_again_percent',
            'reviews',
        )

    def _reviews(self, obj):
        return Review.objects.filter(professor=obj.professor, course=obj.course)

    def get_review_count(self, obj):
        return self._reviews(obj).count()

    def get_average_rating(self, obj):
        avg = self._reviews(obj).aggregate(avg=Avg('rating'))['avg']
        return round(avg, 1) if avg is not None else None

    def get_would_take_again_percent(self, obj):
        reviews = self._reviews(obj)
        total = reviews.count()
        if not total:
            return None
        would_again = reviews.filter(would_take_again=True).count()
        return round(would_again / total * 100)

    def get_reviews(self, obj):
        return ReviewSerializer(self._reviews(obj).order_by('-created_at'), many=True).data


class ProfessorCourseCreateSerializer(serializers.ModelSerializer):
    """Lets a user claim that a professor teaches a course. Always starts unconfirmed.

    Accepts either an existing `professor` id, or a `professor_name` to look up
    (case-insensitively) or create a brand new Professor on the fly.
    """

    professor = serializers.PrimaryKeyRelatedField(queryset=Professor.objects.all(), required=False)
    professor_name = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = ProfessorCourse
        fields = ('id', 'professor', 'professor_name', 'course', 'confirmed')
        read_only_fields = ('id', 'confirmed')
        # Disable DRF's auto unique_together validator: it force-requires `professor`,
        # which breaks the professor_name-only path. Duplicates are checked in create() instead.
        validators = []

    def validate(self, attrs):
        professor = attrs.get('professor')
        professor_name = attrs.get('professor_name')
        if not professor and not professor_name:
            raise serializers.ValidationError("Select a professor or type a new professor's name.")
        if professor and professor_name:
            raise serializers.ValidationError('Choose an existing professor or type a new name, not both.')
        return attrs

    def validate_professor_name(self, value):
        if value:
            _check_profanity(value, 'Professor name')
        return value

    def create(self, validated_data):
        professor_name = validated_data.pop('professor_name', None)
        course = validated_data['course']

        professor = validated_data.get('professor')
        if professor_name:
            professor = get_or_create_professor_by_name(professor_name, course.department)

        if ProfessorCourse.objects.filter(professor=professor, course=course).exists():
            raise serializers.ValidationError(
                {'non_field_errors': ['This professor is already listed for this course.']}
            )

        return ProfessorCourse.objects.create(professor=professor, course=course)


class ReviewCreateSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    difficulty = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Review
        fields = ('id', 'professor', 'course', 'rating', 'difficulty', 'would_take_again', 'uses_textbook', 'comment')
        read_only_fields = ('id',)

    def validate_comment(self, value):
        if value:
            _check_profanity(value, 'Review')
        return value


class ProfessorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ('id', 'name', 'department', 'slug', 'photo_url')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        courses_taught = courses_taught_for_professor(instance)
        overall = overall_stats_for_professor(courses_taught)
        data['courses_taught'] = courses_taught
        data['overall_average_rating'] = overall['average_rating']
        data['overall_would_take_again_percent'] = overall['would_take_again_percent']
        data['overall_review_count'] = overall['review_count']
        return data
