import React, { memo } from "react";
import { StyleSheet, View, ActivityIndicator, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { GlobalContext } from "../../context/GlobalProvider";
import { BASE_URL, frontend_url } from "../../constants/domain";
import axios from "axios";
import { setPaymentIntentId } from "../../context/Actions/actions";
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

  //console.log(url);
  const amount = route.params?.amount; //total price usd
  const transactions_id_array = route.params?.transactions_id_array;
  const productPriceUsd = route.params?.productPriceUsd;
  //const recharge_amount_por_recarga = route.params?.recharge_amount_por_recarga;
  const { userState, nuevaRecargaState, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { name, email } = userState;
  const { validated_prizes, contactosSeleccionados } = nuevaRecargaState;

  React.useEffect(() => {
    // console.log("paymentSucceded", paymentSucceded);
    if (paymentSucceded) {
      // 1 obtener payment id para refund
      // nota: esto solo funciona cuando se completa el pago
      getPaymentIntentId(sessionId);

      // 2 confirmar transacciones

      let confirmTransactionPromisesArray = [];

      transactions_id_array.forEach((transaction) => {
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

  const createPaymentSession = async () => {
    // console.log("amount", amount);
    const input = {
      amount: amount, // amount total
      // amount: 5, // amount preprod
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
      } // si tiene premio, se crean 2 recargas por contacto

      return {
        [contacto.contactNumber]: {
          name: contacto.contactName,
          topups: topups_array,
        },
      };
    });

    const description = Object.assign(...createPaymentDescArray);
    const user_token = userState.token;
    const _url = `${BASE_URL}/payments/create-payment`;

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

    axios(config)
      .then((response) => {
        const data = response.data;
        setSessionId(data.id);
        // setLocalPaymentIntentId(data.payment_intent);
        setUrl(initUrl + "payment?session=" + data.id);
        setLoading(false);
      })
      .catch((e) => {
        console.log("error", e.message);
      });
  };

  const getPaymentIntentId = (id) => {
    // nota: id -> sessionId
    // console.log("session id", id);

    const user_token = userState.token;
    const url = `${BASE_URL}/payments/get-payment-intent-id/${id}`;

    let config = {
      method: "get",
      url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    axios(config)
      .then((response) => {
        // console.log("payment intent id", response.data);
        const paymentIntentId = response.data;
        nuevaRecargaDispatch(setPaymentIntentId(paymentIntentId));
      })
      .catch((err) => {
        console.log(err.message);
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

    // console.log("finish checkout url - pago screen", config.url);
    // console.log("FINISH CHECKOUT -- PAGO SCREEN", uuid);
    // console.log("COBRADO EXITOSAMENTE?", success);
    return axios(config);
  };

  const finish_checkout_all_prizes = () => {
    // solo se llama cuando falla el pago de stripe

    let primisesForFinish = [];

    validated_prizes.forEach((prize) => {
      primisesForFinish.push(prize_finish_checkout(prize.uuid, false));
    });

    Promise.all(primisesForFinish)
      .then((r) => {})
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
      finish_checkout_all_prizes(); // pago fallido
      let cancelTransactionPromisesArray = [];

      transactions_id_array.forEach((transaction) => {
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
