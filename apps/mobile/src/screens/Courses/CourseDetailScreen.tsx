import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import {
  useCourseDetail,
  useLessonProgress,
  courseKeys,
  type CourseModule,
  type CourseLesson,
} from '../../hooks/useCourses';
import { theme } from '../../constants/theme';

const CONTENT_TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  video: 'play-circle-outline',
  text: 'document-text-outline',
  quiz: 'help-circle-outline',
};

function formatDuration(minutes: number | null): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}u ${m}m` : `${h}u`;
}

export default function CourseDetailScreen({ route, navigation }: any) {
  const { courseId, enrollmentId } = route.params;
  const queryClient = useQueryClient();
  const { data: course, isLoading, isRefetching, refetch } = useCourseDetail(courseId);
  const { data: completedLessons = new Set<string>() } = useLessonProgress(enrollmentId);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.progress(enrollmentId) });
    }, [courseId, enrollmentId, queryClient])
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Count totals
  const totalLessons = course?.modules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  ) ?? 0;
  const completedCount = course?.modules.reduce(
    (sum, mod) =>
      sum + mod.lessons.filter((l) => completedLessons.has(l.id)).length,
    0
  ) ?? 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (isLoading || !course) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Course laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>

        {/* Description */}
        {course.description ? (
          <Text style={styles.description}>{course.description}</Text>
        ) : null}

        {/* Progress overview */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Voortgang</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(progressPercent, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressSubtext}>
            {completedCount} van {totalLessons} lessen voltooid
          </Text>
        </View>

        {/* Modules */}
        {course.modules.map((mod: CourseModule) => {
          const isExpanded = expandedModules.has(mod.id);
          const modCompletedCount = mod.lessons.filter((l) =>
            completedLessons.has(l.id)
          ).length;

          return (
            <View key={mod.id} style={styles.moduleSection}>
              <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => toggleModule(mod.id)}
                activeOpacity={0.7}
              >
                <View style={styles.moduleHeaderLeft}>
                  <Text style={styles.moduleTitle} numberOfLines={1}>
                    {mod.title}
                  </Text>
                  <Text style={styles.moduleSubtitle}>
                    {modCompletedCount}/{mod.lessons.length} lessen
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.lessonsContainer}>
                  {mod.lessons.map((lesson: CourseLesson) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const iconName =
                      CONTENT_TYPE_ICONS[lesson.contentType] ||
                      'document-text-outline';
                    const duration = formatDuration(lesson.duration);

                    return (
                      <TouchableOpacity
                        key={lesson.id}
                        style={styles.lessonRow}
                        onPress={() =>
                          navigation.navigate('Lesson', {
                            courseId,
                            enrollmentId,
                            lessonId: lesson.id,
                            lessonTitle: lesson.title,
                            contentType: lesson.contentType,
                            contentUrl: lesson.contentUrl,
                            contentText: lesson.contentText,
                            isCompleted,
                          })
                        }
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.lessonIconCol,
                            isCompleted && styles.lessonIconColCompleted,
                          ]}
                        >
                          {isCompleted ? (
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color="#10b981"
                            />
                          ) : (
                            <Ionicons
                              name={iconName}
                              size={18}
                              color={theme.colors.primary}
                            />
                          )}
                        </View>
                        <View style={styles.lessonInfoCol}>
                          <Text
                            style={[
                              styles.lessonTitle,
                              isCompleted && styles.lessonTitleCompleted,
                            ]}
                            numberOfLines={1}
                          >
                            {lesson.title}
                          </Text>
                          <View style={styles.lessonMeta}>
                            <Text style={styles.lessonType}>
                              {lesson.contentType === 'video'
                                ? 'Video'
                                : lesson.contentType === 'quiz'
                                ? 'Quiz'
                                : 'Tekst'}
                            </Text>
                            {duration && (
                              <Text style={styles.lessonDuration}>
                                {duration}
                              </Text>
                            )}
                          </View>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={
                            isCompleted
                              ? '#10b981'
                              : theme.colors.textTertiary
                          }
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        {/* Empty modules state */}
        {course.modules.length === 0 && (
          <View style={styles.emptyModules}>
            <Ionicons
              name="folder-open-outline"
              size={40}
              color={theme.colors.textTertiary}
            />
            <Text style={styles.emptyModulesText}>
              Nog geen modules beschikbaar
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  // Progress card
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  progressSubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  // Module section
  moduleSection: {
    marginBottom: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  moduleHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  moduleSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  // Lessons
  lessonsContainer: {
    backgroundColor: theme.colors.surface,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lessonIconCol: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${theme.colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonIconColCompleted: {
    backgroundColor: '#d1fae5',
  },
  lessonInfoCol: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  lessonTitleCompleted: {
    color: theme.colors.textSecondary,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  lessonType: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  lessonDuration: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  // Empty modules
  emptyModules: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyModulesText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
});
