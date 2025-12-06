// register screen - placeholder
import { View, Text, StyleSheet } from 'react-native';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Register Screen</Text>
      <Text>ekran rejestracji usera</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});