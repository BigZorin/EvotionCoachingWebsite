import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { useCourses, courseKeys, type CourseEnrollment } from '../../hooks/useCourses';
import { theme } from '../../constants/theme';

export default function CoursesScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const { data: enrollments = [], isLoading, isRefetching, refetch } = useCourses();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    }, [queryClient])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Courses laden...</Text>
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
        <Text style={styles.title}>Leren</Text>

        {enrollments.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="book-outline" size={48} color={theme.colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Nog geen courses beschikbaar</Text>
            <Text style={styles.emptyText}>
              Wanneer je coach een cursus aan je toewijst,{'\n'}verschijnt deze hier.
            </Text>
          </View>
        )}

        {enrollments.map((enrollment: CourseEnrollment) => (
          <TouchableOpacity
            key={enrollment.id}
            style={styles.courseCard}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('CourseDetail', {
                courseId: enrollment.course.id,
                enrollmentId: enrollment.id,
              })
            }
          >
            <View style={styles.thumbnailContainer}>
              {enrollment.course.thumbnail ? (
                <Image
                  source={{ uri: enrollment.course.thumbnail }}
                  style={styles.thumbnailImg}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.thumbnailFallback}>
                  <Ionicons name="book-outline" size={48} color="rgba(255,255,255,0.15)" />
                </View>
              )}
              {enrollment.completedAt && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.completedBadgeText}>Voltooid</Text>
                </View>
              )}
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.courseTitle} numberOfLines={1}>
                {enrollment.course.title}
              </Text>
              {enrollment.course.description ? (
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {enrollment.course.description}
                </Text>
              ) : null}

              {/* Progress bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(enrollment.progressPercent, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {enrollment.progressPercent}% voltooid
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 20,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 24,
    color: theme.colors.text,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Course card
  courseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  thumbnailContainer: {
    height: 160,
    position: 'relative',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  cardBody: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    minWidth: 80,
    textAlign: 'right',
  },
});
