import React, { useState } from "react";
import { Modal, StyleSheet, View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import normalize from "react-native-normalize";
import CommonNeuButton from "../../../components/CommonNeuButton";
import { TextBold, TextMedium } from "../../../components/CommonText";
import { GlobalContext } from "../../../context/GlobalProvider";
import NeuView from "../../../libs/neu_element/NeuView";

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
          backgroundColor: "rgba(112, 28, 87, .8)",
          paddingTop: 50, // aqui empiezan los
          paddingLeft: width / 9,
          //justifyContent: "space-between",
          //alignItems: "flex-start",
          //marginBottom: 80,
        }}
      >
        <NeuView
          style={{
            borderRadius: 10,
            borderColor: "#701c57",
            opacity: 0.9,
            marginTop: width / 7,
            marginLeft: width / 7,
          }}
          width={width / 3}
          height={heightList}
          color="#701c57"
          borderRadius={10}
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

          {/* <View
            style={{
              marginTop: 30,
            }}
          >
            <CommonNeuButton
              text={idioma === "spa" ? "Atrás" : "Back"}
              width={width / 1.6}
              screenWidth={width}
              //color="#672557"
              onPress={() => setModalVisible(false)}
            />
          </View> */}
        </NeuView>
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
