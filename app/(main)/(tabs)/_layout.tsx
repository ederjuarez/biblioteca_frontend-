import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/types/theme";

export default function AdministrationLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          // href: null, //<- oculta la pestaña del tab
          header: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          header: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          header: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="authors"
        options={{
          title: "Authors",
          header: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: "Books",
          header: () => null,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
