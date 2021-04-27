import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const GameScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <View style={styles.button}>
        <Button
          title="Cobrar premio"
          onPress={() => navigation.navigate("CobrarPremioScreen")}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Nueva Recarga"
          onPress={() =>
            navigation.navigate("NuevaRecargaNavigator", {
              screen: "NuevaRecargaScreen",
            })
          }
        />
      </View>
    </View>
  );
};

export default GameScreen;

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
