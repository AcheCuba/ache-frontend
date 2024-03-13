import React, { memo } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { GlobalContext } from "../../context/GlobalProvider";
import { BASE_URL, frontend_url } from "../../constants/domain";

import axios from "axios";
import {
  deleteAllTransaccionesPremio,
  resetNuevaRecargaState,
  setPrizeForUser,
} from "../../context/Actions/actions";
import { storeData } from "../../libs/asyncStorage.lib";
import { StatusBar } from "react-native";

// antes
// `${server_url}/api/payments/mobile/create?amount=${input.amount}&name=${input.name}&email=${input.email}`,

// ngrok
// const server_url = "http://48e33416ac70.ngrok.io";

const PagoScreen = ({ navigation, route }) => {
  const [loading, setLoading] = React.useState(true);
  const [initUrl, setinitUrl] = React.useState(frontend_url);
  const [paymentSucceded, setPaymentSucceded] = React.useState(false);
  const [url, setUrl] = React.useState(frontend_url + "payment-init");
  const [sessionId, setSessionId] = React.useState("empty");
  const [paymentIntentId, setPaymentIntentId] = React.useState("");

  //console.log(url);
  const amount = route.params?.amount; //total price usd
  const transaction_id_array = route.params?.transaction_id_array;
  const productPriceUsd = route.params?.productPriceUsd;
  //const recharge_amount_por_recarga = route.params?.recharge_amount_por_recarga;

  const {
    userState,
    userDispatch,
    nuevaRecargaState,
    nuevaRecargaDispatch,
    socketDispatch,
  } = React.useContext(GlobalContext);
  const { name, email } = userState;
  const countryIsoCode = userState?.country;
  const operatorId = userState?.operator?.id;

  const {
    transacciones_premio_confirmadas,
    transacciones_normales_confirmadas,
    validated_prizes,
    contactosSeleccionados,
  } = nuevaRecargaState;

  React.useEffect(() => {
    if (transacciones_normales_confirmadas.length !== 0) {
      console.log(
        "TRANSACCIONES CONFIRMADAS",
        transacciones_normales_confirmadas
      );
      // confirm transaction de los premios que tienen recargas completadas
      // finish checkout de premios cuyas recargas fallaron
      // eliminar la nada de la app (si al menos una recarga sin premio salio bien)
      managePrizes();

      // devolver el dinero de las recargas que salieron mal
      refund();
      /* setTimeout(() => {
        nuevaRecargaDispatch(setTransaccionesNormalesConfirmadas([]));
      }, 5000); */
    }
  }, [transacciones_normales_confirmadas]);

  React.useEffect(() => {
    //console.log("paymentSucceded - pago", paymentSucceded);
    if (paymentSucceded) {
      let confirmTransactionPromisesArray = [];
      //console.log("transaction id array - pago screen", transaction_id_array);

      transaction_id_array.forEach((transaction) => {
        confirmTransactionPromisesArray.push(
          confirmTransactionRequest(transaction.topUpId, false)
        );
      });

      //console.log("confirm transaction normales - pago screen");
      Promise.all(confirmTransactionPromisesArray)
        .then((responseList) => {
          /* responseList.forEach((response) => {
            console.log("confirm transaction status", response.status);
          }); */
          //console.log("request", response.request);
        })
        .catch((err) => {
          //console.log("confirm transaction error status", err.response.status);
          //console.log(error.response.headers);
        });

      setTimeout(() => {
        setPaymentSucceded(false);
      }, 10000);

      navigation.navigate("PagoCompletadoScreen");
    }
  }, [paymentSucceded]);

  const managePrizes = () => {
    console.log("SE LLAMA A MANAGE PRIZES");

    // === logica === UPDATED 29/09/23
    // filtrar las transacciones completadas en $transacciones_normales_confirmadas
    // recorrer ese array
    // buscar cada transaccion en transaction_id_array
    // verificar si en esa transaccion prize_uuid es o no undefinded
    // si no es "undefined": se llama a CLAIM PRIZE

    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;

    //console.log("TRNASACTION ID ARRAY", transaction_id_array);

    const transaccionesNormalesCompletadas =
      transacciones_normales_confirmadas.filter((recarga) => {
        return recarga.status === "COMPLETED";
      });

    console.log("RECARGAS COMPLETADAS", transaccionesNormalesCompletadas);

    const transaccionesNormalesNoCompletadas =
      transacciones_normales_confirmadas.filter((recarga) => {
        return recarga.status !== "COMPLETED";
      });

    if (transaccionesNormalesCompletadas.length != 0) {
      // alguna se completo exitosamente
      if (prizeInApp != null && prizeType === "Nada") {
        // console.log("se entro a eliminar la nada");
        // elimina la Nada de la app
        storeData("user", { ...userState, prize: null });
        userDispatch(setPrizeForUser(null));
      }
      transaccionesNormalesCompletadas.forEach(
        (transaccionNormalCompletada) => {
          //console.log("transaccion completada", transaccionNormalCompletada);
          const transaccionDePremio = transaction_id_array.find(
            (transaccion) => {
              return (
                transaccion.topUpId ===
                  transaccionNormalCompletada.transactionId &&
                transaccion.prize_uuid != undefined
              );
            }
          );
          console.log("TRANSACCION DE PREMIO ASOCIADA", transaccionDePremio);
          if (transaccionDePremio != undefined) {
            claim_prize(
              transaccionDePremio.dtoneProductId,
              transaccionDePremio.beneficiary,
              transaccionDePremio.prize_uuid,
              transaccionDePremio.socketId
            )
              .then((resp) => {
                console.log("CLAIM PRIZE");
                //console.log(resp.data);
                //console.log(resp.status);

                // LIBERAR PREMIO COBRADO
                prize_finish_checkout(transaccionDePremio.prize_uuid, true); // cobrado

                // SI ESTE PREMIO ES EL QUE TIENES EN LA APP
                // SE ELIMINA DEL BOTON NARANJA

                if (prizeInApp?.type != "Nada") {
                  if (prizeInApp?.uuid === transaccionDePremio.prize_uuid) {
                    // nada más puede coincidir una vez

                    // console.log("SE ELIMINA PREMIO DE LA APP");

                    storeData("user", { ...userState, prize: null });
                    userDispatch(setPrizeForUser(null));
                  }
                }
              })
              .catch((err) => {
                // ERROR EN EL CLAIM PRIZE
                // NO SE LIBERA EL PREMIO
                console.log("CLAIM PRIZE ERROR", err.response.status);
                console.log(err.message);
                prize_finish_checkout(transaccionDePremio.prize_uuid, false);
              });
          }
        }
      );
    }
    // FINALIZA CHECKOUT DE PREMIOS CUYAS TRANSACCIONES
    // NO SE REALIZARON

    if (transaccionesNormalesNoCompletadas.length != 0) {
      transaccionesNormalesNoCompletadas.forEach(
        (transaccionNormalNoCompletada) => {
          const transaccionDePremio = transaction_id_array.find(
            (transaccion) => {
              return (
                transaccion.topUpId ===
                  transaccionNormalNoCompletada.transactionId &&
                transaccion.prize_uuid != undefined
              );
            }
          );
          if (transaccionDePremio != undefined) {
            /* console.log(
              "prize finish checkout de premio cuya recarga no se completo"
            ); */
            prize_finish_checkout(transaccionDePremio.prize_uuid, false);
          }
        }
      );
    }
  };

  const claim_prize = async (
    dtoneProductId,
    beneficiary,
    prizeCode,
    socketId
  ) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/claim-prize`;

    let config;

    config = {
      method: "post",
      url,
      data: {
        beneficiary,
        prizeCode,
        countryIsoCode,
        dtoneProductId,
        operatorId,
        socketId,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    //console.log("claim prize", config);

    return axios(config);
  };

  // ahora se llama a TOPUP/CLAIM_PRIZE (SOLO CAMBIA EL NOMBRE)
  /* const create_transaction_prizes = async (
    beneficiary,
    prizeCode,
    dtoneProductId,
    socketId
  ) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/create-transaction`;
    //console.log("socket id pasado al endpoint", socketId);

    let config;

    config = {
      method: "post",
      url,
      data: {
        beneficiary,
        prizeCode,
        dtoneProductId,
        socketId,
        countryIsoCode,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    //console.log("create transaction prizes", config);
    //console.log("create trnasaction prizes prize code", prizeCode);

    return axios(config);
  }; */

  const refund = () => {
    //console.log("se inicia refund si es necesario");

    const user_token = userState.token;
    const _url = `${BASE_URL}/payments/refund/${paymentIntentId}`;

    let amount_refund = 0;
    const productPrice = parseFloat(productPriceUsd);

    for (let i = 0; i < transacciones_normales_confirmadas.length; i++) {
      //const element = array[index];
      if (transacciones_normales_confirmadas[i].status !== "COMPLETED") {
        amount_refund = amount_refund + productPrice;
      }
    }
    //console.log(typeof productPrice);
    //console.log(typeof productPriceUsd);
    //console.log(typeof amount_refund);

    if (amount_refund != 0) {
      //console.log("amount refund - pago screen", amount_refund);

      let config = {
        method: "post",
        url: _url,
        params: { amount: amount_refund },
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      };

      axios(config)
        .then((response) => {
          //console.log("==== refund response =====");
          //console.log("refund status", response.status);
          //console.log("request", response.request);
        })
        .catch((error) => {
          //console.log("=== refund error ===");
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            //console.log(error.response.data);
            //console.log(error.response.status);
            //console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            //console.log("Error", error.message);
          }
          //console.log(error.config);
        });
    }
  };

  const createPaymentSession = async () => {
    console.log("amount", amount);
    const input = {
      amount: amount, // amount total
      //amount: 1,
      name: name, // nombre del usuario actual
      email: email, // email del usuario actual
    };

    const createPaymentDescArray = contactosSeleccionados.map((contacto) => {
      const topups_array = [
        {
          amount: undefined, // aqui decidir que poner (22/09/23)
          price: parseFloat(productPriceUsd),
          isPrize: false,
        },
      ]; // como mínimo 1 recarga por contacto

      if (contacto.prize != null) {
        topups_array.push({
          amount: undefined,
          price: undefined,
          isPrize: true,
        });
      } // si tiene premio, 2 recargas por contacto

      return {
        [contacto.contactNumber]: {
          name: contacto.contactName,
          topups: topups_array,
        },
      };
    });

    const description = Object.assign(...createPaymentDescArray);

    // console.log("description", description);

    const user_token = userState.token;
    const _url = `${BASE_URL}/payments/create-payment`;

    //console.log(url);

    let config = {
      method: "post",
      url: _url,
      data: {
        amount: input.amount,
        name: input.name,
        email: input.email,
        description,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    //console.log("DATA CREATE PAYMENT", config.data);

    //console.log(config);
    //console.log("Se ha iniciado el pago");

    axios(config)
      .then((response) => {
        //console.log(response.data);
        //console.log(response.status);
        const res = response.data;
        setSessionId(res.id);
        setPaymentIntentId(res.payment_intent);
        setUrl(initUrl + "payment?session=" + res.id);
        setLoading(false);
      })
      .catch((e) => {
        //console.log("error", e.message);
      });
  };

  const cancelTransactionRequest = (transaction_id) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/cancel-transaction/${transaction_id}`;
    const config = {
      method: "post",
      url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    return axios(config);
  };

  const confirmTransactionRequest = (transaction_id, isTopUpBonus) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/confirm-transaction/${transaction_id}`;
    const config = {
      method: "post",
      url,
      params: { isTopUpBonus },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    //console.log("url llamada en confirm transaction", config.url);
    return axios(config);
  };

  const prize_finish_checkout = (uuid, success) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/finish-checkout/${uuid}`;
    let config = {
      method: "post",
      url: url,
      params: { success: success },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    //console.log("finish checkout url - pago screen", config.url);
    console.log("FINISH CHECKOUT -- PAGO SCREEN", uuid);
    console.log("COBRADO EXITOSAMENTE?", success);
    return axios(config);
  };

  const finish_checkout_all_prizes_noCobrados = () => {
    //setPrize({ fieldId, uuid, type, loading: true })

    let primisesForFinish = [];

    validated_prizes.forEach((prize) => {
      primisesForFinish.push(prize_finish_checkout(prize.uuid, false));
    });

    Promise.all(primisesForFinish)
      .then(() => {})
      .catch((e) => {
        //console.log(e.message);
      });
  };

  const _onNavigationStateChange = (webViewState) => {
    if (webViewState.url === initUrl + "payment-init") {
      //console.log("init");
      createPaymentSession();
    }

    if (webViewState.url === initUrl + "payment-success") {
      //console.log("success");
      setPaymentSucceded(true);
    }

    if (webViewState.url === initUrl + "payment-failure") {
      //console.log("failure");
      finish_checkout_all_prizes_noCobrados();
      let cancelTransactionPromisesArray = [];

      transaction_id_array.forEach((transaction) => {
        cancelTransactionPromisesArray.push(
          cancelTransactionRequest(transaction.topUpId)
        );
      });

      Promise.all(cancelTransactionPromisesArray)
        .then(() => {
          //console.log("ok cancelada")
        })
        .catch((err) => {
          //console.log(err.message)
        });

      nuevaRecargaDispatch(resetNuevaRecargaState());
      // se pasa amount y payment intent id pa refound en caso de fallo
      navigation.navigate("PagoErrorScreen");
    }
  };

  //casos
  //- start payment -> webview

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar hidden />
      <View style={{ flex: 2, marginTop: 18, marginBottom: 0 }}>
        {loading && (
          <View style={[styles.loader, styles.horizontal]}>
            <ActivityIndicator animating={true} size="large" color="#701c57" />
          </View>
        )}
        <View
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            //height: 70,
            width: Dimensions.get("window").width,
            zIndex: 200,
          }}
        />
        <WebView
          mixedContentMode="never"
          source={{
            uri: url,
          }}
          onNavigationStateChange={_onNavigationStateChange}
        />
      </View>
    </View>
  );
};

export default memo(PagoScreen);

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
