import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabsLayout() {
  const navigation = useNavigation();

  const openMenu = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderIcon = (name: IconName, color: string, size: number) => {
    return <Ionicons name={name} size={size} color={color} />;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerLeft: () => (
          <TouchableOpacity onPress={openMenu} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#3498db" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Rates",
          tabBarIcon: ({ color, size }) => renderIcon("stats-chart", color, size),
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: "Charts",
          tabBarIcon: ({ color, size }) => renderIcon("bar-chart", color, size),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => renderIcon("wallet", color, size),
        }}
      />
      <Tabs.Screen
        name="exchange"
        options={{
          title: "Exchange",
          tabBarIcon: ({ color, size }) => renderIcon("swap-horizontal", color, size),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => renderIcon("list", color, size),
        }}
      />
      <Tabs.Screen
        name="historical"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}