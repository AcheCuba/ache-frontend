import React, { useContext } from "react";
import { Alert } from "react-native";
import { Dimensions, View, Text, Platform } from "react-native";
import { NeuButton } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";
import { GlobalContext } from "../../context/GlobalProvider";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import {
  resetNuevaRecargaState,
  restoreNuevaRecargaInitialState,
  setPrizeForUser,
} from "../../context/Actions/actions";

import Toast from "react-native-root-toast";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import { getData, removeItem, storeData } from "../../libs/asyncStorage.lib";
import { cancelNotification } from "../../libs/expoPushNotification.lib";

const { width, height } = Dimensions.get("screen");

const PrePagoScreen = ({ navigation, route }) => {
  const { price_usd, transaction_id_array } = route.params;

  const { userState, userDispatch } = React.useContext(GlobalContext);
  const { nuevaRecargaState, nuevaRecargaDispatch } = useContext(GlobalContext);
  const { contactosSeleccionados } = nuevaRecargaState;

  const quantity = contactosSeleccionados.length;
  const [amount, setAmount] = React.useState("0");
  //const [precioRecarga, setPrecioRecarga] = React.useState("20");

  React.useEffect(() => {
    setAmount(quantity * price_usd);
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

  const prize_finish_checkout = (uuid) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/finish-checkout/${uuid}`;
    let config = {
      method: "post",
      url: url,
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
            "Los premios están libres, y podrán cobrarse en otro momento",
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
          console.log(e.message);
          Toast.show("Los premios no pudieron liberarse", {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        });
    }
  };

  const onPressCancelarRecarga = () => {
    finish_checkout_all_prizes();
    nuevaRecargaDispatch(resetNuevaRecargaState());
    navigation.navigate("NuevaRecargaScreen");
  };

  const popUpAlert = () => {
    Alert.alert(
      "¿Desea cancelar?",
      "Si abandona la pantalla, se perderá el progreso de la recarga actual",
      [
        { text: "No quiero salir", style: "cancel", onPress: () => {} },
        {
          text: "Cancelar recarga",
          style: "destructive",

          onPress: () => onPressCancelarRecarga(),
        },
      ]
    );
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

  const onPressCancelarPorError = () => {
    let cancelTransactionPromisesArray = [];

    transaction_id_array.forEach((transaction_id) => {
      cancelTransactionPromisesArray.push(
        cancelTransactionRequest(transaction_id)
      );
    });

    Promise.all(cancelTransactionPromisesArray)
      .then(() => console.log("ok"))
      .catch((err) => console.log(err.message));

    nuevaRecargaDispatch(resetNuevaRecargaState());
    navigation.navigate("PagoErrorScreen");
  };

  const onPressConfirmarPago = async () => {
    let confirmTransactionPromisesArray = [];

    console.log(transaction_id_array);

    transaction_id_array.forEach((transaction_id) => {
      confirmTransactionPromisesArray.push(
        confirmTransactionRequest(transaction_id)
      );
    });

    Promise.all(confirmTransactionPromisesArray)
      .then(() => console.log("ok"))
      .catch((err) => console.log(err.message));

    nuevaRecargaDispatch(resetNuevaRecargaState());
    // setear premio a null

    storeData("user", {
      id: userState.id,
      name: userState.name,
      email: userState.email,
      phone: userState.phone,
      prize: null,
    });

    userDispatch(setPrizeForUser(null));
    navigation.navigate("PagoCompletadoScreen");

    const notId = await getData("notification-prize-expire");
    await cancelNotification(notId);
    await removeItem("notification-prize-expire");
  };

  return (
    <View style={{ backgroundColor: "#701c57", flex: 1, alignItems: "center" }}>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => onPressBackButton()}
      />
      <View
        style={{
          // backgroundColor: "blue",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          marginTop: -90,
        }}
      >
        <Text
          style={{
            fontFamily: Platform.OS === "android" ? "monospace" : null,
            fontSize: 100,
            fontWeight: "bold",
            color: "#ddd",
          }}
        >
          ${amount}
        </Text>
        <NeuButton
          style={{ marginTop: 40 }}
          width={width / 1.2}
          height={height / 7}
          color="#701c57"
          borderRadius={10}
          onPress={() => navigation.navigate("PagoScreen")}
        >
          <View style={{ paddingHorizontal: width / 6 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                fontWeight: "bold",
                color: "#01f9d2",
                textTransform: "uppercase",
              }}
            >
              Enter your card and pay
            </Text>
          </View>
        </NeuButton>
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "space-between",
          }}
        >
          <NeuButton
            style={{ marginRight: 30 }}
            width={width / 3}
            height={height / 7}
            color="#701c57"
            borderRadius={10}
            onPress={() => onPressCancelarPorError()}
          >
            <View style={{}}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#f00000",
                  textTransform: "uppercase",
                }}
              >
                Cancelar por Error
              </Text>
            </View>
          </NeuButton>
          <NeuButton
            style={{ marginLeft: 30 }}
            width={width / 3}
            height={height / 7}
            color="#701c57"
            borderRadius={10}
            onPress={() => onPressConfirmarPago()}
          >
            <View style={{}}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#00f000",
                  textTransform: "uppercase",
                }}
              >
                Confirmar Éxito
              </Text>
            </View>
          </NeuButton>
        </View>
      </View>
    </View>
  );
};

export default PrePagoScreen;
