import React, { memo } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { GlobalContext } from "../../context/GlobalProvider";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import {
  deleteAllTransaccionesPremio,
  resetNuevaRecargaState,
  setPrizeForUser,
} from "../../context/Actions/actions";
import { getData, removeItem, storeData } from "../../libs/asyncStorage.lib";
import { cancelNotification } from "../../libs/expoPushNotification.lib";
import Toast from "react-native-root-toast";

const frontend_url = "https://react-paymentsite.herokuapp.com/";

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
  const amount = route.params?.amount;
  const transaction_id_array = route.params?.transaction_id_array;
  const productPriceUsd = route.params?.productPriceUsd;

  const { userState, userDispatch, nuevaRecargaState, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { name, email } = userState;
  const {
    transacciones_premio_confirmadas,
    transacciones_normales_confirmadas,
    validated_prizes,
  } = nuevaRecargaState;

  React.useEffect(() => {
    /*  console.log(
      "transacciones_normales_confirmadas - pago",
      transacciones_normales_confirmadas
    );
    console.log(
      "transacciones_premio_confirmadas - pago",
      transacciones_premio_confirmadas
    ); */

    if (transacciones_premio_confirmadas.length !== 0) {
      // elimiar premio de la app si se cobro bien ()
      prizeAppManage(transacciones_premio_confirmadas);

      // finish checkout de los premios (true para COMPLETED y false para DECLINED)
      finish_checkout_all_prizes_confirmados();
    }

    if (transacciones_normales_confirmadas.length !== 0) {
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

    return () => {
      //console.log("============== clean up Pago screen ===============");
    };
  }, [transacciones_premio_confirmadas, transacciones_normales_confirmadas]);

  React.useEffect(() => {
    //console.log("paymentSucceded - pago", paymentSucceded);
    if (paymentSucceded) {
      let confirmTransactionPromisesArray = [];
      //console.log("transaction id array - pago screen", transaction_id_array);

      transaction_id_array.forEach((transaction) => {
        confirmTransactionPromisesArray.push(
          confirmTransactionRequest(transaction.topUpId)
        );
      });

      //console.log("confirm transaction normales - pago screen");
      Promise.all(confirmTransactionPromisesArray)
        .then((response) => {
          //console.log("==== confirm transaction response - PagoScreen =====");
          //console.log("confirm transaction status", response.status);
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
      cancelNotificationAsync();
    }
  }, [paymentSucceded]);

  const managePrizes = () => {
    // confrim transaction de premios si las recargas normales fueron completed
    // FINISH CHECKOUT de los premios asociados si no fueron completed
    // se elimina la NADA si alguna recarga salio bien

    // filtrar las transacciones completadas en $transacciones_normales_confirmadas
    // recorrer ese array
    // buscar cada transaccion en transaction_id_array
    // verificar si en esa transaccion prizeId es o no undefinded
    // si no es undefinded: hacer confirm transaction con ese prizeId

    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;

    const transaccionesNormalesCompletadas =
      transacciones_normales_confirmadas.filter((recarga) => {
        return recarga.status === "COMPLETED";
      });

    const transaccionesNormalesNoCompletadas =
      transacciones_normales_confirmadas.filter((recarga) => {
        return recarga.status !== "COMPLETED";
      });

    if (transaccionesNormalesCompletadas.length != 0) {
      // alguna se completo exitosamente
      if (prizeInApp != null && prizeType === "Nada") {
        //console.log("se entro a eliminar la nada");
        // elimina la Nada de la app
        storeData("user", { ...userState, prize: null });
        userDispatch(setPrizeForUser(null));
      }
      transaccionesNormalesCompletadas.forEach(
        (transaccionNormalCompletada) => {
          const transaccionDePremio = transaction_id_array.find(
            (transaccion) => {
              return (
                transaccion.topUpId ===
                  transaccionNormalCompletada.transactionId &&
                transaccion.prizeId != undefined
              );
            }
          );
          if (transaccionDePremio != undefined) {
            //console.log("confirm transaction premio - pago screen");
            confirmTransactionRequest(transaccionDePremio.prizeId)
              .then((response) => {
                console.log(response.status);
              })
              .catch((err) => {
                console.log(
                  "confirm transaction request error",
                  err.response.status
                );
              });
          }
        }
      );
    }
    if (transaccionesNormalesNoCompletadas.length != 0) {
      transaccionesNormalesNoCompletadas.forEach(
        (transaccionNormalNoCompletada) => {
          const transaccionDePremio = transaction_id_array.find(
            (transaccion) => {
              return (
                transaccion.topUpId ===
                  transaccionNormalNoCompletada.transactionId &&
                transaccion.prizeId != undefined
              );
            }
          );
          if (transaccionDePremio != undefined) {
            console.log(
              "prize finish checkout de premio cuya recarga no se completo"
            );
            prize_finish_checkout(transaccionDePremio.prize_uuid, false);
          }
        }
      );
    }
  };

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
  };

  const createPaymentSession = async () => {
    const input = {
      amount: amount,
      name: name,
      email: email,
    };

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
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    //console.log(config);
    //console.log("Se ha iniciado el pago");

    axios(config)
      .then((response) => {
        //console.log(response.data);
        const res = response.data;
        setSessionId(res.id);
        setPaymentIntentId(res.payment_intent);
        setUrl(initUrl + "payment?session=" + res.id);
        setLoading(false);
      })
      .catch((e) => {
        //console.log(e.message)
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

  const confirmTransactionRequest = (transaction_id) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/confirm-transaction/${transaction_id}`;
    const config = {
      method: "post",
      url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    //console.log("url llamada en confirm transaction", config.url);
    return axios(config);
  };

  const cancelNotificationAsync = async () => {
    const notId = await getData("notification-prize-expire");
    if (notId != null) {
      await cancelNotification(notId);
      await removeItem("notification-prize-expire");
    }
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
    //console.log("finish checkout params - pago screen", config.params);
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

  const finish_checkout_all_prizes_confirmados = () => {
    // recibir premiosConfirmadosSocket co su uuid
    // finalizar checkout con true si fue COMPLETED, de lo contrario con false

    let promisesForFinish = [];

    transacciones_premio_confirmadas.forEach((prize) => {
      //primisesForFinish.push(prize_finish_checkout(prize.uuid, true));
      if (prize.status !== "COMPLETED") {
        promisesForFinish.push(prize_finish_checkout(prize.uuid, false));
        //console.log("finish checkout con false");
      } else {
        promisesForFinish.push(prize_finish_checkout(prize.uuid, true));
        //console.log("finish checkout con true");
      }
    });

    Promise.all(promisesForFinish)
      .then(() => {
        // eliminar premios del estado
        nuevaRecargaDispatch(deleteAllTransaccionesPremio());
        console.log("finish checkout ok");
      })
      .catch((e) => {
        // eliminar premios del estado
        nuevaRecargaDispatch(deleteAllTransaccionesPremio());
        console.log("finish checkout error: ", e.message);
      });
  };

  const prizeAppManage = (transacciones_premio_confirmadas) => {
    // eliminar si se cobró correctamente, no si hubo algun problema
    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;
    //console.log("prize in app", prizeInApp);
    if (prizeInApp != null && prizeType != "Nada") {
      //console.log("se entro a eliminar premio");

      // hay premio en la app
      // si es completado eliminar de la app
      // recordar: completado implica que se llamo a confirmTransaction de esa transaccion-premio
      // por tanto la recarga asociada salio bien

      // racarga del premio mal? -> considerar no cobrado
      // si no es completado no eliminar

      const currentPrizeConfirmado = transacciones_premio_confirmadas.find(
        (premio) => {
          return premio.uuid === prizeInApp.uuid;
        }
      );

      if (currentPrizeConfirmado != undefined) {
        const isCompleted = currentPrizeConfirmado.status === "COMPLETED";

        //console.log("isCompleted", isCompleted);

        if (isCompleted) {
          // si esta es que esta completado: eliminar
          storeData("user", { ...userState, prize: null });
          userDispatch(setPrizeForUser(null));
        }
      }

      // ====== =================

      // setPremiosConfirmados(premiosConfirmados.concat({ uuid: prizeInApp.uuid }))

      // ====== =================
    }
  };

  /* const liberaCalaveraApp = (transacciones_normales_confirmadas) => {
    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;

    if (prizeInApp != null && prizeType === "Nada") {
      console.log("se entro a eliminar la nada");

      // busca recargas que se completaron exitosamente
      const transaccionesNormalesCompletadas =
        transacciones_normales_confirmadas.find(
          (transaccion) => transaccion.status === "COMPLETED"
        );

      // si alguna se completo exitosamente...
      if (transaccionesNormalesCompletadas != undefined) {
        // elimina la Nada de la app
        storeData("user", { ...userState, prize: null });
        userDispatch(setPrizeForUser(null));
      }
    }
  }; */

  const _onNavigationStateChange = (webViewState) => {
    if (webViewState.url === initUrl + "payment-init") {
      createPaymentSession();
    }

    if (webViewState.url === initUrl + "payment-success") {
      setPaymentSucceded(true);
    }

    if (webViewState.url === initUrl + "payment-failure") {
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2 }}>
        {loading && (
          <View style={[styles.loader, styles.horizontal]}>
            <ActivityIndicator animating={true} size="large" color="#701c57" />
          </View>
        )}
        <View
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            height: 70,
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
