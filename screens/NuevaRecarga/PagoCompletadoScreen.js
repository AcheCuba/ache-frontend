import React from "react";
import { Text, View, Button, Dimensions } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";

const { width } = Dimensions.get("screen");

const PagoCompletadoScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#701c57"
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "#01f9d2" }}>
        Se ha realizado el pago exitosamente
      </Text>
      <View style={{ marginTop: 25 }}>
        <CommonNeuButton
          text="Ir a Inicio"
          onPress={() => {
            navigation.navigate("Juego");
          }}
          screenWidth={width}
        />
      </View>
    </View>
  );
};

export default PagoCompletadoScreen;
