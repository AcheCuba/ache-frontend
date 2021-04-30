import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import {
  selectContact,
  toogleAddContactAvaiable,
} from "../../../context/Actions/actions";
import { GlobalContext } from "../../../context/GlobalProvider";

const Contact = ({
  contactName,
  contactNumber,
  id,
  navigation,
  onPressContact,
}) => {
  /*   const { nuevaRecargaDispatch } = useContext(GlobalContext);

  const onPressContact = () => {
    nuevaRecargaDispatch(selectContact({ id, contactName, contactNumber }));
    nuevaRecargaDispatch(toogleAddContactAvaiable(true));

    navigation.navigate("NuevaRecargaScreen");
  };
 */
  return (
    <View style={{ marginHorizontal: 20 }} key={id}>
      <TouchableHighlight
        underlayColor="rgba(112, 28, 87, .2)"
        activeOpacity={0.6}
        onPress={() => onPressContact(id, contactName, contactNumber)}
        style={{ borderRadius: 5 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 15,
          }}
        >
          <Ionicons
            name="person"
            color="rgba(112, 28, 87, 1)"
            size={30}
            style={{ marginLeft: 5 }}
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 5 }}>
            {contactName}
          </Text>
          <Text style={{ fontSize: 20, marginRight: 5 }}>{contactNumber}</Text>
        </View>
      </TouchableHighlight>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "rgba(112, 28, 87, .4)",
        }}
      />
    </View>
  );
};

export default Contact;
