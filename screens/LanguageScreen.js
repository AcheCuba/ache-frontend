import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

const LanguageScren = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona el lenguaje</Text>
    </View>
  );
};

export default LanguageScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
