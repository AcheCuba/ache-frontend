import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import { GlobalContext } from "../../../context/GlobalProvider";
import { toogleAddContactAvaiable } from "../../../context/Actions/actions";
import { NeuInput, NeuButton, NeuView } from "react-native-neu-element";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-simple-toast";

const { width, height } = Dimensions.get("screen");

const inputWidth = width / 1.6;
//const inputHeight = height / 12;

const NuevoContactoInput = ({
  fieldInputId,
  navigation,
  iconName,
  contactSelected,
  onPressBarcode,
  prizeByFieldId,
  isFirstInput
}) => {
  const [text, setText] = useState("");
  const { nuevaRecargaDispatch, nuevaRecargaState } = useContext(GlobalContext);
  const { contactosSeleccionados, validated_prizes } = nuevaRecargaState;
  const { userState } = React.useContext(GlobalContext);

  const onChangeText = (value) => {
    setText(value);
  };

  const openPopUp = () => {
    const contactoExistente = contactosSeleccionados.find(
      (contacto) => contacto.fieldInputId === fieldInputId
    );

    if (contactoExistente !== undefined) {
      onPressBarcode(fieldInputId);
    } else {
      Toast.show("Añade un contacto primero", Toast.SHORT);
    }
  };

  const handlePressBarcode = () => {
    if (isFirstInput && userState.prize !== null) {
      if (userState.prize.type === "Nada") {
        // hay premio pero es la nada
        openPopUp();
      } else {
        return;
      }
    } else {
      // no hay premio
      openPopUp();
    }
  };

  const Figure = () => {
    // esta porción de código solo se utiliza para el primer input, en caso de que tenga premio
    if (
      isFirstInput &&
      userState.prize !== null &&
      userState.prize.type !== "Nada"
    ) {
      switch (userState.prize.type) {
        case "Jackpot":
          return (
            <Image
              source={require("../../../assets/images/nueva_recarga/jackpot.png")}
              style={{ height: 20, width: 20 }}
            />
          );

        case "TopUpBonus":
          return (
            <Image
              source={require("../../../assets/images/nueva_recarga/diez.png")}
              style={{ height: 25, width: 23 }}
            />
          );

        // por qué no poner el ícono de nada? para no obligar a
        // poner más de un contacto para recarga con código
        /*   case "Nada":
          return (
            <Image
              source={require("../../../assets/images/nueva_recarga/Nada2.png")}
              style={{ height: 200, width: 200 }}
              resizeMode="center"
            />
          ); */
      }
    } else {
      //console.log("here");
      //console.log(prizeByFieldId);
      // return <Ionicons name={iconName} color="gray" size={20} />;
      if (prizeByFieldId?.loading) {
        return <ActivityIndicator size="small" color="#01f9d2" />;
      } else {
        switch (prizeByFieldId?.type) {
          case "TopUpBonus":
            return (
              <Image
                source={require("../../../assets/images/nueva_recarga/diez.png")}
                style={{ height: 25, width: 23 }}
              />
            );
          case "Jackpot":
            return (
              <Image
                source={require("../../../assets/images/nueva_recarga/jackpot.png")}
                style={{ height: 20, width: 20 }}
              />
            );
          default:
            return <Ionicons name={iconName} color="gray" size={20} />;
        }
      }
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20
      }}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("MultiplesContactosScreen", {
            fieldInputId: fieldInputId
          })
        }
      >
        <View>
          <NeuInput
            textStyle={{ color: "#fff", fontWeight: "bold" }}
            placeholder="Toca para ir a Contactos"
            width={inputWidth}
            height={40}
            borderRadius={20}
            onChangeText={(value) => onChangeText(value)}
            value={
              contactSelected
                ? contactSelected.contactName !== undefined &&
                  contactSelected.id !== undefined
                  ? contactSelected.contactName
                  : contactSelected.contactNumber
                : ""
            }
            placeholderTextColor="gray"
            color="#701c57"
            keyboardType="phone-pad"
            name={fieldInputId}
            editable={false}
          />
        </View>
      </TouchableWithoutFeedback>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <NeuButton
          color="#701c57"
          width={width / 8}
          height={width / 8}
          borderRadius={width / 16}
          onPress={() => handlePressBarcode()}
          style={{}}
        >
          {/* si tiene premio (simbolizado con piedra azul) se coloca al primer contacto */}
          {/* si no tiene, barcode igual */}
          <Figure />
        </NeuButton>
      </View>
    </View>
  );
};

export default NuevoContactoInput;

const styles = StyleSheet.create({
  input: {
    width: "50%",
    //height: 50,
    //backgroundColor: "rgba(112, 28, 87, 0.1)",
    //borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10
  }
});
/*             value={contactSelected ? contactSelected.contactName : ""}
 */
