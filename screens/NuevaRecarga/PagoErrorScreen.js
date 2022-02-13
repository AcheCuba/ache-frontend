import axios from "axios";
import React from "react";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { Text, View, Dimensions } from "react-native";
import CommonNeuButton from "../../components/CommonNeuButton";
import { TextBold } from "../../components/CommonText";
import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";

const { width } = Dimensions.get("screen");

const PagoErrorScreen = ({ navigation, route }) => {
  //const { userState, nuevaRecargaState } = React.useContext(GlobalContext);
  //const { premiosConfirmadosSocket } = nuevaRecargaState;

  //const { paymentIntentId, amount } = route.params;
  //const paymentIntentId = "pi_1234";
  //const amount = 250;

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      transition={false}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          //justifyContent: "center",
          marginTop: 150,
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/emojis/emoji_triste.png")}
            style={{
              width: width / 2,
              height: width / 2,
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 60,
          }}
        >
          <TextBold
            text="¡Recarga Fallida!"
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#01f9d2",
              textTransform: "uppercase",
            }}
          />
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ marginTop: 50 }}>
            <CommonNeuButton
              text="Reintentar"
              onPress={() => {
                navigation.navigate("Juego");
              }}
              screenWidth={width}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default PagoErrorScreen;
