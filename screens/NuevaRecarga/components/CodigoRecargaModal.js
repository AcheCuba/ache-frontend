import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../../../components/CustomButton";
import { NeuButton, NeuInput, NeuView } from "react-native-neu-element";

const CodigoRecargaModal = ({
  modalVisible,
  setModalVisible,
  onPressOkModal,
  transparent,
  width,
  height,
  actualBarcodeId,
}) => {
  const [text, setText] = useState("");

  React.useEffect(() => {
    setText("");
  }, []);

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
        }}
      >
        <NeuView
          style={{ borderRadius: 10, borderColor: "#701c57", opacity: 0.9 }}
          width={width / 1.2}
          height={height / 4}
          color="#701c57"
          borderRadius={10}
        >
          <NeuInput
            width={width / 1.4}
            height={40}
            borderRadius={20}
            //style={styles.input}
            placeholder="Introducir código del premio"
            onChangeText={(value) => setText(value)}
            value={text}
            placeholderTextColor="gray"
            color="#701c57"
            textStyle={{ color: "white" }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 30,
              width: width / 1.4,
            }}
          >
            <NeuButton
              color="#701c57"
              width={width / 3}
              height={40}
              borderRadius={20}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{
                  color: "#01f9d2",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                CANCELAR
              </Text>
            </NeuButton>
            <NeuButton
              color="#701c57"
              width={width / 5}
              height={40}
              borderRadius={20}
              onPress={() => {
                onPressOkModal(actualBarcodeId, text);
              }}
            >
              <Text
                style={{
                  color: "#01f9d2",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                OK
              </Text>
            </NeuButton>
          </View>
        </NeuView>
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
