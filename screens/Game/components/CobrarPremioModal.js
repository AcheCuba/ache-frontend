import React, { useState } from "react";
import { Modal, StyleSheet, View, Dimensions, StatusBar } from "react-native";
import CobrarPremioContent from "./CobrarPremioContent";
import CommonHeader from "../../../components/CommonHeader";
import { RootSiblingParent } from "react-native-root-siblings";
import Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";

const { width, height } = Dimensions.get("screen");

const CobrarPremioModal = ({ modalVisible, setModalVisible, navigation }) => {
  const [codigo, setCodigo] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState(false);

  const copiarCodigoAlSalir = () => {
    if (codigoGenerado && !copiado) {
      Clipboard.setString(codigo);
      Toast.show("Código copiado al portapapeles", {
        duaration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });

      setTimeout(() => {
        setModalVisible(false);
      }, 500);
      setCopiado(false);
    } else {
      setCopiado(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="rgb(112, 28, 87)" style="light" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <CommonHeader
          width={width}
          height={height}
          _onPress={() => {
            copiarCodigoAlSalir();
          }}
        />
        <RootSiblingParent>
          <View style={styles.ModalOuterContent}>
            {/*  <View style={styles.ModalContent}> */}
            <CobrarPremioContent
              navigation={navigation}
              setModalVisible={setModalVisible}
              codigo={codigo}
              setCodigo={setCodigo}
              copiarCodigoAlSalir={copiarCodigoAlSalir}
              setCopiado={setCopiado}
              setCodigoGenerado={setCodigoGenerado}
              codigoGenerado={codigoGenerado}
            />
            {/*  </View> */}
          </View>
        </RootSiblingParent>
      </Modal>
    </>
  );
};

export default CobrarPremioModal;

const styles = StyleSheet.create({
  ModalOuterContent: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    backgroundColor: "rgba(112, 28, 87, 1)",
  },
  /*  ModalContent: {
    backgroundColor: "rgba(112, 28, 87, 1)",
    width: "90%",
    height: "40%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 10,
    borderRadius: 20,
    marginTop: 40,
  }, */
});
