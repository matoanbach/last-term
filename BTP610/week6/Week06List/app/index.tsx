import { use, useState } from "react";
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
  const [studentList, setStudentList] = useState<Student[]>(STUDENTS)
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
    const result = studentList.map((item, index) => {
      if (index === pos && item.grade <= 95) {
        return {...item, grade: item.grade + 5}
      } else {
        return item
      } 
    })

    setStudentList(result)
  }

  const deleteStudent = (pos: number) => {
    Alert.alert(
      "Romve!",
      "Are you sure to remove this student?",
      [
        {
          text: "No",
          onPress: () => {
            console.log("No Pressed!")
          },
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            setStudentList(studentList.filter((item, index) => index != pos))
          },
          style: "default"
        }
      ]
    )
  }

  return <>
  <View style={{
    flex: 1,
    alignItems: "center",
    padding: 10
  }}>

    <FlatList 
      style={{
        width: "100%"
      }}
      data={studentList}
      keyExtractor={(student: Student) => student.userid}
      renderItem={(rowData) => {
        return <>
          <TouchableOpacity style={styles.mainView}>
            <View>
              <Text style={styles.txtName}>{rowData.item.name}</Text>
              <Text style={styles.txtGrade}>{rowData.item.grade}</Text>
              {
                true ? <Text style={{color: "green"}}>Tuition Paid</Text> : <Text style={{color: "red"}}>Tuition Not Paid</Text>
              }
            </View>
            <View style={styles.iconView}>
              <TouchableOpacity onPress={() => updateGrade(rowData.index)}>
                <FontAwesome name="edit" size={32} color="blue"/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteStudent(rowData.index)}>
                <MaterialIcons name="delete" size={32} color="red"/>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </>
      }}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={EmptyList}
      ItemSeparatorComponent={() => (
        <View style={{height: 10}}/>
      )}
    />
  </View>
  </>
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
