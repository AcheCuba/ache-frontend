import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";

import Clipboard from "expo-clipboard";
import { NeuButton } from "react-native-neu-element";
import { GlobalContext } from "../../../context/GlobalProvider";
import axios from "axios";
import { BASE_URL } from "../../../constants/domain";
import {
  resetNuevaRecargaState,
  setPrizeForUser,
} from "../../../context/Actions/actions";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import { getData, removeItem, storeData } from "../../../libs/asyncStorage.lib";
import { cancelNotification } from "../../../libs/expoPushNotification.lib";
import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  CobrarPremioTextEngish,
  CobrarPremioTextSpanish,
} from "../../../constants/Texts";

const { width, height } = Dimensions.get("screen");

const CobrarPremioContent = ({
  navigation,
  setModalVisible,
  Salir,
  codigoGenerado,
  setCodigoGenerado, // equivale a codigo copiado
  horasRestantes,
}) => {
  const { userState, userDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);

  const currentPrize = userState.prize;

  //console.log(userState);

  const [loading, setLoading] = useState(false);
  const [prizeType, setPrizeType] = useState("");
  const [prizeAmount, setPrizeAmount] = useState(0);

  React.useEffect(() => {
    setPrizeType(currentPrize?.type);
    setPrizeAmount(currentPrize?.amount);
    //console.log(currentPrize?.type);
  }, []);

  React.useEffect(() => {
    //console.log("codigo generado", codigoGenerado);
    //console.log(currentPrize?.type);
  }, [codigoGenerado]);

  const copyToClipboard = (code) => {
    Clipboard.setString(code);
  };

  /* const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  }; */

  const EncriptarCodigo = (codigo) => {
    const codigoEncriptado =
      codigo.slice(0, 13) +
      "***" +
      codigo.slice(codigo.length - 3, codigo.length);

    return codigoEncriptado;
  };

  const onPressGenerarCodigo = () => {
    // setear codigo a la API
    // setear código resultante

    //if (currentPrize !== null) {
    setLoading(true);

    const user_token = userState.token;
    const prize_id = currentPrize.uuid;
    const url = `${BASE_URL}/prize/exchange/${prize_id}`;
    //console.log(userState);
    //console.log(url);

    // ====== fake para probar
    /*   userDispatch(setPrizeForUser(null));

    setTimeout(() => {
      //setCodigo("prizeCode fake");
      setCodigoGenerado(true);
      copiarCode("prizeCode fake");
      setLoading(false);
    }, 3000); */
    // ===== fake para probar

    //====================== comentar para trastear ============

    let config = {
      method: "post",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    axios(config)
      .then((response) => {
        if (response.status === 201) {
          const prizeResultUpdated = response.data; // exchanged true
          const prizeCode = currentPrize.uuid;

          // actualizar persistencia
          //storeData({ ...userState, prize: prizeResultUpdated });
          storeData("user", { ...userState, prize: null });

          // actualizar estado global
          userDispatch(setPrizeForUser(null));
          // para no afectar al estado de Nueva Recarga
          nuevaRecargaDispatch(resetNuevaRecargaState());

          // limpiar notificación
          cleanNotification();

          // actualizar estado local
          //setCodigo(prizeCode);
          copiarCode(prizeCode);
          setLoading(false);
        } else {
          // do something
          //console.log(response.status);
          setLoading(false);
        }
      })
      .catch((error) => {
        //console.log(error);
        setLoading(false);
      });
    //====================== comentar para trastear ============
  };

  const cleanNotification = async () => {
    const notId = await getData("notification-prize-expire");
    cancelNotification(notId);
    removeItem(notId);
  };

  const copiarCode = (code) => {
    copyToClipboard(code);
    setCodigoGenerado(true);

    /* setTimeout(() => {
      setModalVisible(false);
    }, 2000); */

    /* Toast.show("Código copiado al portapapeles", Toast.SHORT, [
      "RCTModalHostViewController"
    ]); */
    //setCodigoGenerado(false);
  };

  const onPressObtenerPremio = () => {
    setModalVisible(false);
    /* navigation.jumpTo("Nueva Recarga", {
        screen: "NuevaRecargaScreen",
        fromCobrarPremio: true,
      }); */
    navigation.jumpTo("Nueva Recarga", {
      screen: "NuevaRecargaScreen",
      params: { inOrderToCobrarPremio: true },
    });
  };

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = CobrarPremioTextSpanish();
    const textEng = CobrarPremioTextEngish();

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };

  const RenderPrizeTItleAndDesc = () => {
    const idioma = userState?.idioma;

    let title;
    let desc;

    switch (prizeType) {
      case "Jackpot":
        if (idioma === "spa") {
          title = "Joyita";
          desc = `Tienes 500 dólares por cobrar durante las próximas ${horasRestantes} horas. Revisa tu email.`;
        } else if (idioma === "eng") {
          title = "Joyita";
          desc = `Tienes 500 dólares por cobrar durante las próximas ${horasRestantes} horas. Revisa tu email.`;
        }
        break;
      case "TopUpBonus":
        if (prizeAmount === 250) {
          if (idioma === "spa") {
            title = "Media Bolsa";
            desc = `Tienes 250 pesos de regalo para agregar a una recarga o enviar como código durante las próximas ${horasRestantes} horas.`;
          } else if (idioma === "eng") {
            title = "Media Bolsa";
            desc = `Tienes 250 pesos de regalo para agregar a una recarga o enviar como código durante las próximas ${horasRestantes} horas.`;
          }
          break;
        }

        if (prizeAmount === 500) {
          if (idioma === "spa") {
            title = "bolsa llena";
            desc = `Tienes 500 pesos de regalo para agregar a una recarga o enviar como código durante las próximas ${horasRestantes} horas`;
          } else if (idioma === "eng") {
            title = "bolsa llena";
            desc = `ienes 500 pesos de regalo para agregar a una recarga o enviar como código durante las próximas ${horasRestantes} horas.`;
          }
        }

      default:
        break;
    }

    return (
      <>
        <TextBold
          style={{
            color: "#01f9d2",
            fontWeight: "bold",
            fontSize: 20,
            textTransform: "uppercase",
          }}
          text={title}
        />

        <TextItalic
          style={{
            color: "#01f9d2",
            fontStyle: "italic",
            fontSize: 18,
            marginTop: 10,
            textAlign: "center",
          }}
          text={desc}
        />
      </>
    );
  };

  const RenderPrizeImage = () => {
    switch (prizeType) {
      case "Jackpot":
        return (
          <Image
            source={require("../../../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png")}
            style={{
              width: width / 4,
              height: width / 4,
            }}
          />
        );
      case "TopUpBonus":
        if (prizeAmount === 250) {
          return (
            <Image
              source={require("../../../assets/images/home/premios_finales/Monedas_250_CUP.png")}
              style={{
                width: width / 3,
                height: width / 3.1,
                //width: width / 3.8,
                //height: width / 3.9,
              }}
            />
          );
        }

        if (prizeAmount === 500) {
          return (
            <Image
              source={require("../../../assets/images/home/premios_finales/Monedas_500_CUP.png")}
              style={{
                width: width / 3,
                height: width / 3.1,
              }}
            />
          );
        }

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: 150,
        }}
      >
        <RenderPrizeImage />
      </View>

      <View
        style={{
          alignItems: "center",
          //paddingHorizontal: width / 10,
          marginTop: 35,
          width: width / 1.5,
        }}
      >
        <RenderPrizeTItleAndDesc />
      </View>

      <View style={{ marginTop: 30, alignItems: "center" }}>
        <View style={styles.button}>
          <NeuButton
            color="#62194f"
            width={(4 / 5) * width}
            height={width / 7.5}
            borderRadius={width / 7.5}
            onPress={() => {
              // antes el condicional era con loading solo
              codigoGenerado || loading ? null : onPressObtenerPremio();
            }}
            active={codigoGenerado}
            inset={false}
            style={{ marginTop: 5 }}
          >
            <TextBold
              text={ResolveText("obtenerPremio")}
              style={{
                color: codigoGenerado ? "#666666" : "#fff800", //"#01f9d2",
                fontSize: 20,
                textTransform: "uppercase",
              }}
            />
          </NeuButton>
        </View>
        <View style={styles.button}>
          {!loading ? (
            <NeuButton
              color="#5e174d"
              width={(4 / 5) * width}
              height={width / 7.5}
              borderRadius={width / 7.5}
              onPress={() => {
                codigoGenerado ? null : onPressGenerarCodigo(); //genera y copia el code de una vez
              }} // la condicion de generado implica que ha sido copiado ya
              active={codigoGenerado}
              //inset={codigoGenerado}
              style={{ marginTop: 5 }}
            >
              <TextBold
                text={ResolveText("copiarCodigo")}
                style={{
                  color: codigoGenerado ? "#666666" : "#fff800", //"#01f9d2",
                  fontWeight: "bold",
                  fontSize: 20,
                  textTransform: "uppercase",
                }}
              />
            </NeuButton>
          ) : (
            <NeuButton
              color="#5e174d"
              width={(4 / 5) * width}
              height={width / 7.5}
              borderRadius={width / 7.5}
              onPress={() => {}}
              inset
              style={{ marginTop: 5 }}
            >
              <ActivityIndicator size="large" color="#fff800" />
            </NeuButton>
          )}

          <View style={{ height: 100, width: width / 1.3 }}>
            {codigoGenerado ? (
              <TextItalic
                style={{
                  color: "#01f9d2",
                  fontStyle: "italic",
                  fontSize: 16,
                  marginTop: 10,
                  textAlign: "center",
                }}
                text={ResolveText("compartirCodigo")}
              />
            ) : null}
          </View>

          <NeuButton
            color="#541348"
            width={(4 / 5) * width}
            height={width / 7.5}
            borderRadius={width / 7.5}
            onPress={() => {
              loading ? null : Salir();
            }}
            style={{ marginTop: 30 }}
          >
            <TextBold
              text={ResolveText("cancelar")}
              style={{
                color: "#fff800", //"#01f9d2",
                fontWeight: "bold",
                fontSize: 20,
                textTransform: "uppercase",
              }}
            />
          </NeuButton>
        </View>
      </View>
    </View>
  );
};

export default CobrarPremioContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
  },
  codeModalContainer: {
    flex: 1,
    alignItems: "center",
  },

  codeModalContent: {
    padding: 22,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    marginHorizontal: 10,
    marginTop: 80,
  },
});
