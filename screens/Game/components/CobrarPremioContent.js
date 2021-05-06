import React, { useState } from "react";
import { StyleSheet, Text, View, Button, Modal } from "react-native";
import CustomButton from "../../../components/CustomButton";
//import Clipboard from "@react-native-community/clipboard";
import Clipboard from "expo-clipboard";
import Toast, { DURATION } from "react-native-easy-toast";

const CobrarPremioContent = ({ navigation, setModalVisible }) => {
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const customStyle = {
    //paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
    borderRadius: 20,
  };

  const copyToClipboard = () => {
    Clipboard.setString("aj3d44Pk5Md*kd213");
    setCopiedText("aj3d44Pk5Md*kd213");
    // this.toast?.show("Código del premio copiado al portapapeles", 1000);
  };

  return (
    <>
      <Modal
        transparent={true}
        visible={codeModalVisible}
        onRequestClose={() => setCodeModalVisible(false)}
        style={styles.codeModalContainer}
      >
        <View style={styles.codeModalContent}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            aj3d44Pk5Md*kd213
          </Text>
          <View>
            <CustomButton
              title="Copiar"
              onPress={() => {
                copyToClipboard();
                setCodeModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
      {/*   <Toast ref={(toast) => (this.toast = toast)} /> */}
      <View style={styles.container}>
        {/* <View style={styles.buttonsContainer}> */}
        <View style={styles.button}>
          <CustomButton
            title="Ir a Cobrar premio"
            customStyle={customStyle}
            onPress={() => {
              setModalVisible(false);
              navigation.jumpTo("Nueva Recarga", {
                screen: "Nueva Recarga",
              });
            }}
          />
        </View>
        <View style={styles.button}>
          <CustomButton
            title="Generar Código"
            customStyle={customStyle}
            onPress={() => {
              setCodeModalVisible(true);
            }}
          />
        </View>
        {/*  </View> */}
      </View>
    </>
  );
};

export default CobrarPremioContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",
    width: "100%",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    width: "80%",
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
