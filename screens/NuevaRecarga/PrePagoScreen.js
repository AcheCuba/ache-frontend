import React, { useContext } from "react";
import { Alert } from "react-native";
import { Dimensions, View, Text, TouchableOpacity } from "react-native";
import { GlobalContext } from "../../context/GlobalProvider";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import {
  resetNuevaRecargaState,
  resetSocketState,
} from "../../context/Actions/actions";
import Toast from "react-native-root-toast";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import { TextBold, TextMedium } from "../../components/CommonText";
import CommonNeuButton from "../../components/CommonNeuButton";
import { ImageBackground } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import normalize from "react-native-normalize";
import { PrePagoTextEnglish, PrePagoTextSpanish } from "../../constants/Texts";
import { Image } from "react-native";
import { buttonColor, generalBgColor } from "../../constants/commonColors";
import LargeFlatButton from "../../components/LargeFlatButton";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const PrePagoScreen = ({ navigation, route }) => {
  const { productPriceUsd, transactions_id_array, productDescription } =
    route.params;

  const { userState } = React.useContext(GlobalContext);
  const { nuevaRecargaState, nuevaRecargaDispatch, socketDispatch } =
    useContext(GlobalContext);
  const { contactosSeleccionados } = nuevaRecargaState;

  const quantity = contactosSeleccionados.length;
  const [amount, setAmount] = React.useState(0);
  //const [precioRecarga, setPrecioRecarga] = React.useState("20");
  const flatRef = React.useRef(null);

  const countryIsoCode = userState?.country;

  React.useEffect(() => {
    const _amount = parseFloat((quantity * productPriceUsd).toFixed(2));
    //console.log(typeof _amount);
    setAmount(_amount);
    //console.log(esDirecta);
  }, []);

  React.useEffect(() => {
    // console.log(transactions_id_array);
  }, []);

  useAndroidBackHandler(() => {
    /*
     *   Returning `true` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */
    popUpAlert();
    return true;
  });

  const onPressBackButton = () => {
    popUpAlert();
  };

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = PrePagoTextSpanish();
    const textEng = PrePagoTextEnglish();

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };

  // opcion 1
  const renderItemContact = ({ item }) => {
    // console.log(item);
    return (
      <View
        style={{
          height: 35,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <TextMedium
          text={
            item.contactName != undefined
              ? item.contactName + " "
              : item.contactNumber + " "
          }
          style={{
            fontSize: normalize(25),
            //textTransform: "uppercase",
            color: buttonColor,
            //marginBottom: 6,
            //marginTop: 5,
          }}
        />
        {item.prize != null ? (
          <View style={{ marginLeft: 10, flexDirection: "row" }}>
            <Image
              source={
                item.prize != null
                  ? item.prize.type === "DoublePrize" ||
                    item.prize.type == "TopUpBonus"
                    ? require("../../assets/images/iconos/icono_premio.png")
                    : item.prize.type === "Jackpot"
                    ? require("../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")
                    : null
                  : null
              }
              style={item.prize != null ? { width: 25, height: 24 } : null}
            />
            <TextMedium
              text={
                item.prize != null
                  ? item.prize.type === "TopUpBonus" ||
                    item.prize.type === "DoublePrize"
                    ? " (" + item.prize.type + ")"
                    : null
                  : //? " +" + item.prize?.amount + " CUP "
                    //: null
                    null
              }
              style={{
                fontSize: normalize(12),
                color: "#fffb00",
                // textTransform: "uppercase",
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text
          style={{
            color: "gray",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "bs-italic",
          }}
        >
          No se agregaron contactos
        </Text>
      </View>
    );
  };

  const prize_finish_checkout = (uuid) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/finish-checkout/${uuid}`;
    let config = {
      method: "post",
      url: url,
      params: { success: false }, // el premio no se ha cobrado
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    return axios(config);
  };

  const finish_checkout_all_prizes = () => {
    let primisesForFinish = [];
    const prizesInCheckout = contactosSeleccionados.map(
      (contacto) => contacto.prize
    );
    const prizesInCheckout_clean = prizesInCheckout.filter(
      (prize) => prize != null
    );

    if (prizesInCheckout_clean.length === 0) {
      return;
    } else {
      prizesInCheckout_clean.forEach((prize) => {
        primisesForFinish.push(prize_finish_checkout(prize.uuid));
      });

      Promise.all(primisesForFinish)
        .then(() => {
          Toast.show(
            userState?.idioma === "spa"
              ? "Recarga cancelada, podrás cobrar tu premio en otro momento"
              : "Recharge canceled, you can collect your prize at a later time.",

            {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            }
          );
        })
        .catch((e) => {
          //console.log(e.message);
          Toast.show(
            userState?.idioma === "spa"
              ? "Error al finalizar el checkout del premio"
              : "Error at prize checkout",
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
    }
  };

  const onPressCancelarRecargaOnAlert = () => {
    finish_checkout_all_prizes();
    nuevaRecargaDispatch(resetNuevaRecargaState());
    socketDispatch(resetSocketState());
    navigation.navigate("NuevaRecargaScreen");
  };

  const popUpAlert = () => {
    Alert.alert(
      userState?.idioma === "spa"
        ? "¿Desea abandonar la recarga?"
        : "Do you want to exit?",
      userState?.idioma === "spa"
        ? "Si abandona la pantalla, se perderá el progreso de la recarga actual"
        : "If you leave the screen, the progress of the current recharge will be lost",

      [
        {
          text: userState?.idioma === "spa" ? "Cancelar" : "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: userState?.idioma === "spa" ? "Abortar" : "Abort",
          style: "destructive",
          onPress: () => onPressCancelarRecargaOnAlert(),
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: "center",
      }}
      transition={false}
    >
      <View
        style={{
          paddingTop: 50,
          width: width,
          height: height / 6,
          backgroundColor: "transparent",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onPressBackButton()}
          style={{
            marginLeft: marginGlobal,
            marginTop: 10,
            backgroundColor: buttonColor,
            width: width / 7,
            height: width / 7 - 20,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/iconos/equis.png")}
            style={{ width: 16, height: 16 }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: "center",
          //justifyContent: "center",
          flex: 1,
          marginTop: 30,
          width: width / 1.3,
        }}
      >
        <View
          style={{
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              marginBottom: normalize(15, "height"),
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TextBold
              text="TOTAL "
              style={{
                fontSize: normalize(34),
                textTransform: "uppercase",
                color: buttonColor,
                //marginBottom: 6,
                //marginTop: 5,
              }}
            />
            <TextBold
              //text={`$${amount}`}
              text={`${amount} USD`}
              style={{
                //fontSize: 100,
                fontSize: normalize(34),
                textTransform: "uppercase",
                //color: "#01f9d2",
                color: "#fffb00",
                //marginBottom: 6,
                //marginTop: 5,
              }}
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            justifyContent: "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 50,
              width: "100%",
            }}
          >
            <TextBold
              text={ResolveText("valor")}
              style={{
                fontSize: normalize(34), //26
                textTransform: "uppercase",
                color: buttonColor,
                //marginBottom: 6,
                //marginTop: 5,
              }}
            />
            <TextBold
              text={`${productDescription}`}
              style={{
                fontSize: normalize(34), //26
                textTransform: "uppercase",
                color: "#fffb00",
                //marginBottom: 6,
                //marginTop: 5,
              }}
            />
          </View>
        </View>
        <View
          style={{
            alignItems: "flex-start",
            marginTop: 50,
          }}
        >
          <TextBold
            text={ResolveText("beneficiarios")}
            style={{
              fontSize: normalize(34),
              textTransform: "uppercase",
              color: buttonColor,
              //marginBottom: 6,
              //marginTop: 5,
            }}
          />
          <View
            style={{
              marginTop: 5,
              //height: height / 3.7,
              height: normalize(height / 4.5),
              paddingBottom: 20,
              width: width / 1.3,
              alignItems: "center",
            }}
          >
            <FlatList
              ref={flatRef}
              keyExtractor={(item) => item.fieldInputId}
              data={contactosSeleccionados}
              renderItem={renderItemContact}
              ListEmptyComponent={renderEmptyList}
              //performance
              //getItemLayout={getItemLayout} // esto traba el final del scroll
              //removeClippedSubviews={true}
              //maxToRenderPerBatch={45}
              //initialNumToRender={50}
              //updateCellsBatchingPeriod={0.01}
              //windowSize={41} //default
              //onEndReachedThreshold={0.5}
              //disableVirtualization={false}
              //scrollIndicatorInsets={{ right: 1 }}
              showsVerticalScrollIndicator={true}
              style={{ width: width / 1.3 }}
            />
          </View>
          {contactosSeleccionados.length >
          Math.trunc(normalize(height / 4.5) / 35) ? (
            <View style={{ justifyContent: "center", marginTop: -5 }}>
              <TouchableOpacity
                onPress={() => {
                  flatRef.current.scrollToEnd();
                }}
              >
                <Image
                  source={require("../../assets/images/iconos/abajo.png")}
                  style={{ width: 21, height: 16 }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <View style={{ position: "absolute", bottom: 40 }}>
          <LargeFlatButton
            text={ResolveText("pagar")}
            onPress={() => {
              navigation.navigate("PagoScreen", {
                amount,
                transactions_id_array,
                productPriceUsd,
                productDescription,
                //recharge_amount_por_recarga: recharge_amount,
              });
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default PrePagoScreen;
