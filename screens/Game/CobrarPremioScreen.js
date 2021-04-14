import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const CobrarPremioScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cobrar Premio Screen</Text>
      <View style={styles.button}>
        <Button title="Cobrar premio" onPress={() => {}} />
      </View>
      <View style={styles.button}>
        <Button title="Generar Código" onPress={() => {}} />
      </View>
    </View>
  );
};

export default CobrarPremioScreen;

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
