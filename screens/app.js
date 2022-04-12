import React, { useState, useEffect, useRef, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import useCachedResources from "../hooks/useCachedResources";
import Navigation from "../navigation";
import io from "socket.io-client";
import { GlobalContext } from "../context/GlobalProvider";
import {
  closeSocket,
  setNewTransaccionResultado,
  setPremiosConfirmadosSocket,
  setRecargasConfirmadasSocket,
  setSocketId,
  setTransaccionesEsperadas,
  setTransaccionesResultado,
} from "../context/Actions/actions";
import { BASE_URL } from "../constants/domain";
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

  let transaction_result_arr = [];

  //const colorScheme = useColorScheme();

  const { socketDispatch, socketState, nuevaRecargaDispatch } =
    useContext(GlobalContext);
  const { socketIsOpen, transacciones_esperadas, transacciones_resultado } =
    socketState;

  //const [socketCurrentlyOpen, setSocketCurrentlyOpen] = useState(false);

  //const [newUpdate, setNewUpdate] = React.useState()

  const [transaction_arr_state, set_transaction_arr_state] = React.useState([]);
  let socket = io.connect(`${BASE_URL}`);

  useEffect(() => {
    //console.log("transacciones_resultado", transacciones_resultado.length);
    //console.log("transacciones esperadas", transacciones_esperadas.length);

    async function updateCompleted() {
      // en esta funcion
      // se programa la notificacion con los numeros fallidos
      // se actualiza el estado de la informacion recibida por socket
      // en el Screen de Pago se utiliza esa info para:
      // - devolver el dinero
      // - cancelar los premios cobrados y dejar los no cobrados

      //console.log("transacciones_resultado final", transacciones_resultado);
      // crear arreglo de declinadas
      // cerrar socket
      // console.log("close socket - update completed - app.js");
      socketDispatch(closeSocket()); // socketIsOpen: false

      // crear push notification

      let resultadosConNumeros = [];

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
          resultadosConNumeros.push(newObjectResultado);
        }
      });

      /* console.log(
        "recargas confirmadas con y sin premio - app.js",
        resultadosConNumeros
      ); */
      nuevaRecargaDispatch(setRecargasConfirmadasSocket(resultadosConNumeros));

      //================================================================

      //recordar: el bono (premio) se considera una recarga independiente
      const recargasConPremio = resultadosConNumeros.filter((transaction) => {
        return transaction.isTopUpBonus === true;
      });

      const recargasConPremio_clean = recargasConPremio.map((rec) => {
        return { uuid: rec.uuid, status: rec.status };
      });

      //console.log("premios confirmados - app.js", recargasConPremio_clean);
      nuevaRecargaDispatch(
        setPremiosConfirmadosSocket(recargasConPremio_clean)
      );

      //================================================================

      // ==== Enviar PUSH NOTIFICATION =====

      const declinadas = resultadosConNumeros.filter((elemento) => {
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
      socketDispatch(setTransaccionesEsperadas([]));
      transaction_result_arr = [];
    }

    if (
      transacciones_resultado.length === transacciones_esperadas.length &&
      transacciones_resultado.length !== 0
    ) {
      updateCompleted();
    }
  }, [transacciones_resultado, transacciones_esperadas]);

  useEffect(() => {
    //if (socketIsOpen && !socketCurrentlyOpen) {
    //console.log("socket open", socketIsOpen);

    if (socketIsOpen) {
      //abrir socket
      //setSocketCurrentlyOpen(true);

      socket.on("socketid", (sid) => {
        // guardar id
        // console.log("socket id - app.js", sid);
        socketDispatch(setSocketId(sid));
      });
    }

    if (!socketIsOpen) {
      // cerrar socket
      socket.disconnect();
      //setSocketCurrentlyOpen(false);
      //console.log("client disconnect");
    }

    socket.on("transaction-update", (msg) => {
      //console.log("transaction result variable array ", transaction_result_arr);

      let transaction_result;

      // declined o completed
      let isCompleted = false;
      let isDeclined = false;
      //console.info(msg);
      transaction_result = msg;
      // comprobar que el status es definitivo
      const status = transaction_result.status.split("-")[0];
      if (status === "COMPLETED") {
        isCompleted = true;
      } else if (status === "DECLINED") {
        isDeclined = true;
      }

      //console.log("status - app.js", status);

      if (isCompleted || isDeclined) {
        // es resultado final, verificar que no esta repetido
        const transIdActual = transaction_result.transactionId;
        const alreadyExistentTransId = transaction_result_arr.find(
          (t) => t.transactionId === transIdActual
        );

        //console.log("alreadyExistentTransId - app.js", alreadyExistentTransId);

        if (alreadyExistentTransId == undefined) {
          // no existe
          transaction_result_arr.push(transaction_result);
          socketDispatch(setNewTransaccionResultado(transaction_result));
        }
      }

      /* setTimeout(() => {
          socketDispatch(setTransaccionesResultado(transaction_result_arr));
          transaction_result_arr = [];
          transaction_result = null;
        }, 5000); */
    });
  }, [socketIsOpen]);

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
