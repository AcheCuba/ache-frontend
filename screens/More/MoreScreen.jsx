import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import CustomButton from "../../components/CustomButton";

const MoreScreen = ({ navigation }) => {
  const customStyle = {
    paddingVertical: 15,
    borderRadius: 25,
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
    <View style={styles.container}>
      <View style={styles.containerButtons}>
        <View style={styles.buttons}>
          <CustomButton
            customStyle={customStyle}
            title="Sobre Nosotros"
            onPress={() => navigation.navigate("AboutUsScreen")}
            //color="purple"
          />
        </View>
        <View style={styles.buttons}>
          <CustomButton
            customStyle={customStyle}
            title="Premios del mes"
            onPress={() => navigation.navigate("PremioScreen")}
            //color="purple"
          />
        </View>
        <View style={styles.buttons}>
          <CustomButton
            customStyle={customStyle}
            title="Política de privacidad"
            onPress={() => navigation.navigate("PrivacidadScreen")}
            //color="purple"
          />
        </View>
        <View style={styles.buttons}>
          <CustomButton
            customStyle={customStyle}
            title="Términos de uso"
            onPress={() => navigation.navigate("TermUsoScreen")}
            //color="purple"
          />
        </View>
        <View style={styles.buttons}>
          <CustomButton
            customStyle={customStyle}
            title="Modo de uso"
            onPress={() => navigation.navigate("ModoUsoScreen")}
            //color="purple"
          />
        </View>
      </View>
    </View>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
  },
  containerButtons: {
    flex: 1,
    marginTop: "5%",
    alignItems: "center",
  },
  buttons: {
    width: "85%",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
