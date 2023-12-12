import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import normalize from "react-native-normalize";
import { TextBold, TextMedium } from "../../../components/CommonText";
import {
  buttonColor,
  generalBgColorTrans8,
} from "../../../constants/commonColors";
import { GlobalContext } from "../../../context/GlobalProvider";

const DropDownMenuModal = ({
  modalVisible,
  setModalVisible,
  transparent,
  width,
  onSelectCountry,
}) => {
  const { userState } = React.useContext(GlobalContext);
  const actualCountry = userState?.country;

  const numOpciones = 3;
  const heightOpcion = 50;
  const heightList = numOpciones * heightOpcion;

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
          flexDirection: "row",
          backgroundColor: generalBgColorTrans8,
          paddingTop: 50, // aqui empiezan los
          paddingLeft: width / 9,
          //justifyContent: "space-between",
          //alignItems: "flex-start",
          //marginBottom: 80,
        }}
      >
        <View
          style={{
            borderRadius: 10,
            borderColor: buttonColor,
            opacity: 0.9,
            marginTop: width / 7,
            marginLeft: width / 7,
            width: width / 3,
            height: heightList,
            backgroundColor: buttonColor,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: width / 3.5,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            onPress={() => onSelectCountry(actualCountry, "CUB")}
          >
            <Image
              source={require("../../../assets/images/bandera_cub.jpg")}
              style={{ width: 40, height: 22 }}
            />
            <TextMedium
              style={{
                fontSize: normalize(23),
                color: "#fffb00",
              }}
              text="+53"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: width / 3.5,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
            onPress={() => onSelectCountry(actualCountry, "DOM")}
          >
            <Image
              source={require("../../../assets/images/bandera_do.jpg")}
              style={{ width: 40, height: 22 }}
            />
            <TextMedium
              style={{
                fontSize: normalize(23),
                color: "#fffb00",
              }}
              text="+1"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: width / 3.5,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            onPress={() => onSelectCountry(actualCountry, "MEX")}
          >
            <Image
              source={require("../../../assets/images/bandera_mex.jpg")}
              style={{ width: 40, height: 22 }}
            />
            <TextMedium
              style={{
                fontSize: normalize(23),
                color: "#fffb00",
              }}
              text="+52"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DropDownMenuModal;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    alignItems: "center",
    backgroundColor: "gray",
  },

  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
