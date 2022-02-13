import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NeuButton, NeuInput, NeuView } from "react-native-neu-element";
import CommonNeuButton from "../../../components/CommonNeuButton";

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
          backgroundColor: "rgba(112, 28, 87, .8)",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 80,
        }}
      >
        <NeuInput
          width={width / 1.4}
          height={40}
          borderRadius={20}
          //style={styles.input}
          placeholder="Introducir código"
          onChangeText={(value) => setText(value)}
          value={text}
          placeholderTextColor="#bbb"
          color="#701c57"
          textStyle={{
            color: "#fff",
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
          <CommonNeuButton
            text="Aceptar"
            width={width / 1.6}
            screenWidth={width}
            //color="#672557"
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
          <CommonNeuButton
            text="atrás"
            width={width / 1.6}
            screenWidth={width}
            //color="#672557"
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

  modalContent: {
    /*   backgroundColor: "rgba(112, 28, 87, 1)",
    //backgroundColor: "rgba(0,0,0,.2)",
    paddingHorizontal: 22,
    paddingVertical: 40,
    alignItems: "center",
    borderRadius: 17,
    marginHorizontal: 20,
    marginTop: "60%", */
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
{
  /* <NeuView
style={{ borderRadius: 10, borderColor: "#701c57", opacity: 0.9 }}
width={width / 1.2}
height={height / 4}
color="#701c57"
borderRadius={10}
> */
}
