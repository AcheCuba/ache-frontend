import React, { useContext, useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Image,
  Modal,
} from "react-native";
import { GlobalContext } from "../../../context/GlobalProvider";
import {
  deleteField,
  toogleAddContactAvaiable,
} from "../../../context/Actions/actions";
import { NeuInput, NeuButton, NeuView } from "react-native-neu-element";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import { TouchableOpacity } from "react-native-gesture-handler";
import DeletePrizeModal from "./DeletePrizeModal";

const { width, height } = Dimensions.get("screen");

const inputWidth = width / 2;
//const inputHeight = height / 12;

const NuevoContactoInput = ({
  fieldInputId,
  navigation,
  iconName,
  contactSelected,
  onPressBarcode,
  prizeByFieldId,
  isFirstInput,
}) => {
  const [text, setText] = useState("");
  const { nuevaRecargaDispatch, nuevaRecargaState } = useContext(GlobalContext);
  const { contactosSeleccionados, validated_prizes } = nuevaRecargaState;
  const { userState } = React.useContext(GlobalContext);

  const [deletePrizeModalVisible, setDeletePrizeModalVisible] =
    React.useState(false);

  const onChangeText = (value) => {
    setText(value);
  };

  const openPopUpForEntryCode = () => {
    const contactoExistente = contactosSeleccionados.find(
      (contacto) => contacto.fieldInputId === fieldInputId
    );

    if (contactoExistente !== undefined) {
      onPressBarcode(fieldInputId);
    } else {
      Toast.show("Añade un contacto primero", {
        duaration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  const openPopUpForDeletePrize = () => {
    setDeletePrizeModalVisible(true);
  };

  const returnPrizeType = () => {
    const currentPrize = validated_prizes.find(
      (prize) => prize.fieldId === fieldInputId
    );
    if (currentPrize != undefined) {
      return currentPrize.type;
    } else {
      return undefined;
    }
  };

  const handlePressBarcode = () => {
    if (isFirstInput && userState.prize !== null) {
      if (userState.prize.type === "Nada") {
        // hay premio pero es la nada
        openPopUpForEntryCode();
      } else {
        // hay premio en el primer slot
        openPopUpForDeletePrize();
      }
    } else {
      // no es el primer slot
      // pinchar aqui
      const currentPrize = validated_prizes.find(
        (prize) => prize.fieldId === fieldInputId
      );
      if (currentPrize != undefined) {
        // hay premio asociado, abrir popup
        openPopUpForDeletePrize();
      } else {
        // no hay premio asociado
        openPopUpForEntryCode();
      }
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

  const onPressDeleteContact = () => {
    // falta finish checkout del premio
    nuevaRecargaDispatch(deleteField(fieldInputId));
    if (contactosSeleccionados.length > 0) {
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
    }
  };

  const onPressCancelar = () => {
    setDeletePrizeModalVisible(false);
  };

  const onPressDeletePrize = () => {
    //delete prize

    setDeletePrizeModalVisible(false);
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="fade"
        visible={deletePrizeModalVisible}
        onRequestClose={() => setDeletePrizeModalVisible(false)}
      >
        <DeletePrizeModal
          fieldInputId={fieldInputId}
          type={returnPrizeType()}
          onPressDeletePrize={onPressDeletePrize}
          onPressCancelar={onPressCancelar}
        />
      </Modal>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => onPressDeleteContact()}
          style={{
            //width: width / 8,
            //heigth: width / 8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "yelow",
            marginTop: 3,
          }}
        >
          <MaterialCommunityIcons
            name="trash-can"
            color="rgba(248,85,34, 0.5)"
            //  color="rgba(148,13,10, 0.5)"
            size={28}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("MultiplesContactosScreen", {
              fieldInputId: fieldInputId,
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
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <NeuButton
            color="#701c57"
            width={width / 8}
            height={width / 8}
            borderRadius={width / 16}
            onPress={() => handlePressBarcode()}
            style={{}}
          >
            <Figure />
          </NeuButton>
        </View>
      </View>
    </>
  );
};

export default NuevoContactoInput;

const styles = StyleSheet.create({
  input: {
    width: "50%",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
