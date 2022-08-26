import React, { useState, useEffect, useRef, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Alert, Platform } from "react-native";
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
  setTransactionsIdArray,
  SetGlobalUpdateCompleted,
} from "../context/Actions/actions";
import { BASE_URL } from "../constants/domain";
import { scheduleNotificationAtSecondsFromNow } from "../libs/expoPushNotification.lib";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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

  const {
    userState,
    socketDispatch,
    socketState,
    nuevaRecargaState,
    nuevaRecargaDispatch,
  } = useContext(GlobalContext);
  const {
    socketIsOpen,
    transacciones_normales_esperadas,
    transacciones_premio_esperadas,
    transacciones_normales_resultado,
    transacciones_premio_resultado,
  } = socketState;

  const { transactions_id_array } = nuevaRecargaState;

  //const [socketCurrentlyOpen, setSocketCurrentlyOpen] = useState(false);

  //const [newUpdate, setNewUpdate] = React.useState()

  let socket = io.connect(`${BASE_URL}`);

  /* useEffect(() => {
    console.log(userState);
  }, [userState]); */

  useEffect(() => {
    //console.log("update completed? ", updateCompleted);

    if (updateCompleted) {
      //console.log("update completed!");
      transaction_result_arr = [];
      socketDispatch(closeSocket()); // socketIsOpen: false
      setUpdateCompleted(false);
      setUpdateNormalesCompleted(false);
      setUpdatePremiosCompleted(false);

      // limpiar estados sockets
      socketDispatch(setTransaccionesPremioEsperadas([]));
      socketDispatch(setTransaccionesPremioResultado([]));
      socketDispatch(setTransaccionesNormalesEsperadas([]));
      socketDispatch(setTransaccionesNormalesResultado([]));
      nuevaRecargaDispatch(setTransactionsIdArray([]));
    }
  }, [updateCompleted]);

  useEffect(() => {
    //console.log("update normales completed? ", updateNormalesCompleted);
    //console.log("update premios completed? ", updatePremiosCompleted);

    if (updatePremiosCompleted && updateNormalesCompleted) {
      setUpdateCompleted(true);
      socketDispatch(SetGlobalUpdateCompleted(true));
    }
  }, [updateNormalesCompleted, updatePremiosCompleted]);

  useEffect(() => {
    //console.log("updateNormalesCompleted", updateNormalesCompleted);

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
      //console.log("entro a updateTransaccionesPremioCompleted");
      if (!updatePremiosCompleted) {
        nuevaRecargaDispatch(
          setTransaccionesPremioConfirmadas(transacciones_premio_resultado)
        );

        //socketDispatch(setTransaccionesPremioEsperadas([]));
        //socketDispatch(setTransaccionesPremioResultado([]));
      }
      setUpdatePremiosCompleted(true);

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

      if (!updateNormalesCompleted) {
        //console.log("entra a updateTransaccionesNormalesCompleted");
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

        // reiniciar estado socket
        //socketDispatch(setTransaccionesNormalesEsperadas([]));
        //socketDispatch(setTransaccionesNormalesResultado([]));
        //transaction_result_arr = [];
      }
      setUpdateNormalesCompleted(true);
    }

    if (
      transacciones_normales_resultado.length ===
      transacciones_normales_esperadas.length
    ) {
      if (transacciones_normales_resultado.length !== 0) {
        updateTransaccionesNormalesCompleted();

        //console.log("transacciones NORM dist de cero");

        if (transacciones_premio_esperadas.length !== 0) {
          // si se espera alguna y ya tengo los resultados de las normales
          //console.log("transacciones PREMIO dist de cero");

          //codigo nuevo
          const transaccionesNormalesCompletadas =
            transacciones_normales_resultado.filter((recarga) => {
              return recarga.status === "COMPLETED";
            });

          const transaccionesDePremioArray = []; // para ver si debo esperar por los resultados de premios

          transaccionesNormalesCompletadas.forEach(
            (transaccionNormalCompletada) => {
              const transaccionDePremio = transactions_id_array.find(
                (transaccion) => {
                  return (
                    transaccion.topUpId ===
                      transaccionNormalCompletada.transactionId &&
                    transaccion.prize_uuid != undefined
                  );
                }
              );
              if (transaccionDePremio != undefined) {
                //console.log("transaccionDePremio", transaccionDePremio);
                transaccionesDePremioArray.push(transaccionDePremio);
              }
            }
          );

          if (transaccionesDePremioArray.length !== 0) {
            if (transacciones_premio_resultado.length !== 0) {
              updateTransaccionesPremioCompleted();
            }
          } else {
            // no esperar por los resultados de premios
            setUpdatePremiosCompleted(true);
          }
        } else {
          // no se esperan premios
          setUpdatePremiosCompleted(true);
        }
      }
    }

    /*  if (
      transacciones_premio_resultado.length ===
      transacciones_premio_esperadas.length
    ) {
      if (transacciones_premio_resultado.length != 0) {
        updateTransaccionesPremioCompleted();
      }
    } */
  }, [
    transacciones_normales_resultado,
    transacciones_normales_esperadas,
    transacciones_premio_esperadas,
    transacciones_premio_resultado,
    transactions_id_array,
    updateNormalesCompleted,
    updatePremiosCompleted,
  ]);

  useEffect(() => {
    //if (socketIsOpen && !socketCurrentlyOpen) {
    //console.log("socket open", socketIsOpen);

    if (socketIsOpen) {
      //abrir socket
      //setSocketCurrentlyOpen(true);

      socket.on("socketid", (sid) => {
        // guardar id
        //console.log("socket id - app.js", sid);
        socketDispatch(setSocketId(sid));
      });
    }

    /* socket.on("connect", function onConnect() {
      console.log("This socket is now connected to the Aché server.");
    });

    socket.on("disconnect", function onDisconnect() {
      console.log("This socket lost connection to the Aché server");
    }); */

    /* if (!socketIsOpen) {
      // cerrar socket
      console.log("FUNCION DE CERRAR SOCKET");
      socket.disconnect();
      //setSocketCurrentlyOpen(false);
      //console.log("client disconnect");
    } */

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
          //console.log("transaction_result_arr", transaction_result_arr);

          if (!transaction_result.isTopUpBonus) {
            socketDispatch(
              setNewTransaccionNormalResultado(transaction_result)
            );
          } else {
            //console.log("transaction de premio socket result");
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

  const onLayoutRootView = React.useCallback(async () => {
    console.log("onlayout function");
    if (isLoadingComplete) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.

      /* Alert.alert(
          "hide async splash screen",
          "ejecutado dentro de timeout de 5 segundos",
          [
            {
              text: "cancelar",
              style: "cancel",
              onPress: () => {},
            },
            {
              text: "abortar",
              style: "destructive",

              onPress: () => {},
            },
          ]
        ); */

      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 3000);
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    /*     <SafeAreaProvider>
     */ <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Navigation />
      <StatusBar backgroundColor="transparent" style="light" />
    </View>
    /*     </SafeAreaProvider>
     */
  );
}
