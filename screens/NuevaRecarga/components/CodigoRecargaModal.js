import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import CustomButton from "../../../components/CustomButton";

const CodigoRecargaModal = ({
  modalVisible,
  setModalVisible,
  onPressOkModal,
}) => {
  const [text, setText] = useState("");

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <TextInput
          style={styles.input}
          placeholder="Introducir código del premio"
          onChangeText={(value) => setText(value)}
          value={text}
          placeholderTextColor="rgba(255,255,255,0.2)"
          color="rgba(255,255,255,0.5)"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            width: "90%",
          }}
        >
          <View>
            <CustomButton
              title="Cancelar"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
          <View>
            <CustomButton
              title="Ok"
              onPress={() => {
                onPressOkModal();
              }}
            />
          </View>
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
    //flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "rgba(112, 28, 87, 1)",
    paddingHorizontal: 22,
    paddingVertical: 40,
    alignItems: "center",
    borderRadius: 17,
    marginHorizontal: 20,
    marginTop: "60%",
  },
  input: {
    width: "90%",
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
