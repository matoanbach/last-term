// app/_layout.tsx

import { Stack, Tabs } from "expo-router";
import MaterialIcons from "@expo/MaterialIcons"
import { firebaseAuth } from "@/firebaseConfig";
import {useRouter} from "expo-router"
import React from "react";

export default function TabsLayout() {
    const router = useRouter()

    return (
        <Tabs>
            <Tabs.Screen name="BookList" options={{
                title: "Books",
                tabBarActiveTintColor: "#ff9f43",
                tabBarIcon: ({color} => <MaterialIcons name="home" size={24} color={color}></MaterialIcons>)
                headerRight: () => {
                    <MaterialIcons name="exit-to-app" size={24} color="black"
                        onPress = {(firebaseAuth.signOut());
                            router.replace("/signIn")
                        }
                    />
                }
            }}
            />
        </Tabs>
    )
}
