import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const PagoScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paypal | Stripe</Text>
      <Button title="Pagar" onPress={() => navigation.navigate("Juego")} />
    </View>
  );
};

export default PagoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
