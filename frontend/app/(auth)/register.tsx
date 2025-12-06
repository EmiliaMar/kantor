// register screen
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  // validation
  const validate = () => {
    let valid = true;
    const newErrors = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };

    if (!email) {
      newErrors.email = "Email jest wymagany";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Nieprawidłowy format email";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Hasło musi mieć min. 8 znaków";
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Hasło musi zawierać wielką literę";
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Hasło musi zawierać cyfrę";
      valid = false;
    }

    if (!firstName) {
      newErrors.firstName = "Imię jest wymagane";
      valid = false;
    }

    if (!lastName) {
      newErrors.lastName = "Nazwisko jest wymagane";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // handle register
  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await register(email, password, firstName, lastName);
      // auto-login and redirect handled by AuthContext
      router.replace("/(tabs)");
    } catch (error: any) {
      const errorMessage = error.errors
        ? error.errors.join("\n")
        : error.error || error.message || "Błąd rejestracji";

      Alert.alert("Błąd rejestracji", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* header */}
          <Text style={styles.title}>Kantor</Text>
          <Text style={styles.subtitle}>Utwórz nowe konto</Text>

          {/* first name input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Imię</Text>
            <TextInput
              style={[
                styles.input,
                errors.firstName ? styles.inputError : null,
              ]}
              placeholder="Jan"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setErrors({ ...errors, firstName: "" });
              }}
              autoCapitalize="words"
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}
          </View>

          {/* last name input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nazwisko</Text>
            <TextInput
              style={[styles.input, errors.lastName ? styles.inputError : null]}
              placeholder="Kowalski"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setErrors({ ...errors, lastName: "" });
              }}
              autoCapitalize="words"
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}
          </View>

          {/* email input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="email@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          {/* password input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hasło</Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              placeholder="min. 8 znaków, wielka litera, cyfra"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: "" });
              }}
              secureTextEntry
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>

          {/* register button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Zarejestruj się</Text>
            )}
          </TouchableOpacity>

          {/* login link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Masz już konto? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginLink}>Zaloguj się</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "600",
  },
});
