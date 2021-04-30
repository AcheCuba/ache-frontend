import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { GlobalContext } from "../../../context/GlobalProvider";
import { toogleAddContactAvaiable } from "../../../context/Actions/actions";

const NuevoContactoInput = ({
  contactInputId,
  navigation,
  iconNameLeft,
  iconNameRight,
  contactSelected,
  onPressBarcode,
  hasCode,
}) => {
  const [text, setText] = useState("");
  const [textFromContactScreen, setTextFromContactScreen] = useState("");
  const [contactInputIdFromContacts, setContactInputIdFromContacts] = useState(
    ""
  );
  const { nuevaRecargaDispatch } = useContext(GlobalContext);

  //console.log("contactSelected", contactSelected);
  //console.log(text);

  useEffect(() => {
    if (contactSelected) {
      setTextFromContactScreen(contactSelected?.contactNumber);
      setContactInputIdFromContacts(contactSelected?.contactInputId);
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
    }
  }, [contactSelected]);

  const onChangeText = (value) => {
    setText(value);
    //match phone number
    const regexp = /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;
    if (regexp.test(value)) {
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
    } else {
      nuevaRecargaDispatch(toogleAddContactAvaiable(false));
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
      }}
    >
      <TextInput
        style={styles.input}
        placeholder="+535 222-22-22"
        //onBlur={onBlur}
        onChangeText={(value) => onChangeText(value)}
        //value={text}
        value={
          contactInputId === contactInputIdFromContacts
            ? textFromContactScreen
            : text
        }
        placeholderTextColor="rgba(0,0,0,0.3)"
        color="rgba(0,0,0,1)"
        keyboardType="phone-pad"
        name={contactInputId}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            navigation.navigate("MultiplesContactosScreen", {
              contactInputId,
            });
          }}
        >
          <Ionicons
            name={iconNameLeft}
            color="rgba(112, 28, 87, 1)"
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressBarcode}>
          <Ionicons
            name={iconNameRight}
            color="rgba(112, 28, 87, 1)"
            size={30}
          />
        </TouchableOpacity>
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
