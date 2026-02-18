import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWorkoutDetail, useCompleteWorkout } from '../../hooks/useWorkouts';
import { loadWorkoutLogs, reopenWorkout } from '../../lib/api';
import { fetchPreviousWeekLogs } from '../../lib/programApi';
import { theme } from '../../constants/theme';

type Exercise = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  muscleGroups: string[] | null;
  thumbnailUrl: string | null;
  gifUrl: string | null;
};

type TemplateExercise = {
  id: string;
  orderIndex: number;
  sets: number | null;
  reps: string | null;
  restSeconds: number | null;
  notes: string | null;
  intensityType: string;
  prescribedWeightKg: number | null;
  prescribedRpe: number | null;
  prescribedRir: number | null;
  prescribedPercentage: number | null;
  tempo: string | null;
  exercise: Exercise;
};

type WorkoutDetail = {
  id: string;
  scheduledDate: string | null;
  completed: boolean;
  completedAt: string | null;
  notes: string | null;
  workoutTemplate: {
    id: string;
    name: string;
    description: string | null;
    durationMinutes: number | null;
    exercises: TemplateExercise[];
  };
  coach: {
    profile: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  };
};

type LogEntry = {
  id: string;
  exerciseId: string;
  setNumber: number;
  repsCompleted: number;
  weightKg: number | null;
  actualRpe: number | null;
  actualRir: number | null;
};

function getPrescriptionLabel(item: TemplateExercise): string | null {
  switch (item.intensityType) {
    case 'weight':
      return item.prescribedWeightKg ? `${item.prescribedWeightKg} kg` : null;
    case 'rpe':
      return item.prescribedRpe ? `RPE ${item.prescribedRpe}` : null;
    case 'rir':
      return item.prescribedRir != null ? `RIR ${item.prescribedRir}` : null;
    case 'percentage':
      return item.prescribedPercentage ? `${item.prescribedPercentage}% 1RM` : null;
    case 'bodyweight':
      return 'Lichaamsgewicht';
    default:
      return null;
  }
}

export default function WorkoutDetailScreen({ route, navigation }: any) {
  const { workoutId, templateData, weekNumber, clientProgramId } = route.params;

  // Resolve weekNumber and clientProgramId from either route params or templateData
  const resolvedWeekNumber: number | null = weekNumber ?? templateData?.weekNumber ?? null;
  const resolvedProgramId: string | null = clientProgramId ?? templateData?.clientProgramId ?? null;

  const { data: fetchedWorkout, isLoading: fetchLoading, refetch } = useWorkoutDetail(workoutId || '') as {
    data: WorkoutDetail | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  const completeWorkoutMutation = useCompleteWorkout();

  // Logged sets from DB
  const [workoutLogs, setWorkoutLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [reopening, setReopening] = useState(false);

  // Previous week's logs for reference
  const [prevWeekLogs, setPrevWeekLogs] = useState<LogEntry[]>([]);

  // Build workout from either fetched data or template data passed from program
  const isLoading = workoutId ? fetchLoading : false;
  const workout: WorkoutDetail | undefined = workoutId
    ? fetchedWorkout
    : templateData
      ? {
          id: '',
          scheduledDate: null,
          completed: false,
          completedAt: null,
          notes: null,
          workoutTemplate: templateData.workoutTemplate,
          coach: { profile: null },
        }
      : undefined;
  const isFromTemplate = !workoutId && !!templateData;

  // Load logs for workouts that have a DB record
  useEffect(() => {
    if (workoutId && workout) {
      loadLogs();
    }
  }, [workoutId, workout?.completed]);

  // Load previous week's logs for reference
  useEffect(() => {
    if (resolvedProgramId && resolvedWeekNumber != null && resolvedWeekNumber > 0 && workout?.workoutTemplate?.id) {
      loadPrevWeekLogs();
    }
  }, [resolvedProgramId, resolvedWeekNumber, workout?.workoutTemplate?.id]);

  async function loadLogs() {
    if (!workoutId) return;
    setLogsLoading(true);
    try {
      const logs = await loadWorkoutLogs(workoutId);
      setWorkoutLogs(logs);
    } catch (e) {
      console.log('Could not load workout logs');
    }
    setLogsLoading(false);
  }

  async function loadPrevWeekLogs() {
    if (!resolvedProgramId || resolvedWeekNumber == null || !workout?.workoutTemplate?.id) return;
    try {
      const logs = await fetchPreviousWeekLogs(resolvedProgramId, workout.workoutTemplate.id, resolvedWeekNumber);
      setPrevWeekLogs(logs as LogEntry[]);
    } catch (e) {
      console.log('Could not load previous week logs');
    }
  }

  // Group logs by exercise_id
  const logsByExercise: Record<string, LogEntry[]> = {};
  for (const log of workoutLogs) {
    if (!logsByExercise[log.exerciseId]) logsByExercise[log.exerciseId] = [];
    logsByExercise[log.exerciseId].push(log);
  }

  // Group previous week's logs by exercise_id
  const prevLogsByExercise: Record<string, LogEntry[]> = {};
  for (const log of prevWeekLogs) {
    if (!prevLogsByExercise[log.exerciseId]) prevLogsByExercise[log.exerciseId] = [];
    prevLogsByExercise[log.exerciseId].push(log);
  }

  const handleComplete = () => {
    Alert.alert(
      'Workout Voltooien',
      'Weet je zeker dat je deze workout als voltooid wilt markeren?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Voltooien',
          onPress: () => {
            completeWorkoutMutation.mutate(
              { id: workoutId },
              {
                onSuccess: () => {
                  Alert.alert('Gelukt!', 'Workout is voltooid!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                  ]);
                },
                onError: (error) => {
                  console.error('Error completing workout:', error);
                  Alert.alert('Fout', 'Kan workout niet voltooien');
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    Alert.alert(
      'Workout bewerken',
      'Wil je deze workout heropenen om je sets aan te passen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Bewerken',
          onPress: async () => {
            setReopening(true);
            try {
              await reopenWorkout(workoutId);
              refetch();
              // Navigate to ActiveWorkout — it will load existing logs from DB
              navigation.navigate('ActiveWorkout', {
                workoutId,
                weekNumber: resolvedWeekNumber,
                clientProgramId: resolvedProgramId,
              });
            } catch (err: any) {
              console.error('Reopen error:', err?.message);
              Alert.alert('Fout', 'Kan workout niet heropenen.');
            } finally {
              setReopening(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Workout laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.loadingText}>Workout niet gevonden</Text>
        </View>
      </SafeAreaView>
    );
  }

  const coachName =
    workout.coach?.profile?.firstName && workout.coach?.profile?.lastName
      ? `${workout.coach.profile.firstName} ${workout.coach.profile.lastName}`
      : 'Je coach';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {workout.workoutTemplate.name}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Badge */}
        <View style={styles.statusRow}>
          {workout.completed ? (
            <View style={[styles.badge, styles.badgeCompleted]}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={[styles.badgeText, { color: '#10b981' }]}>Voltooid</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgePending]}>
              <Ionicons name="time-outline" size={16} color="#3b82f6" />
              <Text style={[styles.badgeText, { color: '#3b82f6' }]}>Te doen</Text>
            </View>
          )}
          {workout.scheduledDate && (
            <Text style={styles.dateText}>
              {new Date(workout.scheduledDate).toLocaleDateString('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.infoLabel}>Coach</Text>
            <Text style={styles.infoValue}>{coachName}</Text>
          </View>
          {workout.workoutTemplate.durationMinutes && (
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.infoLabel}>Duur</Text>
              <Text style={styles.infoValue}>{workout.workoutTemplate.durationMinutes} min</Text>
            </View>
          )}
          <View style={styles.infoCard}>
            <Ionicons name="barbell-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.infoLabel}>Oefeningen</Text>
            <Text style={styles.infoValue}>{workout.workoutTemplate.exercises.length}</Text>
          </View>
        </View>

        {/* Description */}
        {workout.workoutTemplate.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beschrijving</Text>
            <Text style={styles.descriptionText}>{workout.workoutTemplate.description}</Text>
          </View>
        )}

        {/* Coach Notes */}
        {workout.notes && (
          <View style={styles.notesCard}>
            <Text style={styles.notesLabel}>Coach notities</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        {/* Exercises List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oefeningen</Text>
          {workout.workoutTemplate.exercises.map((item, index) => {
            const imageUrl = item.exercise?.gifUrl || item.exercise?.thumbnailUrl;
            const exerciseLogs = item.exercise?.id ? logsByExercise[item.exercise.id] : undefined;
            return (
              <View key={item.id} style={styles.exerciseCard}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.exerciseImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                )}
                <View style={styles.exerciseContent}>
                  <Text style={styles.exerciseName}>{item.exercise?.name || 'Oefening'}</Text>
                  <View style={styles.exerciseMeta}>
                    {item.sets && (
                      <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{item.sets} sets</Text>
                      </View>
                    )}
                    {item.reps && (
                      <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{item.reps} reps</Text>
                      </View>
                    )}
                    {item.restSeconds && (
                      <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>{item.restSeconds}s rust</Text>
                      </View>
                    )}
                  </View>
                  {/* Prescription info */}
                  {(() => {
                    const label = getPrescriptionLabel(item);
                    return label || item.tempo ? (
                      <View style={styles.prescriptionRow}>
                        {label && (
                          <View style={styles.prescriptionChip}>
                            <Ionicons name="fitness-outline" size={11} color={theme.colors.primary} />
                            <Text style={styles.prescriptionText}>{label}</Text>
                          </View>
                        )}
                        {item.tempo && (
                          <View style={styles.prescriptionChip}>
                            <Ionicons name="timer-outline" size={11} color={theme.colors.primary} />
                            <Text style={styles.prescriptionText}>Tempo {item.tempo}</Text>
                          </View>
                        )}
                      </View>
                    ) : null;
                  })()}
                  {item.exercise?.muscleGroups && (
                    <Text style={styles.muscleText}>
                      {(item.exercise.muscleGroups as string[]).join(', ')}
                    </Text>
                  )}
                  {item.notes && (
                    <Text style={styles.exerciseNotes}>{item.notes}</Text>
                  )}

                  {/* Logged sets (current week) */}
                  {exerciseLogs && exerciseLogs.length > 0 && (
                    <View style={styles.loggedSets}>
                      {exerciseLogs
                        .sort((a, b) => a.setNumber - b.setNumber)
                        .map((log) => (
                        <View key={log.id} style={styles.logRow}>
                          <View style={styles.logSetBadge}>
                            <Text style={styles.logSetBadgeText}>{log.setNumber}</Text>
                          </View>
                          <Text style={styles.logText}>
                            {log.repsCompleted} reps
                            {log.weightKg != null ? ` × ${log.weightKg} kg` : ''}
                          </Text>
                          {log.actualRpe != null && (
                            <View style={styles.logPill}>
                              <Text style={styles.logPillText}>RPE {log.actualRpe}</Text>
                            </View>
                          )}
                          {log.actualRir != null && (
                            <View style={styles.logPill}>
                              <Text style={styles.logPillText}>RIR {log.actualRir}</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Previous week's data */}
                  {(() => {
                    const prevLogs = item.exercise?.id ? prevLogsByExercise[item.exercise.id] : undefined;
                    if (!prevLogs || prevLogs.length === 0) return null;
                    return (
                      <View style={styles.prevWeekSection}>
                        <Text style={styles.prevWeekLabel}>Vorige week</Text>
                        {prevLogs
                          .sort((a, b) => a.setNumber - b.setNumber)
                          .map((log, idx) => (
                          <View key={idx} style={styles.prevWeekRow}>
                            <View style={styles.prevWeekBadge}>
                              <Text style={styles.prevWeekBadgeText}>{log.setNumber}</Text>
                            </View>
                            <Text style={styles.prevWeekText}>
                              {log.repsCompleted} reps
                              {log.weightKg != null ? ` × ${log.weightKg} kg` : ''}
                            </Text>
                            {log.actualRpe != null && (
                              <Text style={styles.prevWeekPill}>RPE {log.actualRpe}</Text>
                            )}
                          </View>
                        ))}
                      </View>
                    );
                  })()}
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        {!workout.completed && (
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                if (isFromTemplate) {
                  navigation.navigate('ActiveWorkout', {
                    templateData,
                    weekNumber: resolvedWeekNumber,
                    clientProgramId: resolvedProgramId,
                  });
                } else {
                  navigation.navigate('ActiveWorkout', {
                    workoutId: workout.id,
                    weekNumber: resolvedWeekNumber,
                    clientProgramId: resolvedProgramId,
                  });
                }
              }}
            >
              <Ionicons name="play-circle" size={22} color="#fff" />
              <Text style={styles.startButtonText}>
                {workoutLogs.length > 0 ? 'Doorgaan' : 'Start Workout'}
              </Text>
            </TouchableOpacity>
            {!isFromTemplate && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
                disabled={completeWorkoutMutation.isPending}
              >
                {completeWorkoutMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={22} color="#fff" />
                    <Text style={styles.completeButtonText}>Direct Voltooien</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {workout.completed && (
          <View style={{ gap: 10 }}>
            <View style={styles.completedBanner}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.completedText}>
                Voltooid{workout.completedAt ? ` op ${new Date(workout.completedAt).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}` : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              disabled={reopening}
            >
              {reopening ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <>
                  <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.editButtonText}>Bewerken</Text>
                </>
              )}
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeCompleted: {
    backgroundColor: '#d1fae5',
  },
  badgePending: {
    backgroundColor: '#dbeafe',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  notesCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  exerciseImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: theme.colors.border,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  metaChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  prescriptionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  prescriptionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ede9fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  prescriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  muscleText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  exerciseNotes: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  // Logged sets
  loggedSets: {
    marginTop: 8,
    gap: 4,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: '#f0fdf4',
    borderRadius: 6,
  },
  logSetBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#bbf7d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logSetBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  logText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
  },
  logPill: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  // Buttons
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  completedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#065f46',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  // Previous week reference
  prevWeekSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 3,
  },
  prevWeekLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  prevWeekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  prevWeekBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevWeekBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textTertiary,
  },
  prevWeekText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  prevWeekPill: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textTertiary,
  },
});
