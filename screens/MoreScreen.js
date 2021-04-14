import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

const MoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Screen</Text>
    </View>
  );
};

export default MoreScreen;

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
