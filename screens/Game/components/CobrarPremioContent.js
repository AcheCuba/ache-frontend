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
  const { userState, userDispatch, nuevaRecargaDispatch } =
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

    verificarEstadoPremio()
      .then((response) => {
        // console.log(response.status)
        if (response.status === 200) {
          const prizeStatus = response.data.status;

          if (prizeStatus === "active") {
            // codigo actual
            generarCodigoRequest();
          }
          if (prizeStatus === "inactive") {
            // eliminar premio del storage
            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));
            setLoading(false);
            setModalVisible(false);
            // toast menssaje inactivo
            setPrizeInactiveError(true);
          }
          if (prizeStatus === "collected") {
            // finish_checkout con true
            const prize_id = currentPrize.uuid;
            prize_finish_checkout(prize_id, true)
              .then(() => {
                //console.log("premio libre")
              })
              .catch(() => {
                //console.log("error liberando el premio")
              })
              .finally(() => {
                setLoading(false);
              });
            // eliminar premio de la app
            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));

            setModalVisible(false);

            // toast mensaje colleted
            setPrizeCollectedError(true);
          }
          if (prizeStatus === "pending") {
            // finalizar checkout con false
            const prize_id = currentPrize.uuid;
            prize_finish_checkout(prize_id, false)
              .then((response) => {
                if (response.status === 201) {
                  // tonce considerar activo e intentar cambiarlo por codigo
                  generarCodigoRequest();
                }
              })
              .catch(() => {
                setModalVisible(false);
                setPrizePendingError(true); //-> toast: no se pudo liberar
              });
          }
        }
      })
      .catch(() => {
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

  const verificarEstadoPremio = () => {
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
  };

  const onPressObtenerPremio = () => {
    setLoadingObtenerPremio(true);
    verificarEstadoPremio()
      .then((response) => {
        // console.log(response.status)
        if (response.status === 200) {
          const prizeStatus = response.data.status;
          if (prizeStatus === "active") {
            setModalVisible(false);
            setLoadingObtenerPremio(false);
            // console.log(prizeStatus)
            navigation.jumpTo("Nueva Recarga", {
              screen: "NuevaRecargaScreen",
              params: { inOrderToCobrarPremio: true },
            });
          }
          if (prizeStatus === "collected") {
            const prize_id = currentPrize.uuid;
            prize_finish_checkout(prize_id, true)
              .then(() => {})
              .catch(() => {})
              .finally(() => {
                setLoadingObtenerPremio(false);
              });
            // eliminar premio del storage
            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));

            setModalVisible(false);

            // mensaje de que el premio ya esta cobrado
            // esto activa el estado en GameScreen, se lanza un toast
            setPrizeCollectedError(true);
          }
          if (prizeStatus === "pending") {
            console.log("pending");
            const prize_id = currentPrize.uuid;
            prize_finish_checkout(prize_id, false)
              .then((response) => {
                console.log(
                  "response status finish checkout:",
                  response.status
                );
                if (response.status === 201) {
                  // continuar
                  setLoadingObtenerPremio(false);
                  setModalVisible(false);
                  navigation.jumpTo("Nueva Recarga", {
                    screen: "NuevaRecargaScreen",
                    params: { inOrderToCobrarPremio: true },
                  });
                }
              })
              .catch(() => {
                setModalVisible(false);
                setLoadingObtenerPremio(false);
                setPrizePendingError(true); //-> toast: no se pudo liberar
              });
          }
          if (prizeStatus === "inactive") {
            setLoadingObtenerPremio(false);
            setModalVisible(false);
            // eliminar premio del storage
            storeData("user", {
              ...userState,
              prize: null,
            });
            // eliminar premio del estado de la app
            userDispatch(setPrizeForUser(null));
            setPrizeInactiveError(true); //-> toast: el premio no está activo
          }
        }
      })
      .catch(() => {
        // error toast
        setModalVisible(false);
        setVerificationError(true);
      });
  };

  const prize_finish_checkout = (uuid, success) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/finish-checkout/${uuid}`;
    let config = {
      method: "post",
      url: url,
      params: { success },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    return axios(config);
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
