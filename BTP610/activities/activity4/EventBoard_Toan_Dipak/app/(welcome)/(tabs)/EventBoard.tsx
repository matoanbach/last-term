import { styles } from "@/CustomStyle";
import { firebaseAuth, fireDB } from "@/firebaseConfig";
import { Event } from "@/types/Event";
import MaterialIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EventBoard() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editEventObject, setEditEventObject] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const subscriber = onSnapshot(collection(fireDB, "EventDB"), {
      next: (snapshot) => {
        const localEvents: Event[] = [];

        snapshot.docs.forEach((eventDoc) => {
          const data = eventDoc.data();
          localEvents.push({
            id: eventDoc.id,
            title: data.title,
            date: data.date,
            location: data.location,
            description: data.description,
            uid: data.uid,
            postedBy: data.postedBy,
          });
        });

        setEventList(localEvents);
      },
    });

    return () => subscriber();
  }, []);

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setEditEventObject({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
    });
    setModalVisible(true);
  };

  const deleteEvent = (event: Event) => {
    const eventRef = doc(fireDB, `EventDB/${event.id}`);

    Alert.alert(event.title, "Are you sure you want to delete this event?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await deleteDoc(eventRef);
        },
      },
    ]);
  };

  const updateEvent = async () => {
    if (!selectedEvent) {
      return;
    }

    if (
      editEventObject.title === "" ||
      editEventObject.date === "" ||
      editEventObject.location === "" ||
      editEventObject.description === ""
    ) {
      Alert.alert("Error", "Please provide all the fields");
      return;
    }

    try {
      const eventRef = doc(fireDB, `EventDB/${selectedEvent.id}`);

      await updateDoc(eventRef, {
        title: editEventObject.title,
        date: editEventObject.date,
        location: editEventObject.location,
        description: editEventObject.description,
      });

      setModalVisible(false);
      setSelectedEvent(null);
    } catch (error) {
      console.log(error);
    }
  };

  const EventItem = ({ event }: { event: Event }) => {
    const isOwner = event.uid === firebaseAuth.currentUser?.uid;

    return (
      <View
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#dcdde1",
          borderRadius: 8,
          padding: 15,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0a3d62" }}>{event.title}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Date: {event.date}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Location: {event.location}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Description: {event.description}</Text>
        <Text style={{ fontSize: 16, marginTop: 4 }}>Posted By: {event.postedBy}</Text>

        {isOwner && (
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <TouchableOpacity onPress={() => openEditModal(event)} style={{ marginRight: 15 }}>
              <MaterialIcons name="file-edit" size={28} color="#0a3d62" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteEvent(event)}>
              <MaterialIcons name="delete" size={28} color="#c23616" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        data={eventList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem event={item} />}
        ListEmptyComponent={<Text style={{ fontSize: 18, marginTop: 20 }}>No events yet</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Event</Text>

            <TextInput
              style={styles.inputStyle}
              value={editEventObject.title}
              onChangeText={(text) => setEditEventObject({ ...editEventObject, title: text })}
              placeholder="Event Title"
              autoCapitalize="words"
            />

            <TextInput
              style={styles.inputStyle}
              value={editEventObject.date}
              onChangeText={(text) => setEditEventObject({ ...editEventObject, date: text })}
              placeholder="Date"
              autoCapitalize="words"
            />

            <TextInput
              style={styles.inputStyle}
              value={editEventObject.location}
              onChangeText={(text) => setEditEventObject({ ...editEventObject, location: text })}
              placeholder="Location"
              autoCapitalize="words"
            />

            <TextInput
              style={[styles.inputStyle, { height: 120 }]}
              value={editEventObject.description}
              onChangeText={(text) => setEditEventObject({ ...editEventObject, description: text })}
              placeholder="Description"
              multiline
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.smallButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallButton} onPress={updateEvent}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
