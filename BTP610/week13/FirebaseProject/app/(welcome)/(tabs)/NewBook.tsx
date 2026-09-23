import { styles } from "@/CustomStyle";
import { firebaseAuth, fireDB } from "@/firebaseConfig";
import { Book } from "@/types/Book";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "expo-router";
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function NewBook() {
    const navigation=useNavigation();

    const [bookObject,setBookObject]= useState<Book>({
        id:"",
        title:"",
        author:"",
        genre:"",
        uid:""
    });

    //add reset icon to the header

    useEffect(()=> {
        navigation.setOptions({
            headerRight:()=> (
                <MaterialCommunityIcons name="reload" size={32} color="black"
                onPress={()=> {
                    setBookObject({...bookObject,title:"",author:"",genre:""});
                }} />
            )
        })
    },[]);

    const addBook=async() => {
        try {
            if(bookObject.title==="" || bookObject.author==="" || bookObject.genre===""){
                Alert.alert("Error", "Please provide all the fields");
                return;
            }

            const newBook= {
                title:bookObject.title,
                author:bookObject.author,
                genre: bookObject.genre,
                uid:firebaseAuth.currentUser?.uid //who added this book
           }

           const collectionRef=collection(fireDB,'BookDB');
           const docRef=await addDoc(collectionRef,newBook);

           Alert.alert("Success", `${bookObject.title} is added: ${docRef.id}`);
           setBookObject({...bookObject,title:"",author:"",genre:""});
        }
        catch(error) {console.log(error);}
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.inputStyle}
            value={bookObject.title}
            onChangeText={(text)=>setBookObject({...bookObject,title:text})}
            placeholder="Title" autoCorrect={false} autoCapitalize="words" />

             <TextInput style={styles.inputStyle}
            value={bookObject.author}
            onChangeText={(text)=>setBookObject({...bookObject,author:text})}
            placeholder="Author" autoCorrect={false} autoCapitalize="words" />

             <TextInput style={styles.inputStyle}
            value={bookObject.genre}
            onChangeText={(text)=>setBookObject({...bookObject,genre:text})}
            placeholder="Genre" autoCorrect={false} autoCapitalize="words" />

            <TouchableOpacity style={styles.buttonStyle} onPress={addBook}>
                <Text style={styles.buttonText}>Add Book</Text>
            </TouchableOpacity>

        </View>
    );
}

