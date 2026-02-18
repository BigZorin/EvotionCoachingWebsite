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
import { useClientPrograms, programKeys } from '../../hooks/usePrograms';
import { theme } from '../../constants/theme';
import type { ClientProgram } from '../../lib/programApi';

export default function WorkoutsScreen({ navigation }: any) {
  const queryClient = useQueryClient();
  const { data: allPrograms = [], isLoading, isRefetching, refetch } = useClientPrograms();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    }, [queryClient])
  );

  const activePrograms = allPrograms.filter((p: ClientProgram) => p.status === 'active');
  const otherPrograms = allPrograms.filter((p: ClientProgram) => p.status !== 'active');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Programma's laden...</Text>
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
        <Text style={styles.title}>Trainingen</Text>

        {/* Active Programs — Banner + title below */}
        {activePrograms.map((program: ClientProgram) => (
          <TouchableOpacity
            key={program.id}
            style={styles.programCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProgramDetail', { assignmentId: program.id })}
          >
            <View style={styles.programBannerContainer}>
              {program.program.bannerUrl ? (
                <Image
                  source={{ uri: program.program.bannerUrl }}
                  style={styles.programBannerImg}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.programBannerFallback}>
                  <Ionicons name="barbell-outline" size={48} color="rgba(255,255,255,0.15)" />
                </View>
              )}
            </View>
            <View style={styles.programTitleBar}>
              <Text style={styles.programName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{program.program.name}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Completed / Paused */}
        {otherPrograms.length > 0 && (
          <View style={styles.otherSection}>
            <Text style={styles.otherLabel}>AFGEROND / GEPAUZEERD</Text>
            {otherPrograms.map((program: ClientProgram) => {
              const isPaused = program.status === 'paused';
              return (
                <TouchableOpacity
                  key={program.id}
                  style={styles.programCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('ProgramDetail', { assignmentId: program.id })}
                >
                  <View style={[styles.programBannerContainer, styles.programBannerSmall]}>
                    {program.program.bannerUrl ? (
                      <Image
                        source={{ uri: program.program.bannerUrl }}
                        style={[styles.programBannerImg, { opacity: 0.5 }]}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.programBannerFallback, { opacity: 0.5 }]}>
                        <Ionicons name="barbell-outline" size={36} color="rgba(255,255,255,0.15)" />
                      </View>
                    )}
                  </View>
                  <View style={styles.programTitleBar}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.programName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{program.program.name}</Text>
                    </View>
                    <View style={[styles.statusPill, isPaused ? styles.statusPillPaused : styles.statusPillCompleted]}>
                      <Text style={styles.statusPillText}>
                        {isPaused ? 'Gepauzeerd' : 'Voltooid'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Empty state */}
        {allPrograms.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="barbell-outline" size={48} color={theme.colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>Geen programma's</Text>
            <Text style={styles.emptyText}>
              Je coach heeft nog geen trainingsprogramma's{'\n'}aan je toegewezen.
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
  // Program card — banner + title below
  programCard: {
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
  programBannerContainer: {
    height: 180,
  },
  programBannerSmall: {
    height: 120,
  },
  programBannerImg: {
    width: '100%',
    height: '100%',
  },
  programBannerFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  programTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  programName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
    textTransform: 'uppercase',
  },
  // Other programs section
  otherSection: {
    marginTop: 12,
  },
  otherLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 14,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillPaused: {
    backgroundColor: '#f59e0b',
  },
  statusPillCompleted: {
    backgroundColor: '#6b7280',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
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
});
