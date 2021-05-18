import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import CobrarPremioContent from "./CobrarPremioContent";

const CobrarPremioModal = ({ modalVisible, setModalVisible, navigation }) => {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      style={styles.container}
    >
      <View style={styles.ModalOuterContent}>
        <View style={styles.ModalContent}>
          <CobrarPremioContent
            navigation={navigation}
            setModalVisible={setModalVisible}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CobrarPremioModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ModalOuterContent: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  ModalContent: {
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
  },
});
