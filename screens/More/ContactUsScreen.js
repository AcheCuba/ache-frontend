import React from "react";
import { Dimensions, Linking, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import normalize from "react-native-normalize";
import Toast from "react-native-root-toast";
import CommonHeader from "../../components/CommonHeader";
import { TextBold, TextMedium } from "../../components/CommonText";
import { buttonColor, infoTextColor } from "../../constants/commonColors";
import { GlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const ContactUsScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);

  const openWhatsapp = async () => {
    const phoneNumber = "+971585515461";
    const url = `whatsapp://send?phone=${phoneNumber}`;

    try {
      // Intenta abrir WhatsApp
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // Si WhatsApp no está instalado, muestra un toast
        Toast.show(
          userState?.idioma === "spa"
            ? "WhatsApp no está instalado en tu teléfono"
            : "WhatsApp is not installed on your phone",
          {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          }
        );
      }
    } catch (error) {
      console.error("Error al abrir WhatsApp:", error);
    }
  };

  const openEmailApp = async () => {
    const url = `mailto:contact@spinrecargas.com`;
    const supported = await Linking.canOpenURL(url);
    // console.log(supported);
    if (supported) {
      Linking.openURL(url).catch((err) => {
        Toast.show(
          userState?.idioma === "spa"
            ? "No se pudo abrir la aplicación de correo"
            : "Could not open the mail application",

          {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          }
        );
      });
    } else {
      Toast.show(
        userState?.idioma === "spa"
          ? "El dispositivo no soporta la URL solicitada"
          : "The device does not support the requested URL",

        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
    }
  };

  const ButtonContact = ({ title, subt, onPressContact }) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.3}
          onPress={onPressContact}
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            paddingHorizontal: 30,
            marginBottom: 25,
            width: width / 1.3,
            height: height / 6,
            borderRadius: 10,
            backgroundColor: buttonColor,
          }}
        >
          <View style={{ width: "100%", alignItems: "center" }}>
            <TextBold
              text={title}
              style={{
                fontSize: 24,
                textTransform: "uppercase",
                color: "#fffb00",
                marginBottom: 6,
                marginTop: 5,
              }}
            />
          </View>

          <View style={{ width: "100%", alignItems: "center" }}>
            <TextMedium
              text={subt}
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 6,
              }}
            />
          </View>
        </TouchableOpacity>
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
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              marginTop: 10,
              marginBottom: 105,
            }}
          >
            <View style={{ marginBottom: 30, alignItems: "center" }}>
              <TextBold
                text={userState.idioma === "spa" ? "CONTACTANOS" : "CONTACT US"}
                style={{
                  fontSize: normalize(34),
                  textTransform: "uppercase",
                  color: "#fffb00",
                  //marginBottom: 6,
                  //marginTop: 5,
                }}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ButtonContact
                title={"WHATSAPP"}
                subt={"+971 58 551 5461"}
                onPressContact={() => {
                  openWhatsapp();
                }}
              />

              <ButtonContact
                title={userState.idioma === "spa" ? "ENVIAR EMAIL" : "EMAIL US"}
                subt={"contact@spinrecargas.com"}
                onPressContact={() => openEmailApp()}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: marginGlobal,
  },
});
