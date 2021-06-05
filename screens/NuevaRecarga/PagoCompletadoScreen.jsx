import React from "react";
import { Text, View, Button } from "react-native";

const PagoCompletadoScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Se ha realizado el pago exitosamente
      </Text>
      <View style={{ marginTop: 25 }}>
        <Button
          title="Ir a inicio"
          onPress={() => {
            navigation.navigate("Juego");
          }}
        ></Button>
      </View>
    </View>
  );
};

export default PagoCompletadoScreen;
