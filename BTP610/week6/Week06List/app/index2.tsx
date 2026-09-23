import { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Student = {
  name: string;
  grade: number;
  tuitionPaid: boolean;
  userid: string;
}

const STUDENTS: Student[] = [
  { name: "Peter", grade: 85, tuitionPaid: true, userid: "psmith" },
  { name: "Emily Patel", grade: 95, tuitionPaid: true, userid: "epatel" },
  { name: "Allison Omar", grade: 53, tuitionPaid: false, userid: "alee" },
  { name: "Suzy Lee", grade: 70, tuitionPaid: false, userid: "slee" },
  { name: "Peter", grade: 65, tuitionPaid: false, userid: "pdiaz" },
  { name: "Jose Kowalski", grade: 84, tuitionPaid: true, userid: "jkowalski" },
  { name: "Peter", grade: 85, tuitionPaid: true, userid: "psmith1" },
  { name: "Emily Patel", grade: 95, tuitionPaid: true, userid: "epatel2" },
  { name: "Allison Omar", grade: 53, tuitionPaid: false, userid: "alee3" },
  { name: "Suzy Lee", grade: 70, tuitionPaid: false, userid: "slee4" },
  { name: "Peter", grade: 65, tuitionPaid: false, userid: "pdiaz5" },
  { name: "Jose Kowalski", grade: 84, tuitionPaid: true, userid: "jkowalski6" },
]

export default function Index() {

  const carList = [
    { model: 'Toyota Corolla', year: 2017, licensePlate: 'ABC123', color: 'blue' },
    { model: 'Honda Civic', year: 2018, licensePlate: 'DEF456', color: 'white' },
    { model: 'Toyota RAV4', year: 2022, licensePlate: 'GHI789', color: 'red' },
    { model: 'Toyota Tundra', year: 1999, licensePlate: 'JKL123', color: 'orange' },
    { model: 'Honda Pilot', year: 2000, licensePlate: 'MNO456', color: 'yellow' },
    { model: 'Nissan Armada', year: 2024, licensePlate: 'PQR789', color: 'red' },
    { model: 'Subaru Outback', year: 2005, licensePlate: 'STU123', color: 'green' },
    { model: 'Honda NSX', year: 2019, licensePlate: 'VWX456', color: 'cyan' },
    { model: 'Toyota Tacoma', year: 2026, licensePlate: 'YZA789', color: 'red' }
  ]

  const [studentList, setStudentList] = useState<Student[]>(STUDENTS);
  const [studentList1, setStudentList1] = useState<Student[]>();

  // const DisplayCars = () => {
  //   return carList.map((ele, index) => {
  //     return (
  //       <View key={index} style={{flexDirection: 'row', gap: 10, justifyContent: 'flex-start' }}>
  //         <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{ele.year < 2018 ? ele.licensePlate : ele.model}</Text>
  //       </View>
  //     )
  //   })
  // }

  const ListHeader = () => (
    <View>
      <Text style={styles.listHeader}>BTP610</Text>
    </View>
  )

  const ListFooter = () => (
    <View>
      <Text style={[styles.listHeader, { backgroundColor: 'green' }]}>Class of 2026</Text>
    </View>
  )

  const EmptyList = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 26, color: 'red' }}>No Students Found</Text>
    </View>
  )

  const updateGrade = (pos: number) => {
    console.log("updating student grade...");
    const result = studentList.map((currentItem, index) => {
      if (index === pos && currentItem.grade < 100) {
        return { ...currentItem, grade: currentItem.grade + 5 }
      } else {
        return currentItem
      }
    })

    setStudentList(result);
  }

  const deleteStudent = (pos: number) => {
    Alert.alert(
      'Remove!',
      'Are you sure you want to remove this student?',
      [
        {
          text: 'No',
          onPress: () => {
            console.log("No Pressed!")
          },
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            const result = studentList.filter((item, index) => {
              if (index === pos) {
                return false
              } else {
                return true
              }
            });

            setStudentList(result);
          },
          style: 'default'
        }
      ]
    )
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 10
      }}
    >
      {/* { DisplayCars() } */}
      <FlatList
        style={{ width: '100%' }}
        keyExtractor={(item: Student) => { return item.userid }}
        data={studentList}
        renderItem={(rowData) => {
          return (
            <TouchableOpacity style={styles.mainView}>
              <View>
                <Text style={styles.txtName}>{rowData.item.name}</Text>
                <Text style={styles.txtGrade}>{rowData.item.grade}</Text>
                {
                  (rowData.item.tuitionPaid) ? <Text style={{ color: 'green' }}>Tution Paid</Text> : <Text style={{ color: 'red' }}>Tution not Paid</Text>
                }
              </View>
              <View style={styles.iconView}>
                <TouchableOpacity onPress={() => { updateGrade(rowData.index) }}>
                  <FontAwesome name="edit" size={32} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteStudent(rowData.index)}>
                  <MaterialIcons name="delete" size={32} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        }}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: 10 }} />
          )
        }}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={EmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 5,
    borderColor: 'dodgerblue',
    borderRadius: 10
  },
  listHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: 'orange',
    color: '#FFF'
  },
  txtName: {
    fontSize: 20,
    fontWeight: '700',
  },
  txtGrade: {
    fontSize: 18,
    fontWeight: '500',
  },
  iconView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 'auto'
  }
})
