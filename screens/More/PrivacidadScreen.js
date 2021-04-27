import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const PrivacidadScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20 }}>
        <ScrollView>
          <Text style={styles.title}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            {"\n"} {"\n"}
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                color: "#5870cb",
                fontSize: 30,
                fontWeight: "bold",
                marginTop: 10,
              }}
              onPress={() => Linking.openURL("http://google.com")}
            >
              ... Saber más
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PrivacidadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(112, 28, 87, 1)",
  },
  title: {
    fontSize: 30,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  },
});
