import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../constants/theme';

interface MacroRingProps {
  /** Current value */
  value: number;
  /** Target value (0 = no target) */
  target: number;
  /** Label below the value */
  label: string;
  /** Color of the progress ring */
  color: string;
  /** Unit suffix (default: '') */
  unit?: string;
  /** Ring size (default: 70) */
  size?: number;
}

export default function MacroRing({
  value,
  target,
  label,
  color,
  unit = '',
  size = 70,
}: MacroRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(value / target, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color + '20'}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress ring */}
          {target > 0 && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          )}
        </Svg>
        <View style={[styles.valueContainer, { width: size, height: size }]}>
          <Text style={[styles.value, { fontSize: size > 80 ? 18 : 14 }]}>
            {value}
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </Text>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
      {target > 0 && (
        <Text style={styles.target}>/ {target}{unit}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valueContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  unit: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  target: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginTop: 1,
  },
});
