import React from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CommonHeader from "../../components/CommonHeader";
import { infoTextColor } from "../../constants/commonColors";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const PrivacidadScreen = ({ navigation }) => {
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              marginBottom: 105,
              marginHorizontal: 20,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.infoText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                {"\n"} {"\n"}
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </Text>
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PrivacidadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: marginGlobal,
  },
  infoText: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: infoTextColor,
  },
});
