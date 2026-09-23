

import { StyleSheet } from "react-native";

export const styles= StyleSheet.create({

    container: {flex:1, backgroundColor: "#FFF", alignItems:"center", padding:10},

    inputStyle: {fontSize: 18, borderColor: "#rgba(10,61,98,0.5)",borderWidth:2,
        borderRadius:5, paddingHorizontal:15, height:50, width:"100%", marginVertical:10},

    buttonStyle: {marginVertical:15, alignItems:"center", justifyContent:"center",
        paddingVertical:10, width:"70%", backgroundColor:"#rgba(10,61,98,0.5)", borderRadius:15},

    buttonText: {fontSize:18, fontWeight:"bold",color: "#FFF"},

    textError: {color: "#e84118", fontSize:18, paddingVertical:10},

    ViewSeparator: {flexDirection:'row', justifyContent:"space-between", alignItems:"center"},

    itemSeparator: {height:2, backgroundColor: 'rgba(10,61,98,1)', width:'20%'}

    });