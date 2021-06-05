import { Ionicons } from "@expo/vector-icons";
import React, { useContext, memo } from "react";
import { Text, View, TouchableHighlight, Dimensions } from "react-native";
import { NeuView } from "react-native-neu-element";

import {
  selectContact,
  toogleAddContactAvaiable,
} from "../../../context/Actions/actions";
import { GlobalContext } from "../../../context/GlobalProvider";

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 15,
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              color: "#701c57",
              width: width / 8,
              height: width / 8,
              borderRadius: width / 16,
              borderWidth: 2,
              borderColor: "gray",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/*    <NeuView
            color="#701c57"
            width={width / 8}
            height={width / 8}
            borderRadius={width / 16}
          > */}
            <Ionicons
              name="person-outline"
              color="gray"
              size={30}
              //style={{ marginLeft: 5 }}
            />
            {/* </NeuView> */}
          </View>
          <View style={{ flex: 0.6 }}>
            <Text
              style={{
                fontSize: 18,
                color: "gray",
                //position: "absolute",
                left: 0,
              }}
            >
              {contactName}
            </Text>
          </View>

          <Text style={{ fontSize: 18, color: "gray" }}>{contactNumber}</Text>
        </View>
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
