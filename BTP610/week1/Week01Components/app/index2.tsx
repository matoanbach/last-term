import React from "react";
import { useState } from "react";
import { View, Text, Image, TextInput, Dropdown} from "react-native";
import { Checkbox } from 'expo-checkbox';

export default function Index() {
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [selectedProgram, setSelectedProgram] = useState<string>("Cloud computing")
    const [selectedCampuses, setSelectedCampuses] = useState<string[]>(["Newnham", "King"]);
    const [selectedTution, setSelectedTution] = useState<string>("FullTime");

    const programs: string[] = [
        "AI",
        "Cloud Computing",
        "Cyber Security",
        "Blockchain"
    ]

    const campusOptions: string[] = ["Newnham", "King", "York"]
    const tuitionOptions: string[] = ["FullTime", "Scholarship", "OSAP"]

    const pi = 3.14
    // const toggleCampusesSelection = (campus: string) => {
    //     setSelectedCampuses((prev) => prev.includes(campus)
    //     ? prev.filter((c) => c != campus)
    //     : [...prev, campus]
    //     )
    // }

    const toggleCampusesSelection = (campus: string) => {
        setSelectedCampuses((prev) => prev.includes(campus) 
        ? prev.filter((c) => c != campus) 
        : [...prev, campus])
    }
    
    return (
        <View style={
        {
            flex: 1,
            alignItems: "center",
        }}
        >
            <Text style={{
                textAlign: 'center',
                backgroundColor: '#ff9f43',
                width: '100%',
                paddingVertical: 10,
                fontSize: 24,
                fontWeight: 'bold',
                color: "#FFF"
            }}>User Information</Text>
            <Image style={{
                width: 400,
                height: 200,
                marginTop: 20,
                borderRadius: 15
            }}
            source={{
                uri: "https://cdn.pixabay.com/photo/2015/09/05/20/02/coding-924920_1280.jpg"            }}
            />
            <TextInput style={{
                borderColor: '#222f3e',
                borderWidth: 1,
                padding: 10,
                marginVertical: 10,
                fontSize: 18,
                borderRadius: 10,
                width: "80%"
            }}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
            />
            <TextInput style={{
                borderColor: '#222f3e',
                borderWidth: 1,
                padding: 10,
                marginVertical: 10,
                fontSize: 18,
                borderRadius: 10,
                width: "80%"
            }}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            autoCapitalize="none"
            maxLength={15}
            autoComplete="off"
            autoCorrect={false}
            secureTextEntry={true}
            />
            <Text style={{
                alignSelf: 'flex-start',
                fontSize: 18,
                fontWeight: '500',
                color: '#576574'
            }}>Select Program</Text>
            <Dropdown style={{
                height: 40,
                width: '80%',
                borderWidth: 2,
                borderColor: '#576574',
                borderRadius: 10,
                paddingHorizontal: 10
            }}
            data={programs.map((prog) => ({ label: prog, value: prog}))}
            labelField="label"
            valueField="value"
            placeholder="Select program"
            value={selectedProgram}
            onChange={(item: any) => { setSelectedCampuses(item.value)}}
            />
            <Text style={{
                alignSelf: 'flex-start',
                fontSize: 18,
                fontWeight: '500',
                color: '#576574',
                marginVertical: 10
            }}>Preferred Campuses</Text>
            {
                campusOptions.map((campus) => (
                    <View key={campus} style={{
                        width: '60%',
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center'
                    }}>
                        <Checkbox
                            value={selectedCampuses.includes(campus)}
                            onValueChange={() => {
                                toggleCampusesSelection(campus)
                            }}
                            color={selectedCampuses.includes(campus) ? "#54a0ff" : undefined}
                        />
                        <Text>{campus}</Text>
                            

                    </View>
                ))
            }
        </View>
    )

}