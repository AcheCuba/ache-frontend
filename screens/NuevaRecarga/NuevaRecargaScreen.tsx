import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const NuevaRecargaScreen = ({ navigation }) => {
  // typescript warning
  return (
    <View style={styles.container}>
      <Button
        title="Continue"
        onPress={() => navigation.navigate("PagoScreen")}
      />
    </View>
  );
};

export default NuevaRecargaScreen;

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
