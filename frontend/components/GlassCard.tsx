import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../constants/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({
  children,
  style,
  intensity = 20,
}: GlassCardProps) {
  return (
    <BlurView intensity={intensity} style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    backgroundColor: theme.glass.background,
    borderWidth: 1,
    borderColor: theme.glass.border,
  },
  content: {
    padding: theme.spacing.md,
  },
});
