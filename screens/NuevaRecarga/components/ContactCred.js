import React, { memo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

const ContactCreds = ({ contactName, contactNumber, width }) => {
  return (
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
        <Ionicons
          name="person-outline"
          color="gray"
          size={30}
          //style={{ marginLeft: 5 }}
        />
      </View>
      <View style={{ flex: 0.6 }}>
        <Text
          style={{
            fontSize: 18,
            color: "gray",
            //position: "absolute",
            fontFamily: "bs-medium",
            left: 0,
          }}
        >
          {contactName}
        </Text>
      </View>

      <Text style={{ fontSize: 18, color: "gray", fontFamily: "bs-medium" }}>
        {contactNumber}
      </Text>
    </View>
  );
};

export default memo(ContactCreds);
