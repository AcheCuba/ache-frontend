import React, { useContext } from "react";
import { Dimensions, View, Text, Platform } from "react-native";
import { NeuButton } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");

const PrePagoScreen = ({ navigation }) => {
  const { nuevaRecargaState } = useContext(GlobalContext);
  const { contactosSeleccionados } = nuevaRecargaState;
  const quantity = contactosSeleccionados.length;
  const [amount, setAmount] = React.useState("0");
  const [precioRecarga, setPrecioRecarga] = React.useState("20");

  React.useEffect(() => {
    setAmount(quantity * precioRecarga);
  }, []);

  return (
    <View style={{ backgroundColor: "#701c57", flex: 1, alignItems: "center" }}>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => {
          navigation.jumpTo("Nueva Recarga", {
            screen: "RecargasDisponiblesScreen",
          });
        }}
      />
      <View
        style={{
          // backgroundColor: "blue",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          marginTop: -90,
        }}
      >
        <Text
          style={{
            fontFamily:
              Platform.OS === "android" ? "monospace" : "San Francisco",
            fontSize: 100,
            fontWeight: "bold",
            color: "#ddd",
          }}
        >
          ${amount}
        </Text>
        <NeuButton
          style={{ marginTop: 40 }}
          width={width / 1.2}
          height={height / 7}
          color="#701c57"
          borderRadius={10}
          onPress={() => navigation.navigate("PagoScreen")}
        >
          <View style={{ paddingHorizontal: width / 6 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#01f9d2",
                textTransform: "uppercase",
              }}
            >
              Enter yoy card and pay
            </Text>
          </View>
        </NeuButton>
      </View>
    </View>
  );
};

export default PrePagoScreen;
