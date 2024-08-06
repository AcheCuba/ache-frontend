import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { GlobalContext } from "../../../context/GlobalProvider";
import axios from "axios";
import { BASE_URL } from "../../../constants/domain";
import {
  resetNuevaRecargaState,
  setPrizeForUser,
  setShowExpiredPrize,
} from "../../../context/Actions/actions";
import { ActivityIndicator } from "react-native";
import { storeData } from "../../../libs/asyncStorage.lib";
import { TextBold, TextItalic } from "../../../components/CommonText";
import {
  CobrarPremioTextEngish,
  CobrarPremioTextSpanish,
} from "../../../constants/Texts";
import normalize from "react-native-normalize";
import { buttonColor } from "../../../constants/commonColors";
import LargeFlatButton from "../../../components/LargeFlatButton";
// import useCachedResources from "../../../hooks/useCachedResources";
import { getPrizeForUser } from "../../../libs/getPrizeForUser";

const { width, height } = Dimensions.get("screen");

const CobrarPremioContent = ({
  navigation,
  setModalVisible,
  Salir,
  codigoGenerado,
  setCodigoGenerado, // equivale a codigo copiado
  horasRestantes,
  setPrizeCollectedError,
  setPrizePendingError,
  setPrizeInactiveError,
  setVerificationError,
}) => {
  const { userState, userDispatch, nuevaRecargaDispatch, interfaceDispatch } =
    React.useContext(GlobalContext);
  const currentPrize = userState.prize;

  const [loading, setLoading] = useState(false);
  const [prizeType, setPrizeType] = useState("");
  const [loadingObtenerPremio, setLoadingObtenerPremio] = useState(false);

  React.useEffect(() => {
    setPrizeType(currentPrize?.type);
    //console.log(currentPrize?.type);
  }, []);

  /* React.useEffect(() => {
    const getData_ = async () => {
      const userData = await getData("user");
      console.log("user data en storage", userData);
    };

    getData_();
  }); */

  /*   React.useEffect(() => {
    //console.log("codigo generado", codigoGenerado);
    //console.log(currentPrize?.type);
    console.log("userState cobrar premio", userState);
  }, [userState]); */

  const copyToClipboard = (code) => {
    Clipboard.setStringAsync(code);
  };

  const generarCodigoRequest = () => {
    const user_token = userState.token;
    const prize_id = currentPrize.uuid;
    const url = `${BASE_URL}/prize/exchange/${prize_id}`;
    //console.log(userState);
    //console.log(url);

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
          // const prizeResultUpdated = response.data; // exchanged true
          const prizeCode = currentPrize.uuid;

          // actualizar persistencia
          // storeData({ ...userState, prize: prizeResultUpdated });
          storeData("user", { ...userState, prize: null });

          // actualizar estado global
          userDispatch(setPrizeForUser(null));
          // para no afectar al estado de Nueva Recarga
          nuevaRecargaDispatch(resetNuevaRecargaState());

          // actualizar estado local
          copiarCode(prizeCode);
        }
      })
      .catch((error) => {
        // console.log("error obteniendo codigo:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPressGenerarCodigo = () => {
    setLoading(true);

    getPrizeForUser(userState)
      .then((response) => {
        if (response.status === 200) {
          const hasPrize = response.data.hasPrize;
          const currentPrize = response.data.activePrize;
          if (hasPrize) {
            // tiene algo (premio o skull)

            if (currentPrize === null) {
              // tiene skull, esto no podria pasar
              setLoadingObtenerPremio(false);
              setModalVisible(false);
            } else {
              // tiene premio
              // si esta activo, el proceso continua

              const prizeStatus = currentPrize.status;

              if (prizeStatus === "active") {
                // caso frecuente
                console.log("tactivo");
                generarCodigoRequest();
              }

              if (prizeStatus === "pending") {
                setModalVisible(false);
                setLoadingObtenerPremio(false);
                // activar toast en home screen
                setPrizePendingError(true);
              }

              if (prizeStatus === "collected") {
                setModalVisible(false);
                setLoadingObtenerPremio(false);
                setPrizeCollectedError(true);
              }

              if (prizeStatus === "inactive") {
                setLoadingObtenerPremio(false);
                setModalVisible(false);
                setPrizeInactiveError(true); //-> toast: el premio no está activo
              }
            }
          } else {
            // no tiene premio, expiró!
            // eliminar premio del storage

            setLoadingObtenerPremio(false);
            setModalVisible(false);

            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));

            setTimeout(() => {
              //setPremioExpirado(true);
              interfaceDispatch(setShowExpiredPrize(true));
            }, 1000);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setModalVisible(false);
        setVerificationError(true);
      });
  };

  /* const cleanNotification = async () => {
    const notId = await getData("notification-prize-expire");
    if (notId != null) {
      cancelNotification(notId);
      removeItem(notId);
    }
  }; */

  const copiarCode = (code) => {
    console.log(code);
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

  /* const verificarEstadoPremio = () => {
    const user_token = userState.token;
    const prize_id = currentPrize.uuid;
    const url = `${BASE_URL}/prize/status/${prize_id}`;

    let config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    return axios(config);
  }; */

  const onPressObtenerPremio = () => {
    setLoadingObtenerPremio(true);

    getPrizeForUser(userState)
      .then((response) => {
        if (response.status === 200) {
          const hasPrize = response.data.hasPrize;
          const currentPrize = response.data.activePrize;
          if (hasPrize) {
            // tiene algo (premio o skull)

            if (currentPrize === null) {
              // tiene skull, esto no podria pasar
              setLoadingObtenerPremio(false);
              setModalVisible(false);
            } else {
              // tiene premio
              // si esta activo, el proceso continua

              const prizeStatus = currentPrize.status;

              if (prizeStatus === "active") {
                console.log("tactivo");
                setModalVisible(false);
                setLoadingObtenerPremio(false);
                // console.log(prizeStatus)
                navigation.jumpTo("Nueva Recarga", {
                  screen: "NuevaRecargaScreen",
                  params: { inOrderToCobrarPremio: true },
                });
              }

              if (prizeStatus === "pending") {
                setModalVisible(false);
                setLoadingObtenerPremio(false);
                // activar toast en home screen
                setPrizePendingError(true);
              }

              if (prizeStatus === "collected") {
                setModalVisible(false);
                setLoadingObtenerPremio(false);
                setPrizeCollectedError(true);
              }

              if (prizeStatus === "inactive") {
                setLoadingObtenerPremio(false);
                setModalVisible(false);
                setPrizeInactiveError(true); //-> toast: el premio no está activo
              }
            }
          } else {
            // no tiene premio, expiró!
            // eliminar premio del storage

            setLoadingObtenerPremio(false);
            setModalVisible(false);

            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));

            setTimeout(() => {
              // setPremioExpirado(true);
              interfaceDispatch(setShowExpiredPrize(true));
            }, 1000);
          }
        }
      })
      .catch((err) => {
        // console.log(err);
        setModalVisible(false);
        setVerificationError(true);
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
          title = "El Diamante";
          desc = `Tienes un premio de $500! Para activarlo, debes comprar una recarga y añadir el premio. Un representante de Spin se pondrá en contacto contigo inmediatamente después. Si no quieres recargar ahora, compártelo con cualquiera de tus contactos para que recargue y cobre el premio`;
        } else if (idioma === "eng") {
          title = "The Diamond";
          desc = `You have a $500 prize. To claim it, add to a top-up and a Spin representative will get in touch with you shortly. Don’t want to recharge now? You can share it with any of your contacts so they do and then collect the prize.`;
        }
        break;
      case "DoublePrize":
        if (idioma === "spa") {
          title = "Recarga Doble";
          desc = `Tienes una recarga adicional para agregar. Si no quieres recargar ahora, puedes compartir su código con cualquiera de tus contactos para que recargue y cobre el premio`;
        } else if (idioma === "eng") {
          title = "Double Top-up";
          desc = `You have an extra top-up to add. Don’t want to recharge now? You can turn it into a code and share it with anyone so they can collect the prize`;
        }
        break;

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
      case "DoublePrize":
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

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          //justifyContent: "center",
          marginTop: normalize(height / 10),
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
          {loadingObtenerPremio ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {}}
              style={{
                backgroundColor: buttonColor,
                borderRadius: width / 7.5,
                width: (4 / 5) * width,
                height: width / 7,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <ActivityIndicator size="large" color="#fff800" />
            </TouchableOpacity>
          ) : (
            <LargeFlatButton
              text={ResolveText("obtenerPremio")}
              disabled={codigoGenerado}
              onPress={() => {
                // antes el condicional era con loading solo
                codigoGenerado || loading ? null : onPressObtenerPremio();
              }}
            />
          )}
        </View>
        <View style={styles.button}>
          {!loading ? (
            <LargeFlatButton
              text={ResolveText("copiarCodigo")}
              onPress={() => {
                codigoGenerado ? null : onPressGenerarCodigo(); //genera y copia el code de una vez
              }} // la condicion de generado implica que ha sido copiado ya
              disabled={codigoGenerado}
              textStyle={{
                color: codigoGenerado ? "#666666" : "#fff800", //"#01f9d2",
              }}
              btStyle={{ marginTop: 5 }}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {}}
              style={{
                backgroundColor: buttonColor,
                borderRadius: width / 7.5,
                width: (4 / 5) * width,
                height: width / 7,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <ActivityIndicator size="large" color="#fff800" />
            </TouchableOpacity>
          )}

          <View style={{ height: normalize(50, "height"), width: width / 1.3 }}>
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

          <LargeFlatButton
            text={ResolveText("cancelar")}
            onPress={() => {
              loading ? null : Salir();
            }}
          />
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
