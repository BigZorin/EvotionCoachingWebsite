import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

type Props = {
  status: 'pending' | 'rejected';
  rejectionReason?: string | null;
  onLogout: () => void;
};

export default function PendingApprovalScreen({
  status,
  rejectionReason,
  onLogout,
}: Props) {
  const isRejected = status === 'rejected';
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Branded header with safe area */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Image
          source={require('../../../assets/images/evotion-logo-white.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            isRejected ? styles.iconCircleRejected : styles.iconCirclePending,
          ]}
        >
          <Ionicons
            name={isRejected ? 'close-circle' : 'hourglass'}
            size={48}
            color={isRejected ? theme.colors.error : theme.colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {isRejected ? 'Aanvraag afgewezen' : 'Wacht op goedkeuring'}
        </Text>

        <Text style={styles.subtitle}>
          {isRejected
            ? 'Je aanvraag is helaas afgewezen door je coach.'
            : 'Je account is aangemaakt en je intake is ontvangen. Je coach beoordeelt je aanvraag zo snel mogelijk.'}
        </Text>

        {isRejected && rejectionReason && (
          <View style={styles.reasonCard}>
            <Text style={styles.reasonLabel}>Reden</Text>
            <Text style={styles.reasonText}>{rejectionReason}</Text>
          </View>
        )}

        {!isRejected && (
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle"
              size={20}
              color={theme.colors.secondary}
            />
            <Text style={styles.infoText}>
              Je ontvangt automatisch toegang zodra je bent goedgekeurd. Dit
              scherm wordt dan automatisch bijgewerkt.
            </Text>
          </View>
        )}
      </View>

      {/* Logout button with safe area */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.logoutText}>Uitloggen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    height: 32,
    width: 140,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconCirclePending: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  iconCircleRejected: {
    backgroundColor: `${theme.colors.error}15`,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  reasonCard: {
    backgroundColor: `${theme.colors.error}10`,
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: `${theme.colors.error}30`,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.error,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  reasonText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: `${theme.colors.secondary}10`,
    borderRadius: 12,
    padding: 14,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: theme.colors.disabled,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
});
