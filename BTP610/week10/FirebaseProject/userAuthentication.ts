import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "./firebaseConfig";

export function userAuthentication() {
    const[user,setUser]= useState<User|null>(null);

    useEffect(() => {
        const unsubscribe=onAuthStateChanged(firebaseAuth,(user)=>
        {
            setUser(user);
        });

        return unsubscribe;
    },[]);

    return user;
}