import React from "react";
import { Dimensions } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NeuButton, NeuView } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";
import { TextBold } from "../../components/CommonText";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const PremioScreen = ({ navigation }) => {
  const PremioCard = ({ type, description }) => {
    let imagen;
    switch (type) {
      case "Jackpot":
        imagen = (
          <Image
            source={require("../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
            style={{
              width: width / 6,
              height: width / 6,
            }}
          />
        );
        break;
      case "Bonus 250":
        imagen = (
          <Image
            source={require("../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
            style={{
              width: width / 5.8,
              height: width / 6,
            }}
          />
        );
        break;
      case "Bonus 500":
        imagen = (
          <Image
            source={require("../../assets/images/home/premios_finales/Monedas_500_CUP.png")}
            style={{
              width: width / 5.9,
              height: width / 6,
            }}
          />
        );
        break;

      default:
        break;
    }
    return (
      <View
        style={{
          alignItems: "center",
          padding: 10,
          flex: 1,
        }}
      >
        <NeuButton
          width={width / 1.3}
          height={height / 8}
          borderRadius={10}
          onPress={() => {
            navigation.navigate("PremioDescription", {
              type,
              description,
            });
          }}
          color="#701c57"
          style={{ marginTop: 10 }}
          containerStyle={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {imagen}
          <TextBold
            style={{
              textTransform: "uppercase",
              fontSize: 22,
              color: "#fff800",
              textAlign: "center",
            }}
            text={type}
          />
        </NeuButton>
      </View>
    );
  };

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
          //backgroundColor: "rgba(112, 28, 87, 1)",
        }}
      >
        <View style={styles.container}>
          <View style={{ flex: 1, marginVertical: 0, marginHorizontal: 10 }}>
            <View
              style={{
                width: width,
                alignItems: "center",
              }}
            >
              <TextBold
                style={{
                  textTransform: "uppercase",
                  fontSize: 28,
                  color: "#fff800",
                }}
                text="premios del mes"
              />
            </View>

            <ScrollView
              contentContainerStyle={{ width: width, alignItems: "center" }}
            >
              <PremioCard
                type="Jackpot"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"
              />

              <PremioCard
                type="Bonus 250"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"
              />

              <PremioCard
                type="Bonus 500"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PremioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //backgroundColor: "rgba(112, 28, 87, 1)",
    marginHorizontal: marginGlobal,
  },
  title: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  },
});
