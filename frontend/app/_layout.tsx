import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import DrawerContent from "../components/DrawerContent";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Drawer
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: "front",
          }}
        >
          <Drawer.Screen
            name="index"
            options={{ drawerItemStyle: { display: "none" } }}
          />
          <Drawer.Screen
            name="public-rates"
            options={{ drawerItemStyle: { display: "none" } }}
          />

          <Drawer.Screen
            name="(auth)"
            options={{ drawerItemStyle: { display: "none" } }}
          />
          <Drawer.Screen
            name="(tabs)"
            options={{ drawerItemStyle: { display: "none" } }}
          />
        </Drawer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
