import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { NeuButton, NeuInput, NeuView } from "react-native-neu-element";

const { width, height } = Dimensions.get("screen");

const DeletePrizeModal = ({
  fieldInputId,
  type,
  onPressDeletePrize,
  onPressCancelar,
}) => {
  const PrizeImage = () => {
    switch (type) {
      case "Jackpot":
        return (
          <Image
            //source={require("../../../assets/images/nueva_recarga/diez.png")}
            source={require("../../../assets/images/home/premios/diamanteCopia.png")}
            style={{ height: width / 7 + 7, width: width / 7 }}
          />
        );

      case "TopUpBonus":
        return (
          <Image
            source={require("../../../assets/images/home/premios/capa102Copia.png")}
            style={{ height: width / 8 + 7, width: width / 8 }}
          />
        );
      default:
        return <Text>Non-Valid Prize</Text>;
    }
  };

  return (
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
            color="#701c57"
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
            color="#701c57"
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
