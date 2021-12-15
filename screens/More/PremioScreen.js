import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { NeuView } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const PremioScreen = ({ navigation }) => {
  const PremioCard = ({ type }) => {
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
        <NeuView
          width={width / 1.3}
          height={height / 7}
          borderRadius={10}
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
          <Text
            style={{
              textTransform: "uppercase",
              fontSize: 22,
              fontWeight: "bold",
              color: "#fff800",
              textAlign: "center",
            }}
          >
            {type}
          </Text>
        </NeuView>
      </View>
    );
  };

  return (
    <>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => navigation.navigate("MoreScreen")}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "rgba(112, 28, 87, 1)",
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
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 25,
                  fontWeight: "bold",
                  color: "#fff800",
                }}
              >
                PREMIOS DEL MES
              </Text>
            </View>

            <ScrollView
              contentContainerStyle={{ width: width, alignItems: "center" }}
            >
              <PremioCard type="Jackpot" />

              <PremioCard type="Bonus 250" />

              <PremioCard type="Bonus 500" />
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
};

export default PremioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(112, 28, 87, 1)",
    marginHorizontal: marginGlobal,
  },
  title: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  },
});
