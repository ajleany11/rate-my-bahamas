from django.db.models import Avg, Count, Q
from rest_framework import serializers

from .models import Course, Professor, ProfessorCourse, Review


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
    """Every course `professor` has reviews for, each with its own rating/would-take-again stats."""
    stats_by_course = {
        row['course_id']: row
        for row in Review.objects.filter(professor=professor).values('course_id').annotate(
            avg_rating=Avg('rating'),
            review_count=Count('id'),
            would_take_again_count=Count('id', filter=Q(would_take_again=True)),
        )
    }

    results = []
    professor_courses = ProfessorCourse.objects.filter(professor=professor).select_related('course').order_by('course__code')
    for pc in professor_courses:
        stats = stats_by_course.get(pc.course_id, {'avg_rating': None, 'review_count': 0, 'would_take_again_count': 0})
        review_count = stats['review_count']
        results.append({
            'id': pc.id,
            'course': CourseSerializer(pc.course).data,
            'review_count': review_count,
            'average_rating': round(stats['avg_rating'], 1) if stats['avg_rating'] is not None else None,
            'would_take_again_percent': (
                round(stats['would_take_again_count'] / review_count * 100) if review_count else None
            ),
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


class ProfessorCourseDetailSerializer(serializers.ModelSerializer):
    professor = ProfessorSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    would_take_again_percent = serializers.SerializerMethodField()

    class Meta:
        model = ProfessorCourse
        fields = ('id', 'professor', 'course', 'review_count', 'average_rating', 'would_take_again_percent')

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
