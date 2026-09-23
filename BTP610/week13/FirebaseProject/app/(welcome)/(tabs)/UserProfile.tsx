import { firebaseAuth, fireDB } from "@/firebaseConfig";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

export default function UserProfile () {
    const [profile,setProfile]=useState<DocumentData>({
        email:'N/A', name:'N/A', contact: 'N/A', location: 'N/A'
    });

    const getUserProfile=async () => {
        //Build reference: collection= 'userProfile', doc ID= current user's UID

        const docSnap=await getDoc (
            doc(fireDB,'userProfile',firebaseAuth.currentUser!.uid)
        );

        if (docSnap.exists()) {
            setProfile(docSnap.data());
        }
        else {
            Alert.alert("No profile data found");
        }
    }
    useEffect(()=> {
        getUserProfile(); //Load profile when screen mounts
    },[]);

    return (
        <View style={{flex:1, alignItems:'center', margin:20}}>
            <Text style={{fontSize:20, color:'dodgerblue'}}>Welcome {profile.name}</Text>
            <Text style={{fontSize:20, color:'dodgerblue'}}>{profile.contact}</Text>
            <Text style={{fontSize:20, color:'dodgerblue'}}>{profile.location}</Text>
        </View>
    );

}
