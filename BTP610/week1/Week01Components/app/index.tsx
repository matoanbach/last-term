import { useState } from "react";
import { Text, View, Image, TextInput, StyleSheet } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Checkbox } from 'expo-checkbox';

// To use Dropdown
// npm install react-native-element-dropdown

// Checkbox
// npx expo install expo-checkbox

export default function Index() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [selectedProgram, setSelectedProgram] = useState<string>("Cloud Computing")
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([])

  const programs: string[] = [
    "AI",
    "Cloud Computing",
    "Cyber Security",
    "Blockchain"
  ]

  const campusOptions: string[] = ["Newnham", "King", "York"]

  const setCampuses = (campus: string) => {
    setSelectedCampuses((prev) =>
      prev.includes(campus) ?
      prev.filter((c) => c != campus) :
      [...prev, campus]
    )
  }

  return <>
  <View style={{
    flex: 1,
    alignItems: "center"
  }}>
    <Text
    style={{
      textAlign: "center",
      backgroundColor: "#ff9f43",
      width: "100%",
      paddingVertical: 10,
      fontSize: 24, 
      fontWeight: "bold",
      color: "#FFF"
    }}
    >
      User Information
    </Text>
    <Image 
      style={{
        width: 400,
        height: 200,
        marginTop: 20,
        borderRadius: 15,
      }}
      source={{
        uri: "https://cdn.pixabay.com/photo/2015/09/05/20/02/coding-924920_1280.jpg"
      }}
    />

    <TextInput 
      style={styles.textBox}
      placeholder="Enter your name"
      value={name}
      onChangeText={setName}
      autoCapitalize="words"
    />
    <TextInput 
      style={styles.textBox}
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
      style={styles.textBox}
      placeholder="Enter password"
      value={password}
      onChangeText={setPassword}
      autoCapitalize="none"
      maxLength={15}
      autoCorrect={false}
      secureTextEntry={true}
      />

    <Text style={{
      alignSelf: 'flex-start',
      fontSize: 18,
      fontWeight: '500',
      color: '#576574',
      marginVertical: 10
    }}>Preferred Campuses</Text>

    <Dropdown 
      style={styles.dropdown}
      data={programs.map((item) => ({value: item, label: item}))}
      valueField="value"
      labelField="label"
      placeholder="Select Program"
      value={selectedProgram}
      onChange={(program) => setSelectedProgram(program)}
    />

    <Text style={{
      alignSelf: 'flex-start',
      fontSize: 18,
      fontWeight: '500',
      color: '#576574',
      marginVertical: 10
    }}>Preferred Campuses</Text>

    <View>
      {
        campusOptions.map((campus) => (
          <View 
            style={styles.checkBox}
            key={campus}
          >
            <Checkbox 
              value={selectedCampuses.includes(campus)}
              onValueChange={() => setCampuses(campus)}
              color={selectedCampuses.includes(campus) ? "#54a0ff" : undefined}
            />
            <Text>{campus}</Text>
          </View>
        ))
      }
    </View>

  </View>
  </>
}


const styles = StyleSheet.create({
  textBox: {
    borderColor: "#222f3e",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    fontSize: 18,
    borderRadius: 10,
    width: "80%"
  },
  dropdown: {
    height: 40,
    width: "80%",
    borderWidth: 2,
    borderColor: "#576574",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  checkBox: {
    width: "60%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  }
})