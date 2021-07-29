import React, { useState } from "react";
import { Modal, StyleSheet, View, Dimensions, StatusBar } from "react-native";
import CobrarPremioContent from "./CobrarPremioContent";
import CommonHeader from "../../../components/CommonHeader";

const { width, height } = Dimensions.get("screen");

const CobrarPremioModal = ({ modalVisible, setModalVisible, navigation }) => {
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
          _onPress={() => setModalVisible(false)}
        />
        <View style={styles.ModalOuterContent}>
          {/*  <View style={styles.ModalContent}> */}
          <CobrarPremioContent
            navigation={navigation}
            setModalVisible={setModalVisible}
          />
          {/*  </View> */}
        </View>
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
