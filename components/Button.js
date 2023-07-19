import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Button({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[disabled ? styles.btn : styles.btnDisabled]}
      onPress={onPress}
      disabled={!disabled}
    >
      <Text style={[disabled ? styles.btnText : styles.btnTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "90%",
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 8,
    height: 45,
    backgroundColor: "rgb(66, 133, 244)",
  },
  btnDisabled: {
    width: "90%",
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 8,
    height: 45,
    backgroundColor: "rgba(66, 133, 244, 0.2)",
  },
  btnText: {
    textAlign: "center",
    fontWeight: "400",
    color: "white",
    fontSize: 20,
    padding: 10,
  },
  btnTextDisabled: {
    textAlign: "center",
    fontWeight: "400",
    color: "rgba(0,0,0,0.5)",
    fontSize: 20,
    padding: 10,
  },
});
