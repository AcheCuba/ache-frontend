import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
//import Clipboard from "@react-native-community/clipboard";
import Clipboard from "expo-clipboard";
import Toast, { DURATION } from "react-native-easy-toast";
import CommonNeuButton from "../../../components/CommonNeuButton";
import { NeuButton, NeuView } from "react-native-neu-element";
import { ToastAndroid } from "react-native";

const { width, height } = Dimensions.get("screen");

const CobrarPremioContent = ({ navigation, setModalVisible }) => {
  const [codigoGenerado, setCodigoGenerado] = useState(false);
  const [codigo, setCodigo] = useState("");

  const copyToClipboard = (code) => {
    Clipboard.setString(code);
  };

  const onPressGenerarCodigo = () => {
    // pedir codigo a la API
    // setear código resultante
    setCodigo("aj3d44Pk5Md***kd213");
    setCodigoGenerado(true);
  };

  const onPressCopiar = () => {
    copyToClipboard(codigo);
    ToastAndroid.show("Código copiado al portapapeles", ToastAndroid.SHORT);
    //setCodigoGenerado(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <NeuView
          style={{ marginBottom: (width / 4.4) * -1 }}
          width={width / 2.2}
          height={width / 2.2}
          color="#701c57"
          borderRadius={width / 4.4}
        ></NeuView>
        <View
          style={{
            backgroundColor: "#701c57",
            width: width / 2.2,
            height: width / 2.2,
            borderRadius: width / 4.4,
            elevation: 0.01,
            position: "absolute",
            borderBottomWidth: 0,
            borderBottomColor: "#701c57",
          }}
        >
          <Image
            source={require("../../../assets/images/home/premios/diamanteCopia.png")}
            resizeMode="center"
          />
        </View>
        <NeuView
          style={{}}
          width={width / 1.2}
          height={height / 4}
          color="#701c57"
          borderRadius={10}
        >
          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              height: height / 7,
              position: "absolute",
              bottom: 0,
              paddingHorizontal: width / 1.2 / 6,
            }}
          >
            <Text
              style={{
                color: "#01f9d2",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              NOMBRE PREMIO
            </Text>
            <Text
              style={{
                color: "gray",
                fontStyle: "italic",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              Texto explicativo con los detalles del premio
            </Text>
          </View>
        </NeuView>
      </View>

      <View style={{}}>
        <View style={styles.button}>
          {codigoGenerado ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <NeuView
                style={{}}
                width={width / 2}
                height={width / 8}
                color="#701c57"
                borderRadius={width / 8}
              >
                <Text
                  style={{
                    color: "gray",
                    fontStyle: "italic",
                    fontSize: 16,
                  }}
                >
                  {codigo}
                </Text>
              </NeuView>
              <NeuButton
                color="#701c57"
                width={width / 4}
                height={width / 8}
                borderRadius={width / 8}
                onPress={() => onPressCopiar()}
              >
                <Text
                  style={{
                    color: "#01f9d2",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {" "}
                  COPIAR{" "}
                </Text>
              </NeuButton>
            </View>
          ) : (
            <CommonNeuButton
              screenWidth={width}
              text="COBRAR PREMIO"
              onPress={() => {
                setModalVisible(false);
                navigation.jumpTo("Nueva Recarga", {
                  screen: "Nueva Recarga",
                });
              }}
            />
          )}
        </View>
        <View style={styles.button}>
          <CommonNeuButton
            screenWidth={width}
            text={codigoGenerado ? "TERMINAR" : "GENERAR CÓDIGO"}
            onPress={() => {
              codigoGenerado ? setModalVisible(false) : onPressGenerarCodigo();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CobrarPremioContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(112, 28, 87, .6)",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
  },
  codeModalContainer: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },

  codeModalContent: {
    backgroundColor: "rgba(112, 28, 87, .6)",
    padding: 22,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    marginHorizontal: 10,
    marginTop: 80,
  },
});
