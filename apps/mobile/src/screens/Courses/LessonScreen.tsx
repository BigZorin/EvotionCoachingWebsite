import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCompleteLesson } from '../../hooks/useCourses';
import { theme } from '../../constants/theme';

export default function LessonScreen({ route, navigation }: any) {
  const {
    courseId,
    enrollmentId,
    lessonId,
    lessonTitle,
    contentType,
    contentUrl,
    contentText,
    isCompleted: initiallyCompleted,
  } = route.params;

  const [completed, setCompleted] = useState(!!initiallyCompleted);
  const completeLessonMutation = useCompleteLesson();

  const handleComplete = () => {
    if (completed) return;

    completeLessonMutation.mutate(
      { enrollmentId, lessonId, courseId },
      {
        onSuccess: () => {
          setCompleted(true);
        },
        onError: (error: any) => {
          Alert.alert(
            'Fout',
            error?.message || 'Kon les niet als voltooid markeren.'
          );
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lessonTitle}
        </Text>
        {completed && (
          <View style={styles.completedIndicator}>
            <Ionicons name="checkmark-circle" size={22} color="#10b981" />
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {contentType === 'video' && (
          <View style={styles.videoPlaceholder}>
            <View style={styles.videoIconCircle}>
              <Ionicons name="play" size={40} color="#fff" />
            </View>
            <Text style={styles.videoPlaceholderTitle}>Video</Text>
            {contentUrl ? (
              <Text style={styles.videoUrl} numberOfLines={2}>
                {contentUrl}
              </Text>
            ) : (
              <Text style={styles.videoPlaceholderText}>
                Video wordt hier getoond
              </Text>
            )}
          </View>
        )}

        {contentType === 'text' && (
          <View style={styles.textContent}>
            {contentText ? (
              <Text style={styles.contentText}>{contentText}</Text>
            ) : (
              <View style={styles.noContentContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color={theme.colors.textTertiary}
                />
                <Text style={styles.noContentText}>
                  Geen tekst beschikbaar
                </Text>
              </View>
            )}
          </View>
        )}

        {contentType === 'quiz' && (
          <View style={styles.quizPlaceholder}>
            <View style={styles.quizIconCircle}>
              <Ionicons name="help" size={40} color="#fff" />
            </View>
            <Text style={styles.quizPlaceholderTitle}>Quiz</Text>
            <Text style={styles.quizPlaceholderText}>
              Quiz wordt hier getoond
            </Text>
          </View>
        )}

        {/* Fallback for unknown content types */}
        {!['video', 'text', 'quiz'].includes(contentType) && (
          <View style={styles.noContentContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={40}
              color={theme.colors.textTertiary}
            />
            <Text style={styles.noContentText}>
              Onbekend lestype: {contentType}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={styles.bottomBar}>
        {completed ? (
          <View style={styles.completedButton}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.completedButtonText}>Voltooid</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
            activeOpacity={0.8}
            disabled={completeLessonMutation.isPending}
          >
            {completeLessonMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.completeButtonText}>
                  Markeer als voltooid
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  completedIndicator: {
    marginLeft: 4,
  },
  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Video placeholder
  videoPlaceholder: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
  },
  videoIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  videoUrl: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  videoPlaceholderText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  // Text content
  textContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  contentText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 26,
  },
  // Quiz placeholder
  quizPlaceholder: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
  },
  quizIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  quizPlaceholderText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  // No content
  noContentContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  noContentText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  // Bottom bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  completedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  completedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
});
