import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
      <Text>Witaj, {user?.firstName}!</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Wyloguj</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#e74c3c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
