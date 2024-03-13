import React, { memo } from "react";
import { View, TouchableHighlight, Dimensions } from "react-native";
import ContactCred from "./ContactCred";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const Contact = ({ contactName, contactNumber, contactId, onPressContact }) => {
  return (
    <View style={{ marginHorizontal: marginGlobal }} key={contactId}>
      <TouchableHighlight
        //underlayColor="rgba(112, 28, 87, .6)"
        underlayColor="rgba(0,0,0,.1)"
        activeOpacity={0.6}
        onPress={() => onPressContact(contactId, contactName, contactNumber)}
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
