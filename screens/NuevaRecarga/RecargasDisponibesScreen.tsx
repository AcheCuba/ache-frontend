import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const RecargasDisponiblesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recargas disponibles</Text>
      <View style={styles.button}>
        <Button title="Recarga 1" onPress={() => {}} />
      </View>
      <View style={styles.button}>
        <Button title="Recarga 2" onPress={() => {}} />
      </View>
    </View>
  );
};

export default RecargasDisponiblesScreen;

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
  button: {
    marginTop: 10,
  },
});
