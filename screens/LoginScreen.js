import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/*  <Text style={styles.title}>Login Screen</Text> */}
      <View style={{ marginBottom: 10 }}>
        <Button title="Comenzar" onPress={() => navigation.navigate("Root")} />
      </View>
      <View style={{ marginBottom: 10 }}>
        <Button title="Sign Out" onPress={() => navigation.navigate("Root")} />
      </View>
    </View>
  );
};

export default LoginScreen;

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
