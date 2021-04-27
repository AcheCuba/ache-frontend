import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";

const RecargasDisponiblesScreen = ({ navigation }) => {
  const customStyle = {
    paddingVertical: 25,

    // paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Seleccione la cantidad a recargar</Text>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 1"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 2"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 3"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 4"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 5"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 6"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 7"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
          <View style={styles.button}>
            <CustomButton
              customStyle={customStyle}
              title="Recarga 8"
              onPress={() => navigation.navigate("PagoScreen")}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RecargasDisponiblesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  innerContainer: { alignItems: "center", marginTop: 20, width: "90%" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    width: "90%",
    marginTop: 10,
  },
});
