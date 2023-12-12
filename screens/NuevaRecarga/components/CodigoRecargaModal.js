import React, { useState } from "react";
import { Modal, StyleSheet, View, TextInput } from "react-native";
import NeuInput from "../../../libs/neu_element/NeuInput";
import CommonNeuButton from "../../../components/CommonNeuButton";
import { GlobalContext } from "../../../context/GlobalProvider";
import {
  buttonColor,
  generalBgColorTrans8,
} from "../../../constants/commonColors";
import LargeFlatButton from "../../../components/LargeFlatButton";

const CodigoRecargaModal = ({
  modalVisible,
  setModalVisible,
  onPressOkModal,
  transparent,
  width,
  height,
  fieldIdMatched,
}) => {
  const [text, setText] = useState("");
  const { userState } = React.useContext(GlobalContext);
  const idioma = userState?.idioma;

  React.useEffect(() => {
    setText("");
  }, [fieldIdMatched]);

  return (
    <Modal
      transparent={transparent}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: generalBgColorTrans8,
          justifyContent: "center",
          alignItems: "center",
          //marginBottom: 80,
        }}
      >
        <TextInput
          width={width / 1.3}
          height={45}
          borderRadius={22}
          //style={styles.input}
          placeholder={idioma === "spa" ? "Introducir código" : "Enter code"}
          onChangeText={(value) => setText(value)}
          value={text}
          placeholderTextColor="#bbb"
          color={"#fff"}
          style={{
            backgroundColor: buttonColor,
            fontWeight: "bold",
            fontFamily: "bs-italic",
            fontSize: 18,
            textAlign: "center",
          }}
        />
        <View
          style={{
            marginTop: 30,
          }}
        >
          <LargeFlatButton
            text={idioma === "spa" ? "Aceptar" : "Accept"}
            _width={width / 1.6}
            onPress={() => {
              onPressOkModal(fieldIdMatched, text);
            }}
          />
        </View>

        <View
          style={{
            marginTop: 30,
          }}
        >
          <LargeFlatButton
            text={idioma === "spa" ? "Añadir mi premio" : "Add my prize"}
            _width={width / 1.6}
            onPress={() => {
              onPressOkModal(fieldIdMatched, userState?.prize?.uuid);
            }}
          />
        </View>

        <View
          style={{
            marginTop: 30,
          }}
        >
          <LargeFlatButton
            text={idioma === "spa" ? "Atrás" : "Back"}
            _width={width / 1.6}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CodigoRecargaModal;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    //justifyContent: "center",
    // backgroundColor: "pink",
    alignItems: "center",
    backgroundColor: "gray",
  },

  input: {
    // width: "90%",
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
