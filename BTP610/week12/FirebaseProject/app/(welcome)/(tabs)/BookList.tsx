import React from "react"
import { Text, View, Alert, TouchableOpacity, FlatList } from "react-native"
import { styles } from "@/CustomStyle"
import { useEffect, useState } from "react"
import { Book } from "@/types/Book"
import { collection, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore"
import { fireDB } from "@/firebaseConfig"
import MaterialIcons from "@expo/vector-icons/MaterialCommunityIcons"

export default function BookList() {
    const [bookList, setBookList] = useState<Book[]>([])

    useEffect(() => {
        // subscribe to real-time changes on the BookDB collection
        const subscriber = onSnapshot(collection(fireDB, "BookDB"), {
            next: (snapshot) => {
                const localBooks: Book[] = []
                snapshot.docs.forEach((book) => {
                    console.log(`${book.id}-${book.data}`)
                    localBooks.push({
                        id: book.data().id,
                        title: book.data().title,
                        author: book.data().author,
                        genre: book.data().genre,
                        uid: book.data().uid,
                    })
                })
                setBookList(localBooks)
            }
        })

        // unsubscribe when done
        return () => subscriber()
    }, [])
    
    const BookItem({book}: any) => {
        return (
            <TouchableOpacity>
                <View style={{flexDirection: "row", alignItems: "center", padding: 15}}>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "bold", color: ""}}>
                            {book.title}
                        </Text>

                        <Text style={{fontSize: 16, color: ""}}>
                            {book.author}
                        </Text>
                        <Text style={{fontSize: 16, color: ""}}>
                            {book.author}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList style={{width: "100%"}}
                keyExtractor={(item)=>item.id}
                data={bookList}
                renderItem={({item}) => <BookItem book={item}/>}
                ItemSeparatorComponent={()=>{
                    <View />
                }}
            />

        </View>
    )
}