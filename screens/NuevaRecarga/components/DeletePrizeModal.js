import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { generalBgColorTrans8 } from "../../../constants/commonColors";
import { buttonColor } from "../../../constants/commonColors";

import NeuButton from "../../../libs/neu_element/NeuButton";
import NeuView from "../../../libs/neu_element/NeuView";

import { GlobalContext } from "../../../context/GlobalProvider";
import { TextBoldItalic } from "../../../components/CommonText";

const { width, height } = Dimensions.get("screen");

const DeletePrizeModal = ({ type, onPressDeletePrize, onPressCancelar }) => {
  const { userState } = React.useContext(GlobalContext);
  const idioma = userState?.idioma;

  //console.log(type);
  const PrizeImage = () => {
    switch (type) {
      case "Jackpot":
        return (
          <Image
            //source={require("../../../assets/images/home/premios/diamanteCopia.png")}
            source={require("../../../assets/images/iconos/icono_gran_premio.png")}
            style={{ height: width / 6, width: width / 6 + 11 }}
          />
        );

      case "TopUpBonus":
        return (
          <Image
            //source={require("../../../assets/images/home/premios/capa102Copia.png")}
            source={require("../../../assets/images/iconos/icono_premio.png")}
            style={{ height: width / 6, width: width / 6 }}
          />
        );
      default:
        return (
          <View style={{ height: width / 8 + 7 }}>
            <TextBoldItalic
              text={
                idioma === "spa"
                  ? "No hemos podido validar su premio"
                  : "We've not been able to validate your prize"
              }
              style={{
                fontSize: 18,
                color: "#eee",
                marginTop: 20,
              }}
            />
          </View>
        );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: generalBgColorTrans8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NeuView
        style={{ borderRadius: 10, borderColor: buttonColor, opacity: 0.9 }}
        width={width / 1.2}
        height={height / 4}
        color={buttonColor}
        borderRadius={10}
      >
        {type === undefined ? (
          <View style={{ height: width / 8 + 7 }}>
            <ActivityIndicator size="small" color="#01f9d2" />
            <TextBoldItalic
              text={
                idioma === "spa"
                  ? "Estamos validando su premio"
                  : "We're validating your prize"
              }
              style={{
                fontSize: 18,
                color: "#eee",
                marginTop: 20,
              }}
            />
          </View>
        ) : (
          <>
            <View>
              <PrizeImage />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 30,
                width: width / 1.4,
              }}
            >
              <NeuButton
                color={buttonColor}
                width={width / 3}
                height={40}
                borderRadius={20}
                onPress={onPressCancelar}
              >
                <Text
                  style={{
                    color: "#01f9d2",
                    fontWeight: "bold",
                    fontSize: 16,
                    textTransform: "uppercase",
                  }}
                >
                  CANCELAR
                </Text>
              </NeuButton>
              <NeuButton
                color={buttonColor}
                width={width / 5}
                height={40}
                borderRadius={20}
                onPress={() => {
                  onPressDeletePrize();
                }}
              >
                <Text
                  style={{
                    color: "#01f9d2",
                    fontWeight: "bold",
                    fontSize: 16,
                    textTransform: "uppercase",
                  }}
                >
                  Quitar
                </Text>
              </NeuButton>
            </View>
          </>
        )}
      </NeuView>
    </View>
  );
};

export default DeletePrizeModal;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    alignItems: "center",
    backgroundColor: "gray",
  },
});
