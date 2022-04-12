import React, { memo } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { GlobalContext } from "../../context/GlobalProvider";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import {
  deleteAllPremiosSocket,
  deleteAllRecargasSocket,
  resetNuevaRecargaState,
  setPremiosConfirmadosSocket,
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
  const { premiosConfirmadosSocket, recargasConfirmadasSocket } =
    nuevaRecargaState;

  React.useEffect(() => {
    //console.log(typeof amount);
    //console.log(amount);
    //console.log("esDirecta", esDirecta);
    if (premiosConfirmadosSocket.length !== 0) {
      //console.log("premiosConfirmadosSocket", premiosConfirmadosSocket);
      //console.log("recargasConfirmadasSocket", recargasConfirmadasSocket);

      // elimiar premio de la app si se cobro bien ()

      prizeAppManage(premiosConfirmadosSocket);

      // finish checkout de los premios (true para ACCEPTED y false pra DECLINED)
      finish_checkout_all_prizes();
      // nuevaRecargaDispatch(deleteAllPremiosSocket());
    }

    if (recargasConfirmadasSocket.length !== 0) {
      // eliminar la nada de la app (si al menos una recarga sin premio salio bien)
      liberaCalaveraApp(recargasConfirmadasSocket);
      // devolver el dinero de las recargas que salieron mal
      refund();
      //nuevaRecargaDispatch(deleteAllRecargasSocket()); // hecho en refound
    }
  }, [premiosConfirmadosSocket, recargasConfirmadasSocket]);

  const refund = () => {
    //console.log("se inicia refund si es necesaria");
    /*  console.log(
      "recargasConfirmadasSocket - refund",
      recargasConfirmadasSocket
    ); */

    const user_token = userState.token;
    const _url = `${BASE_URL}/payments/refund/${paymentIntentId}`;

    let amount_refund = 0;
    const productPrice = parseFloat(productPriceUsd);

    for (let i = 0; i < recargasConfirmadasSocket.length; i++) {
      //const element = array[index];
      if (
        recargasConfirmadasSocket[i].status !== "COMPLETED" &&
        recargasConfirmadasSocket[i].isTopUpBonus === false
      ) {
        amount_refund = amount_refund + productPrice;
      }
    }
    //console.log(typeof productPrice);
    //console.log(typeof productPriceUsd);
    //console.log(typeof amount_refund);
    //console.log("amount refund", amount_refund);

    //console.log("refound amount", amount_refund);

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
        nuevaRecargaDispatch(deleteAllRecargasSocket());
        //console.log("==== refund response =====");
        //console.log("refund status", response.status);
        //console.log("request", response.request);
      })
      .catch((error) => {
        nuevaRecargaDispatch(deleteAllRecargasSocket());
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
    //console.log(config);
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
      params: { success },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    return axios(config);
  };

  const finish_checkout_all_prizes = () => {
    // recibir premiosConfirmadosSocket co su uuid
    // finalizar checkout con true si fue aceotado, de lo contrario con false
    // actualmete se finaliza el checkout siempre con true

    /*   console.log(
      "premiosConfirmadosSocket finish checkout",
      premiosConfirmadosSocket
    ); */

    /*  let primisesForFinish = [];
    const prizesInCheckout = contactosSeleccionados.map(
      (contacto) => contacto.prize
    );
    const prizesInCheckout_clean = prizesInCheckout.filter(
      (prize) => prize != null
    ); */
    let promisesForFinish = [];

    premiosConfirmadosSocket.forEach((prize) => {
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

        nuevaRecargaDispatch(deleteAllPremiosSocket());

        /*   Toast.show("Los premios podrán cobrarse en otro momento", {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }); */
      })
      .catch((e) => {
        // eliminar premios del estado
        nuevaRecargaDispatch(deleteAllPremiosSocket());

        //console.log(e.message);
      });
  };

  const prizeAppManage = (premiosSocket) => {
    // eliminar si se cobró correctamente, no si hubo algun problema
    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;
    //console.log("prize in app", prizeInApp);
    if (prizeInApp != null && prizeType != "Nada") {
      //console.log("se entro a eliminar premio");

      // hay premio en la app

      // recarga del premio bien? -> considerar cobrado: finish checkout true y eliminar de app
      // buscar prize en array de socket
      // si es aceptado eliminar de la app

      // racarga del premio mal? -> considerar no cobrado
      // si no es aceptado no eliminar

      const currentPrizeSocket = premiosSocket.find((premio) => {
        return premio.uuid === prizeInApp.uuid;
      });

      if (currentPrizeSocket != undefined) {
        const isCompleted = currentPrizeSocket.status === "COMPLETED";

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

  const liberaCalaveraApp = (recargasConfirmadasSocket) => {
    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;

    if (prizeInApp != null && prizeType === "Nada") {
      //console.log("se entro a eliminar la nada");

      // busca recargas que no sean premios
      const recargasNoPremio = recargasConfirmadasSocket.filter((recarga) => {
        return recarga.isTopUpBonus === false;
      });

      // busca recargas que se completaron exitosamente
      const recargasCompletadas = recargasNoPremio.find(
        (r) => r.status === "COMPLETED"
      );

      // si alguna se completo exitosamente...
      if (recargasCompletadas != undefined) {
        // elimina la Nada de la app
        storeData("user", { ...userState, prize: null });
        userDispatch(setPrizeForUser(null));
      }
    }
  };

  const _onNavigationStateChange = (webViewState) => {
    if (webViewState.url === initUrl + "payment-init") {
      createPaymentSession();
    }

    if (webViewState.url === initUrl + "payment-success") {
      let confirmTransactionPromisesArray = [];
      //const prizeInApp = userState.prize;
      //const prizeType = userState.prize?.type;
      //console.log(transaction_id_array);

      transaction_id_array.forEach((transaction_id) => {
        confirmTransactionPromisesArray.push(
          confirmTransactionRequest(transaction_id)
        );
      });

      Promise.all(confirmTransactionPromisesArray)
        .then(() => {
          //console.log("Transaccion confirmada (Pago Screen)")
        })
        .catch((err) => {
          //console.log("Error en confirm transaction:", err.message)
        });

      // condiciones iniciales para los estados de la recarga
      // excepto las relacionadas con el socket
      nuevaRecargaDispatch(resetNuevaRecargaState());

      navigation.navigate("PagoCompletadoScreen");

      cancelNotificationAsync();
    }

    if (webViewState.url === initUrl + "payment-failure") {
      finish_checkout_all_prizes(false);
      let cancelTransactionPromisesArray = [];

      transaction_id_array.forEach((transaction_id) => {
        cancelTransactionPromisesArray.push(
          cancelTransactionRequest(transaction_id)
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
      navigation.navigate("PagoErrorScreen", { paymentIntentId, amount });
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
