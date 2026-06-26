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
