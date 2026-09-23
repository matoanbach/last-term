import React from "react"
import { Text, View, Alert, TouchableOpacity, TextInput } from "react-native"
import { Book } from "@/types/Book"
import { useEffect, useState } from "react"
import { styles } from "@/CustomStyle" 
import { useNavigation } from "expo-router"
import {MaterialCommunityIcons} from "@expo/MaterialCommunityIcons"
import { firebaseAuth } from "@/firebaseConfig"
import { addDoc, collection } from "firebase/firestore"

export default function NewBook() {
    const navigation = useNavigation();

    const [bookObject, setBookObject] = useState({
        id: "",
        title: "",
        author: "",
        genre: "",
        uid: ""
    })

    // add reset icon to the header
    useEffect(() => {
        navigation.setOptions({
            headerRight: (
                <MaterialCommunityIcons name="reload" size={32} color="black"
                    onPress={() => {
                        setBookObject({...bookObject, title: "", genre: ""})
                    }}
                />
            )
        })
    }, [])

    const addBook = async () => {
        try {
            if(bookObject.title==="" || bookObject.author==="" || bookObject.genre===""){
                Alert.alert("Error", "Please provide all the fields")
                return;
            }

            const newBook = {
                title:bookObject.title,
                author:bookObject.author,
                genre:bookObject.genre,
                uid:firebaseAuth.currentUser?.uid // who added this book
            }

            const collectionRef=collection(fireDB, "BookDB")
            const docRef=await addDoc(collectionRef, newBook)

            Alert.alert("Success", `${bookObject.title} is added: ${docRef.id}`)
            setBookObject({...bookObject, title: "", author: "", genre: ""})
        } catch (error: any) {
            console.log(error)
        }
    }

    return (
        <View>
            <TextInput style={styles.inputStyle} value={bookObject.title} onChangeText={(text: any)=>setBookObject({...bookObject, title: text})}
                placeholder="Title" autoCorrect={false} autoCapitalize="words"
            />

            <TextInput style={styles.inputStyle} value={bookObject.title} onChangeText={(text: any)=>setBookObject({...bookObject, author: text})}
                placeholder="Author" autoCorrect={false} autoCapitalize="words"
            />

            <TextInput style={styles.inputStyle} value={bookObject.title} onChangeText={(text: any)=>setBookObject({...bookObject, genre: text})}
                placeholder="Genre" autoCorrect={false} autoCapitalize="words"
            />
            <TouchableOpacity style={styles.buttonStyle}
            >
                <Text style={styles.buttonText}>Add Book</Text>
            </TouchableOpacity>
        </View>
    )
}