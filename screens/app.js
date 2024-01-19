import React, { useState, useEffect, useRef, useContext } from "react";
import { StatusBar } from "expo-status-bar";
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
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { Audio, Video, ResizeMode } from "expo-av";

SplashScreen.preventAutoHideAsync();

export default function MainAppWrapper() {
  return (
    <AnimatedSplashScreen
      //animationSource={require("../assets/animaciones/cocodrilo.lottie.json")}
      animationSource={require("../assets/animaciones/spinRecargasSplash.mp4.lottie.json")}
      //animationSource={require("../assets/animaciones/loading.json")}
    >
      <MainApp />
    </AnimatedSplashScreen>
  );
}

function AnimatedSplashScreen({ animationSource, children }) {
  const isAppReady = useCachedResources();
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
  const animation = useRef(null);
  const [soundInicio, setSoundInicio] = React.useState();

  const splashVideoDir = require("../assets/animaciones/spinRecargasSplash.mp4");
  const video = React.useRef(null);

  /* const onEndf = () => {
    videoRef.current.pause();
  }; */

  async function playSoundInicio() {
    //console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/Sonidos/app_inicio.mp3")
    );
    setSoundInicio(sound);

    //console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return soundInicio
      ? () => {
          //console.log("Unloading Sound");
          soundInicio.unloadAsync();
        }
      : undefined;
  }, [soundInicio]);

  React.useEffect(() => {
    async function hideFirstScreen() {
      await SplashScreen.hideAsync();
      playSoundInicio();
    }

    if (isAppReady) {
      hideFirstScreen();
      //video.current.playAsync();
    }
  }, [isAppReady]);

  setTimeout(() => {
    setAnimationComplete(true);
    //video.current.pauseAsync();
  }, 8000); //8300

  return (
    <View style={{ flex: 1 }}>
      {isSplashAnimationComplete && children}
      {!isSplashAnimationComplete && (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* <Video
            ref={video}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            source={splashVideoDir}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping={false}
            shouldPlay
            //onPlaybackStatusUpdate={status => setStatus(() => status)}
          /> */}
          <LottieView
            autoPlay
            loop={true}
            source={animationSource}
            ref={animation}
            // onAnimationFinish={() => {
            // if (isAppReady) {
            //   setAnimationComplete(true);
            // } else {
            //   animation.current?.play();
            // }
            //}}
          />
        </View>
      )}
    </View>
  );
}

function MainApp() {
  // for socket communication

  let transaction_result_arr = [];

  const [updateNormalesCompleted, setUpdateNormalesCompleted] = useState(false);
  const [updatePremiosCompleted, setUpdatePremiosCompleted] = useState(false);
  const [updateCompleted, setUpdateCompleted] = useState(false);

  //const colorScheme = useColorScheme();

  const {
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
    });
  }, [socketIsOpen]);

  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <StatusBar backgroundColor="transparent" style="light" />
    </View>
  );
}
