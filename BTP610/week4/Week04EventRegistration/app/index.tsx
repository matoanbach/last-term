import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Checkbox, RadioButton, Switch } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

// npm install react-native-paper
// npm install react-native-element-dropdown

export default function Index() {

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [eventType, setEventType] = useState<string>("Workshop");
  const [ticketType, setTicketType] = useState<string>("Standard");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const events: string[] = [
    "Workshop",
    "Conference",
    "Webinar"
  ]

  const handleSubmit = () => {
    if (!name || !email) {
      Alert.alert("Error!", "Please enter name and email");
      return;
    }

    if (!termsAccepted) {
      Alert.alert("Accept Terms!", "Please accept terms and conditions!");
      return;
    }

    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seneca Fest</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Fullname"
        keyboardType="default"
        autoCapitalize="words"
        autoCorrect={false} />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false} />
      <View style={[styles.radioButtonRow, { gap: 10 }]}>
        <Text style={[styles.label, { alignSelf: 'flex-start' }]}>Select Event Type</Text>
        <Dropdown
          style={styles.dropdownStyle}
          data={events.map((e) => ({ label: e, value: e }))}
          labelField="label"
          valueField="value"
          placeholder="Select Event Type"
          value={eventType}
          onChange={(item) => { setEventType(item.value) }} />
      </View>

      <Text style={[styles.label, { alignSelf: 'flex-start' }]}>Select Ticket Type</Text>
      <RadioButton.Group
        value={ticketType}
        onValueChange={setTicketType}>
        <View style={styles.radioButtonRow}>
          <RadioButton value="Standard" />
          <Text>Standard</Text>
        </View>
        <View style={styles.radioButtonRow}>
          <RadioButton value="Event Experience" />
          <Text>Event Experience</Text>
        </View>
      </RadioButton.Group>

      <View style={[styles.radioButtonRow, { alignSelf: 'flex-start' }]}>
        <Checkbox
          status={termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => setTermsAccepted(!termsAccepted)} />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>I accept Terms & Conditions.</Text>
      </View>

      <View style={[styles.radioButtonRow, { gap: 10, alignSelf: 'flex-start' }]}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Enable Notifications?</Text>
        <Switch
          value={notificationEnabled}
          onValueChange={setNotificationEnabled} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true} >
        <View style={styles.modalOverlay}>
          <View style={styles.modelContent}>
            <Text style={styles.modalTitle}>Registration Successful</Text>
            <Text>Name: {name}</Text>
            <Text>Email: {email}</Text>
            <Text>Event: {eventType}</Text>
            <Text>Ticket: {ticketType}</Text>
            <Text>Notifications: {notificationEnabled ? "Yes" : "No"}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF'
  },
  title: {
    textAlign: 'center',
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#222f3e',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    fontSize: 18,
    borderRadius: 10,
    width: "100%"
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    width: '50%',
    backgroundColor: '#b71540',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 47, 62, 0.7)'
  },
  modelContent: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10
  },
  dropdownStyle: {
    height: 40,
    width: '60%',
    borderWidth: 2,
    borderColor: '#576574',
    borderRadius: 10,
    paddingHorizontal: 10
  },
})
