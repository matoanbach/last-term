import { styles } from "@/CustomStyle";
import { fireDB } from "@/firebaseConfig";
import { Book } from "@/types/Book";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function BookList() {
    const [bookList,setBookList]=useState<Book[]>([]);

    useEffect (()=>{
        //Subscribe to real-time changes on the BookDB collection
        const subscriber=onSnapshot(collection(fireDB,"BookDB"), {
            next:(snapshot)=> {
                const localBooks: Book[]=[]
                snapshot.docs.forEach((book)=> {
                    console.log(`${book.id}-${book.data().title}`)
                    localBooks.push({
                        id:book.id,
                        title:book.data().title,
                        author:book.data().author,
                        genre:book.data().genre,
                        uid:book.data().uid,
                    });
                });
                setBookList(localBooks);
            }
        });

        //unsubscribe when component unmounts
        return()=>subscriber();

    },[]);

    const BookItem=({book}:any)=> {

        //add Delete and Update
        //Reference to THIS specific book document
        const bookRef=doc(fireDB,`BookDB/${book.id}`);

        const deleteBook=() => {
            Alert.alert(
                `${book.title} by ${book.author}`,
                "Are you sure you want to delete this book?",
                [
                    {text:'No', onPress:()=>console.log("No Pressed"),
                        style:'cancel'},
                    
                        {text:'Yes', onPress:async()=> {await
                            deleteDoc(bookRef); }, style:'default'}
                    
                ]
            )
        }

        const updateBook=async () => {
            try {
                const bookToUpdate= {
                    title:`Updated ${book.title}`,
                    author:`Updated ${book.author}`,
                    genre: `Updated ${book.genre}`
                }

                await updateDoc(bookRef,bookToUpdate);
                console.log("Book Updated");
            } catch (error) {console.log(error)}
        }


        return (
            <TouchableOpacity>
                <View style={{flexDirection:'row',alignItems:'center',padding:15}}>
                    <View>
                        <Text style={{fontSize:20, fontWeight:'bold',color:'rgba(106,137,204,1)'}}>
                            {book.title}
                        </Text>

                        <Text style={{fontSize:16, color:'#e55039'}}>{book.author}</Text>
                        <Text style={{fontSize:16, color:'#78e08f'}}>{book.genre}</Text>
                    </View>

                    <View style={{flexDirection:'row', marginLeft:'auto'}}>
                        <TouchableOpacity activeOpacity={0.4} style={{marginEnd:10}}
                        onPress={updateBook}>
                            <MaterialIcons name="edit-square" size={32} color="rgba(106,137,204,1)"/>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.4} onPress={deleteBook}>
                            <MaterialIcons name="delete" size={32} color="#eb2f06"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
            style={{width:'100%'}}
            keyExtractor={(item)=>item.id}
            data={bookList}
            renderItem={({item})=><BookItem book={item}/>}
            ItemSeparatorComponent={()=> (
                <View style={{height:10}}></View>
    )}
    />
    </View>
    );
}