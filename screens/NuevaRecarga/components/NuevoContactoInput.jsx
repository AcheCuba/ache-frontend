import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { GlobalContext } from "../../../context/GlobalProvider";
import { toogleAddContactAvaiable } from "../../../context/Actions/actions";
import { NeuInput, NeuButton, NeuView } from "react-native-neu-element";

const { width, height } = Dimensions.get("screen");

const inputWidth = width / 1.6;
//const inputHeight = height / 12;

const NuevoContactoInput = ({
  fieldInputId,
  navigation,
  iconName,
  contactSelected,
  onPressBarcode,
  codigo,
  tienePremio,
}) => {
  const [text, setText] = useState("");
  const [textFromContactScreen, setTextFromContactScreen] = useState("");
  const [contactInputIdFromContacts, setContactInputIdFromContacts] =
    useState("");
  const { nuevaRecargaDispatch } = useContext(GlobalContext);

  //console.log("contactSelected", contactSelected);
  //console.log(text);

  useEffect(() => {
    //console.log("contactSelected", contactSelected);
  }, [contactSelected]);

  const onChangeText = (value) => {
    setText(value);
    //match phone number
    /*   const regexp =
      /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;
    if (regexp.test(value)) {
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
    } else {
      nuevaRecargaDispatch(toogleAddContactAvaiable(false));
    } */
  };

  const handlePressBarcode = () => {
    if (tienePremio) {
      return;
    } else {
      onPressBarcode(fieldInputId);
    }
  };

  const Figure = () => {
    if (tienePremio) {
      return (
        <Image
          source={require("../../../assets/images/nueva_recarga/jackpot.png")}
          style={{ height: 20, width: 20 }}
        />
      );
    }

    switch (codigo) {
      case "diez":
        return (
          <Image
            source={require("../../../assets/images/nueva_recarga/diez.png")}
            style={{ height: 25, width: 23 }}
          />
        );
      case "jackpot":
        return (
          <Image
            source={require("../../../assets/images/nueva_recarga/jackpot.png")}
            style={{ height: 20, width: 20 }}
          />
        );
      default:
        return <Ionicons name={iconName} color="gray" size={20} />;
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      <TouchableWithoutFeedback
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
    marginHorizontal: 10,
  },
});
/*             value={contactSelected ? contactSelected.contactName : ""}
 */
