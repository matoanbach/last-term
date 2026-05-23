import { useState } from "react";
import { Text, View, Image, TextInput, Platform, ScrollView, Button, Alert, Pressable, TouchableOpacity } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'expo-checkbox';
import { RadioButton } from 'react-native-paper';
import RegistrationInfo from "@/models/RegistrationInfo";
import appStyle from "@/styles/AppStyle";

// To use Dropdown
// npm install react-native-element-dropdown

// Checkbox
// npx expo install expo-checkbox

// For RadioButton
// npm install react-native-paper

export default function Index() {
  // Logic/Functional goes here
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("Cloud Computing");
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>(["Newnham", "King"]);
  const [selectedTution, setSelectedTution] = useState<string>("FullTime");

  const [regInfo, setRegInfo] = useState<RegistrationInfo | null>(null)

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const programs: string[] = [
    "AI",
    "Cloud Computing",
    "Cyber Security",
    "Blockchain"
  ]

  const campusOptions: string[] = ["Newnham", "King", "York"]
  const tutionOptions: string[] = ["FullTime", "Scholarship", "OSAP"]

  const pi = 3.14

  const toggleCampusSelection = (campus: string) => {
    setSelectedCampuses((prev) => prev.includes(campus) // check if the toggled campus exists in the selected array
      ? prev.filter((c) => c !== campus) // if yes, remove it
      : [...prev, campus] // otherwise add it
    )
  }

  const validateEmail = (): boolean => {
    if (!email || email.length === 0) {
      setEmailError("Email cannot be empty!");
      return false
    }

    setEmailError("");
    return true
  }

  const confirmRegistration = (): void => {
    let valid: Boolean = true;

    if (name.trim() === "") valid = false
    if (!selectedProgram) valid = false
    if (!selectedTution) valid = false
    if (!validateEmail()) valid = false

    if (!valid) {
      Alert.alert(
        "Incomplete Registration Info",
        "You must provide all the info!",
        [
          {
            text: 'Dismiss',
            style: 'cancel'
          },
          {
            text: 'Modify',
            style: 'default',
            onPress: () => {
              console.log('Modifying the inputs');
            }
          }
        ]
      )
      return
    } else {
      Alert.alert(
        "Confirmation",
        "Do you want to submit the registration info?",
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Confirm',
            style: 'default',
            onPress: () => {
              // create the registration info class
              const info = new RegistrationInfo(
                name,
                email,
                selectedProgram,
                selectedTution,
                selectedCampuses
              );
              setRegInfo(info);
              console.log(`Registration Info: ${JSON.stringify(info)}`);
            }
          }
        ]
      )
    }
  }

  // UI
  return (
    <ScrollView>
      <View style={appStyle.mainView}>
        <Text style={appStyle.title}>User Information</Text>

        <Image
          style={appStyle.imageStyle}
          source={{
            uri: "https://cdn.pixabay.com/photo/2015/09/05/20/02/coding-924920_1280.jpg"
          }} />

        <TextInput
          style={appStyle.inputStyle}
          value={name}
          // onChangeText={(inputString: string) => { setName(inputString) }} 
          onChangeText={setName}
          placeholder="Enter your name"
          autoCapitalize="words"
        />

        <TextInput
          style={appStyle.inputStyle}
          value={email}
          // onChangeText={(inputString: string) => { setName(inputString) }} 
          onChangeText={setEmail}
          placeholder="Enter email address"
          autoCapitalize="none"
          maxLength={50}
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          style={appStyle.inputStyle}
          value={password}
          // onChangeText={(inputString: string) => { setName(inputString) }} 
          onChangeText={setPassword}
          placeholder="Enter password"
          autoCapitalize="none"
          maxLength={15}
          autoComplete="off"
          autoCorrect={false}
          secureTextEntry={true}
        />

        <Text style={appStyle.titleText}>Select Program</Text>
        <Dropdown
          style={appStyle.dropdownStyle}
          data={programs.map((prog) => ({ label: prog, value: prog }))}
          labelField="label"
          valueField="value"
          placeholder="Select Program"
          value={selectedProgram}
          onChange={(item) => { setSelectedProgram(item.value) }} />

        <Text style={appStyle.titleText}>Preferred Campuses</Text>
        {
          campusOptions.map((campus) => (
            <View key={campus} style={appStyle.checkboxRow}>
              <Checkbox
                value={selectedCampuses.includes(campus)}
                onValueChange={() => {
                  toggleCampusSelection(campus)
                }}
                color={selectedCampuses.includes(campus) ? "#54a0ff" : undefined}
              />
              <Text>{campus}</Text>
            </View>
          ))
        }

        <Text style={appStyle.titleText}>Select Tution</Text>
        {
          Platform.OS === 'ios' ? (
            <Dropdown
              style={appStyle.dropdownStyle}
              data={tutionOptions.map((t) => ({ label: t, value: t }))}
              labelField="label"
              valueField="value"
              placeholder="Select Tution"
              value={selectedTution}
              onChange={(item) => { setSelectedTution(item.value) }} />
          ) : (
            Platform.OS === 'android' && (
              <RadioButton.Group
                value={selectedTution}
                onValueChange={(v) => setSelectedTution(v)}>
                {
                  tutionOptions.map((t) => (
                    <View key={t} style={appStyle.checkboxRow}>
                      <RadioButton value={t} />
                      <Text>{t}</Text>
                    </View>
                  ))
                }
              </RadioButton.Group>
            )
          )
        }
        {/* <Button
          title="Registration"
          onPress={() => {
            Alert.alert("Registration", "Registration Completed")
          }} />

        <Pressable style={{
          borderRadius: 10,
          backgroundColor: '#70a1ff',
          alignItems: 'center',
          marginVertical: 10
        }}
          onPress={() => {
            Alert.alert("Registration", "Registration Completed")
          }}

          onLongPress={() => {
            Alert.alert("Long Press", "Registration Completed")
          }}>
          <Text style={{
            fontSize: 20,
            color: '#FFF',
            padding: 10,
            textAlign: 'center'
          }}>Register</Text>
        </Pressable> */}
        <View style={{
          flexDirection: 'row',
          gap: 20
        }}>
          <TouchableOpacity style={appStyle.buttonStyle}
            onPress={() => { confirmRegistration() }}>
            <Text style={appStyle.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[appStyle.buttonStyle, { backgroundColor: '#a4b0be' }]} onPress={() => {
            console.log("Form Reset");
            setName("");
            setEmail("");
            setPassword("");
          }} >
            <Text style={appStyle.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
