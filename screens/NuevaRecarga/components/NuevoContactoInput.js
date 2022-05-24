import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Image,
  Modal,
  Platform,
  Easing,
  Animated,
} from "react-native";
import { GlobalContext } from "../../../context/GlobalProvider";
import {
  deleteField,
  deletePrizeByFieldId,
  toogleAddContactAvaiable,
} from "../../../context/Actions/actions";
import { NeuInput, NeuButton, NeuView } from "react-native-neu-element";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import { TouchableOpacity } from "react-native-gesture-handler";
import DeletePrizeModal from "./DeletePrizeModal";
//import Animated from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

const inputWidth = width / 2;
//const inputHeight = height / 12;

const NuevoContactoInput = ({
  fieldInputId,
  navigation,
  contactSelected,
  onPressBarcode,
  prizeByFieldId,
  isFirstInput,
  animacionPremioNoValido,
}) => {
  const [text, setText] = useState("");
  const { nuevaRecargaDispatch, nuevaRecargaState } = useContext(GlobalContext);
  const { contactosSeleccionados, validated_prizes } = nuevaRecargaState;
  const { userState } = React.useContext(GlobalContext);

  const shakeValue = React.useRef(new Animated.Value(0));

  useEffect(() => {
    //effect
    //console.log(animacionPremioNoValido.valid);
    //console.log(animacionPremioNoValido.fieldId);

    if (fieldInputId === animacionPremioNoValido.fieldId) {
      if (!animacionPremioNoValido.valid) {
        //start animation
        startShake();
      }
    }

    return () => {
      //cleanup
    };
  }, [animacionPremioNoValido]);

  const [deletePrizeModalVisible, setDeletePrizeModalVisible] =
    React.useState(false);

  const startShake = () => {
    shakeValue.current.setValue(0);
    Animated.timing(shakeValue.current, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

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
    // comun para todos los slots
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
  };

  /*  const handlePressBarcode = () => {
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
  }; */

  const Figure = () => {
    //prizeByFieldId?.loading es undefined si prizeByFieldId es null, y salta el default
    if (prizeByFieldId?.loading) {
      return <ActivityIndicator size="small" color="#01f9d2" />;
    } else {
      switch (prizeByFieldId?.type) {
        case "TopUpBonus":
          return (
            <Image
              source={require("../../../assets/images/iconos/icono_premio.png")}
              style={{ height: 26, width: 26 }}
            />
          );
        case "Jackpot":
          return (
            <Image
              source={require("../../../assets/images/iconos/icono_gran_premio.png")}
              style={{ height: 22, width: 25 }}
            />
          );
        default:
          return (
            <Image
              source={require("../../../assets/images/iconos/brillo.png")}
              style={{ height: 25, width: 25 }}
            />
          );
          {
            /* <Ionicons name={iconName} color="gray" size={20} />;
             */
          }
      }
    }
  };

  /*const Figure = () => {
    // esta porción de código solo se utiliza para el primer input, en caso de que tenga premio
    if (
      isFirstInput &&
      userState.prize !== null &&
      userState.prize.type !== "Nada"
    ) {
      switch (currentValidatedPrize.type) {
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
          ); 
      }
    } else {
      //prizeByFieldId?.loading es undefined si prizeByFieldId es null, y salta el default
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
  }; */

  const onPressDeleteContact = () => {
    // falta finish checkout del premio?
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
    nuevaRecargaDispatch(deletePrizeByFieldId(fieldInputId));
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
          //type="Jackpot" // for testing
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
        {/*   <TouchableOpacity
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
          <Image
            source={require("../../../assets/images/iconos/Boton_Eliminar.png")}
            //style={{ width: 31, height: 21 }}
          />
        </TouchableOpacity> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: -2,
          }}
        >
          <NeuButton
            color="#701c57"
            width={width / 9.5}
            height={width / 9.5}
            borderRadius={width / 16}
            onPress={() => onPressDeleteContact()}
            style={{}}
          >
            <Image
              source={require("../../../assets/images/iconos/Boton_Eliminar.png")}
              style={{ width: width / 9.5 - 22, height: 4 }}
            />
          </NeuButton>
        </View>

        {Platform.OS === "ios" ? (
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
                textStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontFamily: "bs-italic",
                  fontSize: 18,
                }}
                placeholder={
                  userState?.idioma === "spa"
                    ? "Añadir Contacto"
                    : "Add Contact"
                }
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
        ) : (
          <Pressable
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
          </Pressable>
        )}

        <Animated.View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: -2,
            transform: [
              {
                translateX: shakeValue.current.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: [10, 20, 10, 20, 10],
                }),
              },
            ],
          }}
        >
          <NeuButton
            color="#701c57"
            width={width / 9.5}
            height={width / 9.5}
            borderRadius={width / 16}
            onPress={() => handlePressBarcode()}
            style={{}}
          >
            <Figure />
          </NeuButton>
        </Animated.View>
      </View>
    </>
  );
};

export default NuevoContactoInput;

/*
<Animated.View style={{transform: [{
    translateX: this.animatedValue.interpolate({
        inputRange: [0, 0.25, 0.50, 0.75, 1],
        outputRange: [10, 20, 10, 20, 10]
     })
  }]
}}>
*/
