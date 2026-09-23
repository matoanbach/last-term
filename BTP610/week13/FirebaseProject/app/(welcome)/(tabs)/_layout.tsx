import { firebaseAuth } from "@/firebaseConfig";
import MaterialsIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from "expo-router";

export default function TabsLayout() {
    const router=useRouter();
    return (
        <Tabs>
            <Tabs.Screen name="BookList" options ={{
                title:'Books',
                tabBarActiveTintColor: '#ff9f43',
                tabBarIcon: ({color})=><MaterialsIcons name="home" size={24} color={color} />,
                headerRight:() => (
                    <MaterialsIcons name="exit-to-app" size={24} color="black"
                    onPress={()=> {firebaseAuth.signOut();
                        router.replace("/signIn");
                    }} />
                )
            }} />

             <Tabs.Screen name="NewBook" options ={{
                title:'Add Book',
                tabBarActiveTintColor: '#ff9f43',
                tabBarIcon: ({color})=><MaterialsIcons name="info" size={24} color={color} />
             }}/>

             <Tabs.Screen name="UserProfile" options ={{
                title:'Profile',
                tabBarActiveTintColor: '#ff9f43',
                tabBarIcon: ({color})=><MaterialsIcons name="settings" size={24} color={color} />
             }}/>


        </Tabs>
    )
}