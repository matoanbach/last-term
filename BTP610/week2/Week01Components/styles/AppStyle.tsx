import { StyleSheet } from "react-native";

const appStyle = StyleSheet.create({
    mainView: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        textAlign: 'center',
        backgroundColor: 'rgba(255, 165, 2, 1.0)',
        width: '100%',
        // padding: 10,
        paddingVertical: 10,
        // paddingHorizontal: 10,
        // paddingTop: 10,
        // paddingBottom: 10,
        // paddingLeft: 10,
        // paddingStart: 10,
        // paddingRight: 10,
        // paddingEnd: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: "#FFF"
    },
    imageStyle: {
        width: 400,
        height: 200,
        marginTop: 20,
        borderRadius: 15
    },
    inputStyle: {
        borderColor: '#222f3e',
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        fontSize: 18,
        borderRadius: 10,
        width: "80%"
    },
    titleText: {
        alignSelf: 'flex-start',
        fontSize: 18,
        fontWeight: '500',
        color: '#576574'
    },
    dropdownStyle: {
        height: 40,
        width: '80%',
        borderWidth: 2,
        borderColor: '#576574',
        borderRadius: 10,
        paddingHorizontal: 10
    },
    checkboxRow: {
        width: '60%',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    buttonStyle: {
        borderRadius: 10,
        backgroundColor: '#70a1ff',
        alignItems: 'center',
        marginVertical: 10
    },
    buttonText: {
        fontSize: 20,
        color: '#FFF',
        padding: 10,
        textAlign: 'center'
    }
});

export default appStyle;