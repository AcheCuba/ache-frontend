import React, { memo } from "react";
import { View, TouchableHighlight, Dimensions } from "react-native";

import {
  selectContact,
  toogleAddContactAvaiable,
} from "../../../context/Actions/actions";
import { GlobalContext } from "../../../context/GlobalProvider";
import ContactCred from "./ContactCred";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

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
    <View style={{ marginHorizontal: marginGlobal }} key={id}>
      <TouchableHighlight
        //underlayColor="rgba(112, 28, 87, .6)"
        underlayColor="rgba(0,0,0,.1)"
        activeOpacity={0.6}
        onPress={() => onPressContact(id, contactName, contactNumber)}
        style={{ borderRadius: 5 }}
      >
        <ContactCred
          contactName={contactName}
          contactNumber={contactNumber}
          width={width}
        />
      </TouchableHighlight>
      <View
        style={{
          height: 2,
          width: "100%",
          backgroundColor: "gray",
        }}
      />
    </View>
  );
};

export default memo(Contact);
