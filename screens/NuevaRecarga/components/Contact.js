import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
//import { pure } from "recompose";

class Contact extends React.PureComponent {
  render() {
    const { contactName, contactNumber } = this.props;

    return (
      <View style={{ marginHorizontal: 20 }}>
        <TouchableHighlight
          underlayColor="rgba(112, 28, 87, .3)"
          activeOpacity={0.6}
          onPress={() => console.log("pressed")}
          style={{ borderRadius: 10 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: 15,
            }}
          >
            <Ionicons name="person" color="rgba(112, 28, 87, 1)" size={30} />
            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 5 }}>
              {contactName}
            </Text>
            <Text style={{ fontSize: 20, marginRight: 5 }}>
              {contactNumber}
            </Text>
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
  }
}

export default Contact;
