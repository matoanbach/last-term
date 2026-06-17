import { Tabs } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from "react";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#fa983a',
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: '700'
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size, color }) => <MaterialIcons name="home" size={24} color={color} />
        }} />

      <Tabs.Screen
        name="screen2"
        options={{
          title: 'About Us',
          tabBarIcon: ({ focused, size, color }) => <MaterialIcons name="info" size={24} color={color} />
        }} />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, size, color }) => <MaterialIcons name="settings" size={24} color={color} />
        }} />
    </Tabs>
  );
}
