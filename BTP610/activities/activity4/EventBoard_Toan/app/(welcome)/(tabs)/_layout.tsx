import { firebaseAuth } from "@/firebaseConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs>
      <Tabs.Screen
        name="EventBoard"
        options={{
          title: "Event Board",
          tabBarActiveTintColor: "#ff9f43",
          tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} />,
          headerRight: () => (
            <MaterialIcons
              name="logout"
              size={24}
              color="black"
              onPress={() => {
                firebaseAuth.signOut();
                router.replace("/signIn");
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="AddEvent"
        options={{
          title: "Add Event",
          tabBarActiveTintColor: "#ff9f43",
          tabBarIcon: ({ color }) => <MaterialIcons name="add-box" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
