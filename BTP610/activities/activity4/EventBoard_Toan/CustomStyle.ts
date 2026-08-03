import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 10,
  },
  inputStyle: {
    fontSize: 18,
    borderColor: "rgba(10,61,98,0.5)",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 15,
    minHeight: 50,
    width: "100%",
    marginVertical: 10,
    textAlignVertical: "top",
  },
  buttonStyle: {
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "70%",
    backgroundColor: "rgba(10,61,98,0.7)",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  textError: {
    color: "#e84118",
    fontSize: 18,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0a3d62",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  smallButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(10,61,98,0.7)",
  },
});
