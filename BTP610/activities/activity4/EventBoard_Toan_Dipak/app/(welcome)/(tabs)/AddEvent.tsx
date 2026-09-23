import { styles } from "@/CustomStyle";
import { firebaseAuth, fireDB } from "@/firebaseConfig";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddEvent() {
  const navigation = useNavigation();
  const [eventObject, setEventObject] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  const resetForm = () => {
    setEventObject({
      title: "",
      date: "",
      location: "",
      description: "",
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons name="reload" size={28} color="black" onPress={resetForm} />
      ),
    });
  }, [navigation]);

  const addEvent = async () => {
    if (
      eventObject.title === "" ||
      eventObject.date === "" ||
      eventObject.location === "" ||
      eventObject.description === ""
    ) {
      Alert.alert("Error", "Please provide all the fields");
      return;
    }

    try {
      const newEvent = {
        title: eventObject.title,
        date: eventObject.date,
        location: eventObject.location,
        description: eventObject.description,
        uid: firebaseAuth.currentUser?.uid ?? "",
        postedBy: firebaseAuth.currentUser?.email ?? "Unknown User",
      };

      const collectionRef = collection(fireDB, "EventDB");
      const docRef = await addDoc(collectionRef, newEvent);

      Alert.alert("Success", `${eventObject.title} is added: ${docRef.id}`);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        value={eventObject.title}
        onChangeText={(text) => setEventObject({ ...eventObject, title: text })}
        placeholder="Event Title"
        autoCorrect={false}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.inputStyle}
        value={eventObject.date}
        onChangeText={(text) => setEventObject({ ...eventObject, date: text })}
        placeholder="Date, for example: July 15, 2026"
        autoCorrect={false}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.inputStyle}
        value={eventObject.location}
        onChangeText={(text) => setEventObject({ ...eventObject, location: text })}
        placeholder="Location"
        autoCorrect={false}
        autoCapitalize="words"
      />

      <TextInput
        style={[styles.inputStyle, { height: 120 }]}
        value={eventObject.description}
        onChangeText={(text) => setEventObject({ ...eventObject, description: text })}
        placeholder="Description"
        multiline
      />

      <TouchableOpacity style={styles.buttonStyle} onPress={addEvent}>
        <Text style={styles.buttonText}>Add Event</Text>
      </TouchableOpacity>
    </View>
  );
}
