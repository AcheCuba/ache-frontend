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
  setNewTransaccionNormalResultado,
  setNewTransaccionPremioResultado,
  setSocketId,
  setTransaccionesNormalesConfirmadas,
  setTransaccionesPremioConfirmadas,
  setTransaccionesNormalesEsperadas,
  setTransaccionesNormalesResultado,
  setTransaccionesPremioEsperadas,
  setTransaccionesPremioResultado,
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

  const [updateNormalesCompleted, setUpdateNormalesCompleted] = useState(false);
  const [updatePremiosCompleted, setUpdatePremiosCompleted] = useState(false);
  const [updateCompleted, setUpdateCompleted] = useState(false);

  //const colorScheme = useColorScheme();

  const { socketDispatch, socketState, nuevaRecargaDispatch } =
    useContext(GlobalContext);
  const {
    socketIsOpen,
    transacciones_normales_esperadas,
    transacciones_premio_esperadas,
    transacciones_normales_resultado,
    transacciones_premio_resultado,
  } = socketState;

  //const [socketCurrentlyOpen, setSocketCurrentlyOpen] = useState(false);

  //const [newUpdate, setNewUpdate] = React.useState()

  let socket = io.connect(`${BASE_URL}`);

  /* const confirmTransactionRequest = (transaction_id) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/confirm-transaction/${transaction_id}`;
    const config = {
      method: "post",
      url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    console.log("confirm trans config - app.js", config);

    axios(config)
      .then((response) => {
        //console.log(response.status)
      })
      .catch((error) => {
        //console.log(error.response.status)
      });
  }; */

  useEffect(() => {
    if (updateCompleted) {
      setTimeout(() => {
        transaction_result_arr = [];
        socketDispatch(closeSocket()); // socketIsOpen: false
        setUpdateCompleted(false);
      }, 3000);
    }
  }, [updateCompleted]);

  useEffect(() => {
    if (updatePremiosCompleted && updateNormalesCompleted) {
      setUpdateCompleted(true);
    }
  }, [updateNormalesCompleted, updatePremiosCompleted]);

  useEffect(() => {
    /* console.log("de premio esperadas - app.js", transacciones_premio_esperadas);
    console.log(
      "normales esperadas - app.js",
      transacciones_normales_esperadas
    );
    console.log(
      "normales resultado - app.js",
      transacciones_normales_resultado
    );
    console.log("de premio resultado - app.js", transacciones_premio_resultado); */

    async function updateTransaccionesPremioCompleted() {
      //recordar: el bono (premio) se considera una recarga independiente
      nuevaRecargaDispatch(
        setTransaccionesPremioConfirmadas(transacciones_premio_resultado)
      );

      nuevaRecargaDispatch(setTransaccionesPremioEsperadas([]));
      nuevaRecargaDispatch(setTransaccionesPremioResultado([]));

      /*   const recargasConPremio = resultadosConNumeros.filter((transaction) => {
        return transaction.isTopUpBonus === true;
      }); 

      const recargasConPremio_clean = recargasConPremio.map((rec) => {
        return {
          transactionId: rec.transactionId,
          uuid: rec.uuid,
          status: rec.status,
        };
      }); */
    }

    async function updateTransaccionesNormalesCompleted() {
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

      // cerrar socket
      //socketDispatch(closeSocket()); // socketIsOpen: false

      // acotejar resultados (agregar numeros) para enviar push notification
      let resultadosConNumeros = [];

      transacciones_normales_resultado.forEach((e) => {
        const id = e.transactionId;
        const elementWithId = transacciones_normales_esperadas.find(
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

      // actualizar estado de Nueva recarga para accionar segun resultados en Pantalla de Pago
      nuevaRecargaDispatch(
        setTransaccionesNormalesConfirmadas(transacciones_normales_resultado)
      );

      // =================== Enviar PUSH NOTIFICATION ===================
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
      // =================== Enviar PUSH NOTIFICATION ===================

      // reiniciar estado
      socketDispatch(setTransaccionesNormalesEsperadas([]));
      socketDispatch(setTransaccionesNormalesResultado([]));
      //transaction_result_arr = [];
    }

    if (
      transacciones_normales_resultado.length ===
      transacciones_normales_esperadas.length
    ) {
      setUpdateNormalesCompleted(true);

      if (transacciones_normales_resultado.length !== 0) {
        updateTransaccionesNormalesCompleted();
      }
    } else {
      setTimeout(() => {
        socketDispatch(closeSocket()); // socketIsOpen: false
      }, 5000);
    }

    if (
      transacciones_premio_resultado.length ===
      transacciones_premio_esperadas.length
    ) {
      setUpdatePremiosCompleted(true);
      if (transacciones_premio_resultado.length != 0) {
        updateTransaccionesPremioCompleted();
      }
    }
  }, [
    transacciones_normales_resultado,
    transacciones_normales_esperadas,
    transacciones_premio_esperadas,
    transacciones_premio_resultado,
  ]);

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

          if (!transaction_result.isTopUpBonus) {
            socketDispatch(
              setNewTransaccionNormalResultado(transaction_result)
            );
          } else {
            socketDispatch(
              setNewTransaccionPremioResultado(transaction_result)
            );
          }
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
