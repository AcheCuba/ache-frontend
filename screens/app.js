import React, { useState, useEffect, useRef, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";

import useCachedResources from "../hooks/useCachedResources";
import Navigation from "../navigation";

import io from "socket.io-client";
import { GlobalContext } from "../context/GlobalProvider";
import {
  closeSocket,
  setPremiosConfirmadosSocket,
  setRecargasConfirmadasSocket,
  setSocketId,
  setTransaccionesResultado,
} from "../context/Actions/actions";
import { BASE_URL } from "../constants/domain";
import { writeContactToFileAsync } from "expo-contacts";
import { scheduleNotificationAtSecondsFromNow } from "../libs/expoPushNotification.lib";

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

export default function MainApp() {
  const [not, setNot] = useState("");
  const isLoadingComplete = useCachedResources();
  const notificationListener = useRef();
  const responseListener = useRef();

  // for socket communication

  const [transactionResultsArray, setTransactionResultsArray] = React.useState(
    []
  );
  let transaction_result_arr = [];

  //const colorScheme = useColorScheme();

  const {
    socketDispatch,
    socketState,
    nuevaRecargaState,
    nuevaRecargaDispatch,
  } = useContext(GlobalContext);
  const { socketOpen, transacciones_esperadas, transacciones_resultado } =
    socketState;

  const [socketCurrentlyOpen, setSocketCurrentlyOpen] = useState(false);

  let socket = io.connect(`${BASE_URL}`);

  useEffect(() => {
    //console.log("transacciones_resultado", transacciones_resultado);

    async function schedulePushNotif() {
      //console.log("transacciones_resultado final", transacciones_resultado);
      // crear arreglo de declinadas
      // cerrar socket
      socketDispatch(closeSocket());
      // crear push notification

      let resultadoConNumeros = [];

      transacciones_resultado.forEach((e) => {
        const id = e.transactionId;
        const elementWithId = transacciones_esperadas.find(
          (elem) => {
            //console.log("elem", elem);
            //console.log("id", id);
            return elem.transaction_id === id;
          }
          //console.log(elementWithId);
        );

        if (elementWithId != undefined) {
          const numb = elementWithId.mobile_number;
          const newObjectResultado = { ...e, mobile_number: numb };
          resultadoConNumeros.push(newObjectResultado);
        }
      });

      //console.log("resultados con nums", resultadoConNumeros);
      nuevaRecargaDispatch(setRecargasConfirmadasSocket(resultadoConNumeros));

      //================================================================

      //recordar: el bono (premio) se considera una recarga independiente
      const recargaConPremio = resultadoConNumeros.filter((transaction) => {
        return transaction.isTopUpBonus === true;
      });

      const recargaConPremio_clean = recargaConPremio.map((rec) => {
        return { uuid: rec.uuid, status: rec.status };
      });

      /*  const recargaConPremio_clean = transacciones_resultado.map((rec) => {
        return { uuid: rec.uuid, status: rec.status };
      }); */

      nuevaRecargaDispatch(setPremiosConfirmadosSocket(recargaConPremio_clean));

      /*   nuevaRecargaDispatch(
        setPremiosConfirmadosSocket(recargaConPremio)
      );
 */

      //console.log(recargaConPremio);

      //================================================================

      // ==== Enviar PUSH NOTIFICATION =====

      const declinadas = resultadoConNumeros.filter((elemento) => {
        return elemento.status !== "COMPLETED";
      });

      if (declinadas.length !== 0) {
        let cadenaEnviar = "";
        declinadas.map((elem) => {
          cadenaEnviar = cadenaEnviar + elem.mobile_number + "; ";
        });

        const cadenaEnviarClean = cadenaEnviar.substring(
          0,
          cadenaEnviar.length - 2
        );

        const notId = await scheduleNotificationAtSecondsFromNow(
          "Algunas recargas no se pudieron realizar",
          `${cadenaEnviarClean}`,
          1
        );
      }
      // ==== Enviar PUSH NOTIFICATION =====

      // reiniciar estado
      socketDispatch(setTransaccionesResultado([]));
    }

    if (
      transacciones_resultado.length === transacciones_esperadas.length &&
      transacciones_resultado.length !== 0
    ) {
      schedulePushNotif();
    }
  }, [transacciones_resultado]);

  useEffect(() => {
    if (socketOpen && !socketCurrentlyOpen) {
      //abrir socket
      setSocketCurrentlyOpen(true);

      socket.on("socketid", (sid) => {
        // guardar id
        //console.log("socket id below");
        //console.log(sid);
        socketDispatch(setSocketId(sid));
      });
    }

    if (!socketOpen) {
      // cerrar socket
      socket.disconnect();
      setSocketCurrentlyOpen(false);
      //console.log("client disconnect");
    }

    socket.on("transaction-update", (msg) => {
      let transaction_result;
      //console.info(msg);
      transaction_result = msg;
      //console.log("un resultadomaaas", transaction_result);
      transaction_result_arr.push(transaction_result);

      setTimeout(() => {
        socketDispatch(setTransaccionesResultado(transaction_result_arr));
        transaction_result = null;
      }, 5000);
    });
  }, [socketOpen]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNot(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar backgroundColor="transparent" style="light" />
      </SafeAreaProvider>
    );
  }
}
