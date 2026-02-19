import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../hooks/useUser';
import { useTodayCheckIn, useDailyCheckInHistory } from '../../hooks/useDailyCheckIn';
import { useCurrentCheckIn } from '../../hooks/useCheckIn';
import { useCheckInSettings } from '../../hooks/useCheckInSettings';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useProgressChartData } from '../../hooks/useProgressChartData';
import { useDailyMacros, useNutritionTargets } from '../../hooks/useNutrition';
import { useActiveMealPlan } from '../../hooks/useMealPlan';
import { useHabits, useHabitLogs, useToggleHabit } from '../../hooks/useHabits';
import { useUnreadCount } from '../../hooks/useMessages';
import { theme } from '../../constants/theme';
import MacroRing from '../../components/MacroRing';
import WeightTrendCard from '../../components/charts/WeightTrendCard';

const evotionFavicon = require('../../../assets/images/evotion-favicon-wit.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAY_NAMES = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
const DAY_NAMES_FULL = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

function getDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Goedemorgen';
  if (h < 18) return 'Goedemiddag';
  return 'Goedenavond';
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data: userData } = useUser();
  const { data: todayCheckIn, isLoading: dailyLoading } = useTodayCheckIn();
  const { data: weeklyCheckIn, isLoading: weeklyLoading } = useCurrentCheckIn();
  const { data: checkInSettings } = useCheckInSettings();
  const { data: allWorkouts = [] } = useWorkouts('all');
  const { weightData } = useProgressChartData();
  const { data: nutritionTargets } = useNutritionTargets();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: mealPlan } = useActiveMealPlan();

  const today = getToday();
  const macros = useDailyMacros(today);

  const { data: habits = [] } = useHabits();
  const { data: habitLogs = [] } = useHabitLogs(today);
  const toggleHabit = useToggleHabit();

  const { data: checkInHistory = [] } = useDailyCheckInHistory(14);

  const firstName = userData?.profile?.first_name || 'daar';
  const hasDailyCheckIn = !dailyLoading && !!todayCheckIn;

  // Build 5-day strip: 4 past days + today (today on the right)
  const weekStrip = useMemo(() => {
    const completedDates = new Set(
      checkInHistory.map((c: any) => c.check_in_date || c.checkInDate)
    );
    if (todayCheckIn) completedDates.add(today);

    const days = [];
    const now = new Date();
    for (let i = -4; i <= 0; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dateStr = getDateStr(d);
      const isToday = i === 0;
      const isPast = i < 0;
      const completed = completedDates.has(dateStr);
      days.push({
        key: dateStr,
        dayName: DAY_NAMES[d.getDay()],
        dayNum: d.getDate(),
        isToday,
        isPast,
        completed,
      });
    }
    return days;
  }, [checkInHistory, todayCheckIn, today]);

  // Check-in logic: weekly only on the configured day
  const todayDayOfWeek = new Date().getDay();
  const isWeeklyDay = todayDayOfWeek === (checkInSettings?.weeklyCheckInDay ?? 0);
  const dailyCheckInDue = !dailyLoading && !todayCheckIn && !isWeeklyDay;
  const weeklyCheckInDue = !weeklyLoading && !weeklyCheckIn && isWeeklyDay;

  // Today's workout
  // Find today's workout and next upcoming workout
  const { todaysWorkout, nextWorkout, nextWorkoutDay } = useMemo(() => {
    const uncompleted = allWorkouts
      .filter((w: any) => !w.completed)
      .map((w: any) => ({
        ...w,
        _date: w.scheduledDate || w.scheduled_date || '',
      }))
      .sort((a: any, b: any) => a._date.localeCompare(b._date));

    const todayW = uncompleted.find((w: any) => w._date.startsWith(today)) || null;

    let nextW = null;
    let nextDay = '';
    if (!todayW) {
      // Find closest future workout (date > today), or fallback to first uncompleted
      nextW = uncompleted.find((w: any) => w._date > today) || uncompleted[0] || null;
      if (nextW) {
        const d = new Date(nextW._date);
        if (!isNaN(d.getTime())) {
          const todayDate = new Date(today);
          const diffDays = Math.round((d.getTime() - todayDate.getTime()) / 86400000);
          if (diffDays === 1) {
            nextDay = 'Morgen';
          } else if (diffDays > 1 && diffDays < 7) {
            nextDay = DAY_NAMES_FULL[d.getDay()];
          } else if (nextW._date) {
            nextDay = `${d.getDate()} ${['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'][d.getMonth()]}`;
          }
        }
      }
    }

    return { todaysWorkout: todayW, nextWorkout: nextW, nextWorkoutDay: nextDay };
  }, [allWorkouts, today]);

  // Nutrition targets (from nutrition_targets table, fallback to meal plan macros)
  const calTarget = nutritionTargets?.dailyCalories || mealPlan?.dailyCalories || 0;
  const proteinTarget = nutritionTargets?.dailyProteinGrams || mealPlan?.proteinGrams || 0;
  const carbsTarget = nutritionTargets?.dailyCarbsGrams || mealPlan?.carbsGrams || 0;
  const fatTarget = nutritionTargets?.dailyFatGrams || mealPlan?.fatGrams || 0;
  const hasNutritionTargets = calTarget > 0 || proteinTarget > 0;

  // Today's meal plan entries
  const todayMealPlanMeals = useMemo(() => {
    if (!mealPlan?.entries?.length) return 0;
    const jsDay = new Date().getDay();
    const dayOfWeek = jsDay === 0 ? 7 : jsDay;
    return mealPlan.entries.filter((e) => e.dayOfWeek === dayOfWeek).length;
  }, [mealPlan]);

  // Habits
  const completedHabitIds = new Set(habitLogs.map((l: any) => l.habit_id || l.habitId));
  const activeHabits = habits.filter((h: any) => h.is_active !== false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Branded Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoWrap}>
            <Image source={evotionFavicon} style={styles.headerLogo} resizeMode="contain" />
          </View>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{firstName}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => navigation.navigate('ChatList' as never)}
        >
          <Ionicons name="chatbubble" size={18} color="#fff" />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Daily Check-in Week Strip ── */}
        <View style={styles.weekStripCard}>
          <Text style={styles.weekStripTitle}>Dagelijkse check-in</Text>
          <View style={styles.weekStripRow}>
            {weekStrip.map((day) => {
              const isCompleted = day.completed;
              const isMissed = day.isPast && !isCompleted;
              return (
                <TouchableOpacity
                  key={day.key}
                  style={[
                    styles.weekStripTile,
                    isMissed && styles.weekStripTileMissed,
                    isCompleted && !day.isToday && styles.weekStripTilePastDone,
                    day.isToday && (isCompleted ? styles.weekStripTileTodayDone : styles.weekStripTileToday),
                  ]}
                  activeOpacity={day.isToday ? 0.7 : 1}
                  onPress={day.isToday ? () => navigation.navigate('DailyCheckIn' as never) : undefined}
                >
                  {isCompleted && (
                    <Ionicons
                      name="checkmark"
                      size={day.isToday ? 18 : 15}
                      color={day.isToday ? '#fff' : theme.colors.success}
                      style={styles.weekStripCheck}
                    />
                  )}
                  <Text style={[
                    styles.weekStripDayName,
                    isMissed && styles.weekStripDayNameMissed,
                    isCompleted && !day.isToday && styles.weekStripDayNamePastDone,
                    day.isToday && styles.weekStripDayNameToday,
                  ]}>
                    {day.dayName.toUpperCase()}
                  </Text>
                  <Text style={[
                    styles.weekStripDayNum,
                    isMissed && styles.weekStripDayNumMissed,
                    isCompleted && !day.isToday && styles.weekStripDayNumPastDone,
                    day.isToday && styles.weekStripDayNumToday,
                  ]}>
                    {day.dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {weeklyCheckInDue && (
          <TouchableOpacity
            style={styles.weeklyCardBig}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CheckIn' as never)}
          >
            <View style={styles.weeklyOverlay}>
              <View style={styles.weeklyContent}>
                <View style={styles.weeklyIconCircle}>
                  <Ionicons name="clipboard-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.weeklyBigTitle}>Tijd voor een check-in</Text>
                <Text style={styles.weeklyBigSub}>
                  Deel je voortgang en laatste status met je coach
                </Text>
                <View style={styles.weeklyBtn}>
                  <Text style={styles.weeklyBtnText}>Start check-in</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Today's Training ── */}
        {todaysWorkout && (
          <TouchableOpacity
            style={styles.trainingCard}
            activeOpacity={0.7}
            onPress={() =>
              (navigation as any).navigate('WorkoutDetail', { id: todaysWorkout.id })
            }
          >
            <View style={styles.trainingRow}>
              <View style={styles.trainingIconWrap}>
                <Ionicons name="barbell-outline" size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trainingLabel}>Training vandaag</Text>
                <Text style={styles.trainingName} numberOfLines={1}>
                  {todaysWorkout.workoutTemplate?.name || 'Workout'}
                </Text>
              </View>
              <View style={styles.startBtn}>
                <Ionicons name="play" size={14} color="#fff" />
                <Text style={styles.startBtnText}>Start</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {!todaysWorkout && nextWorkout && (
          <TouchableOpacity
            style={styles.trainingCard}
            activeOpacity={0.7}
            onPress={() =>
              (navigation as any).navigate('WorkoutDetail', { id: nextWorkout.id })
            }
          >
            <View style={styles.trainingRow}>
              <View style={styles.trainingIconWrap}>
                <Ionicons name="barbell-outline" size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.trainingLabel, { color: theme.colors.textSecondary }]}>
                  Volgende training{nextWorkoutDay ? ` · ${nextWorkoutDay}` : ''}
                </Text>
                <Text style={styles.trainingName} numberOfLines={1}>
                  {nextWorkout.workoutTemplate?.name || 'Workout'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
            </View>
          </TouchableOpacity>
        )}

        {/* ── Nutrition ── */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => (navigation as any).navigate('Voeding')}
        >
          <View style={styles.nutritionHeader}>
            <Text style={styles.cardTitle}>Voeding vandaag</Text>
            {todayMealPlanMeals > 0 && (
              <View style={styles.mealPlanBadge}>
                <Ionicons name="restaurant-outline" size={12} color={theme.colors.primary} />
                <Text style={styles.mealPlanBadgeText}>{todayMealPlanMeals} maaltijden</Text>
              </View>
            )}
          </View>
          <View style={styles.nutritionLayout}>
            {/* Big kcal ring on the left */}
            <MacroRing
              value={macros.calories}
              target={calTarget}
              label="kcal"
              color="#FF9500"
              size={120}
            />
            {/* Macros stacked on the right */}
            <View style={styles.macroStack}>
              {[
                { label: 'Eiwit', value: macros.protein, target: proteinTarget, color: '#ff3b30' },
                { label: 'Koolh.', value: macros.carbs, target: carbsTarget, color: '#007AFF' },
                { label: 'Vet', value: macros.fat, target: fatTarget, color: '#FFCC00' },
              ].map((m) => (
                <View key={m.label} style={styles.macroStackItem}>
                  <View style={[styles.macroDot, { backgroundColor: m.color }]} />
                  <View style={styles.macroInfo}>
                    <Text style={styles.macroLabel}>{m.label}</Text>
                    <Text style={styles.macroValue}>
                      {m.value}<Text style={styles.macroUnit}>g</Text>
                      {m.target > 0 && (
                        <Text style={styles.macroTarget}> / {m.target}</Text>
                      )}
                    </Text>
                  </View>
                  {m.target > 0 && (
                    <View style={styles.macroBar}>
                      <View style={[styles.macroBarFill, {
                        backgroundColor: m.color,
                        width: `${Math.min((m.value / m.target) * 100, 100)}%`,
                      }]} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
          {!hasNutritionTargets && (
            <View style={styles.noTargetsHint}>
              <Ionicons name="information-circle-outline" size={14} color={theme.colors.textTertiary} />
              <Text style={styles.noTargetsText}>Geen doelen ingesteld door coach</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ── Habits ── */}
        {activeHabits.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gewoontes</Text>
            <View style={styles.habitsGrid}>
              {activeHabits.map((habit: any) => {
                const done = completedHabitIds.has(habit.id);
                return (
                  <TouchableOpacity
                    key={habit.id}
                    style={[styles.habitChip, done && styles.habitChipDone]}
                    activeOpacity={0.7}
                    onPress={() =>
                      toggleHabit.mutate({
                        habitId: habit.id,
                        date: today,
                        completed: !done,
                      })
                    }
                  >
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={done ? theme.colors.success : theme.colors.textTertiary}
                    />
                    <Text
                      style={[styles.habitChipText, done && styles.habitChipTextDone]}
                      numberOfLines={1}
                    >
                      {habit.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Weight Trend ── */}
        <WeightTrendCard data={weightData} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.primary, // #1e1839
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  chatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff3b30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // ── Week Strip (Kahunas style) ──
  weekStripCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  weekStripTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 10,
  },
  weekStripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  weekStripTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    minHeight: 68,
  },
  weekStripTileToday: {
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  weekStripTileTodayDone: {
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  weekStripTilePastDone: {
    backgroundColor: theme.colors.success + '15',
  },
  weekStripTileMissed: {
    backgroundColor: '#f3f4f6',
  },
  weekStripCheck: {
    marginBottom: 1,
  },
  weekStripDayName: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },
  weekStripDayNameToday: {
    color: 'rgba(255,255,255,0.7)',
  },
  weekStripDayNamePastDone: {
    color: theme.colors.success,
  },
  weekStripDayNameMissed: {
    color: theme.colors.textTertiary,
  },
  weekStripDayNum: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  weekStripDayNumToday: {
    color: '#fff',
    fontSize: 17,
  },
  weekStripDayNumPastDone: {
    color: theme.colors.success,
  },
  weekStripDayNumMissed: {
    color: theme.colors.textTertiary,
  },

  // ── Weekly Check-in (Lenus style) ──
  weeklyCardBig: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: theme.colors.primary,
  },
  weeklyOverlay: {
    padding: 24,
  },
  weeklyContent: {
    alignItems: 'center',
  },
  weeklyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  weeklyBigTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  weeklyBigSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  weeklyBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  weeklyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // ── Training Card ──
  trainingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trainingName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Card ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 14,
  },

  // ── Nutrition ──
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 14,
  },
  mealPlanBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  noTargetsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  noTargetsText: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  nutritionLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  macroStack: {
    flex: 1,
    gap: 12,
  },
  macroStackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroInfo: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  macroValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  macroTarget: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.colors.textTertiary,
  },
  macroBar: {
    position: 'absolute',
    bottom: -2,
    left: 16,
    right: 0,
    height: 3,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ── Habits ──
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  habitChipDone: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  habitChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    maxWidth: SCREEN_WIDTH / 2 - 60,
  },
  habitChipTextDone: {
    color: theme.colors.success,
  },
});
