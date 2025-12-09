import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { theme } from "../constants/theme";

export default function DrawerContent(props: any) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    props.navigation.closeDrawer();
    await logout();
    router.replace("/public-rates");
  };

  const handleNavigation = (screen: string) => {
    props.navigation.closeDrawer();
    router.push(screen as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Text>
            </View>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </LinearGradient>
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/(tabs)/historical")}
          >
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: theme.colors.warning + "15" },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={theme.colors.warning}
              />
            </View>
            <Text style={styles.menuText}>Historical Rates</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: theme.colors.primary + "15" },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.menuText}>Profile</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: theme.colors.secondary + "15" },
              ]}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={theme.colors.secondary}
              />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: theme.colors.success + "15" },
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={theme.colors.success}
              />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: theme.colors.text.secondary + "15" },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.colors.text.secondary}
              />
            </View>
            <Text style={styles.menuText}>About</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: theme.colors.danger + "15" },
            ]}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={theme.colors.danger}
            />
          </View>
          <Text style={[styles.menuText, { color: theme.colors.danger }]}>
            Logout
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>Kantor v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  profileCard: {
    padding: theme.spacing.xl,
    paddingTop: 60,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  avatarText: {
    ...theme.typography.title1,
    color: "#fff",
    fontWeight: "700",
  },
  userName: {
    ...theme.typography.title2,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    ...theme.typography.subheadline,
    color: "rgba(255, 255, 255, 0.8)",
  },
  languageSwitcherContainer: {
    marginTop: theme.spacing.lg,
  },
  menuSection: {
    paddingHorizontal: theme.spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  menuText: {
    ...theme.typography.callout,
    color: theme.colors.text.primary,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  version: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
});
