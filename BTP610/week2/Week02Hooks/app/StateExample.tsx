import { createContext, useContext, useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function StateExample() {

    const UserContext = createContext("");

    function Component1() {
        const [username, setUsername] = useState<string>("seneca123");

        return (

            <UserContext.Provider value={username}>
                <Text style={{ fontSize: 24 }}>Component 1</Text>
                <Text style={{ fontSize: 24 }}>Hello {username}</Text>
                <Component2 />
            </UserContext.Provider>


            // <View>
            //     <Text style={{ fontSize: 24 }}>Component 1</Text>
            //     <Text style={{ fontSize: 24 }}>Hello {username}</Text>
            //     <Component2 user={username} />
            // </View>
        )
    }

    function Component2() {
        return (
            <View>
                <Text style={{ fontSize: 24 }}>Component 2</Text>
                <Component3 />
            </View>
        )
    }

    // function Component2({ user }) {
    //     return (
    //         <View>
    //             <Text style={{ fontSize: 24 }}>Component 2</Text>
    //             <Component3 user={user} />
    //         </View>
    //     )
    // }

    function Component3() {
        return (
            <View>
                <Text style={{ fontSize: 24 }}>Component 3</Text>
                <Component4 />
            </View>
        )
    }

    function Component4() {
        const finalUsername = useContext(UserContext);
        return (
            <View>
                <Text style={{ fontSize: 24 }}>Component 4</Text>
                <Text style={{ fontSize: 24 }}>Hello Again {finalUsername}</Text>
            </View>
        )
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Component1 />
        </View>
    );
}
