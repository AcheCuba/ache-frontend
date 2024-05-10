import React from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, View } from "react-native";
import CommonHeader from "../../components/CommonHeader";
import CommonNeuButton from "../../components/CommonNeuButton";
import { TextBold, TextItalic } from "../../components/CommonText";
import LargeFlatButton from "../../components/LargeFlatButton";
import { buttonColor, infoTextColor } from "../../constants/commonColors";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const PremioDescription = ({ navigation, route }) => {
  const { type, description } = route.params;
  const { userState } = React.useContext(GlobalContext);
  const idioma = userState?.idioma;

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        //justifyContent: "center",
      }}
      transition={false}
    >
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => navigation.navigate("MoreScreen")}
      />
      <View style={styles.container}>
        <View style={{ flex: 1, marginTop: hp("20%") }}>
          <View style={{ alignItems: "center" }}>
            <TextBold
              style={{
                textTransform: "uppercase",
                fontSize: 22,
                color: "#fff800",
              }}
              text={type}
            />
          </View>

          <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
            <TextItalic
              style={{
                fontSize: 20,
                color: infoTextColor, //"#01f9d2",
                textAlign: "left",
              }}
              text={description}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PremioDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: marginGlobal,
  },
  title: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  },
});
