import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import useCachedResources from "../hooks/useCachedResources";
import Navigation from "../navigation";
import io from "socket.io-client";
import { GlobalContext } from "../context/GlobalProvider";
import {
  setSocketId,
  setNewTransaccionNormalFallida,
  setNewTransaccionPremioFallida,
  setNewTransaccionNormalCompletada,
  setNewTransaccionPremioCompletada,
  resetNuevaRecargaState,
  resetSocketState,
  setPrizeForUser,
  setHayPremioCobradoModal,
  setHayPremioFallidoModal,
  setTransaccionesPremioEsperadas,
  setActualTransaccionPremioCompletada,
  setActualTransaccionPremioFallida,
} from "../context/Actions/actions";
import { BASE_URL } from "../constants/domain";
import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";
import { Audio } from "expo-av";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import axios from "axios";
import { storeData } from "../libs/asyncStorage.lib";
import Toast from "react-native-root-toast";
import { generalBgColor } from "../constants/commonColors";

SplashScreen.preventAutoHideAsync();

export default function MainAppWrapper() {
  return (
    <AnimatedSplashScreen
      //animationSource={require("../assets/animaciones/cocodrilo.lottie.json")}
      animationSource={require("../assets/animaciones/spinSplash.mp4.lottie.json")}
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
  const fadeAnim = useRef(new Animated.Value(1)).current; // Valor inicial de opacidad 1 (completamente visible)

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

  const handleFadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, // Opacidad al 0 (completamente invisible)
      duration: 500, // Duración de la animación
      useNativeDriver: true,
    }).start(() => {
      // navigate se ejecuta desde el manejo del usuario
      // puede ser hacia el home o hacia el onboarding
    });
  };

  setTimeout(() => {
    handleFadeOut();
    setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
  }, 6200);

  return (
    <View style={{ flex: 1, backgroundColor: generalBgColor }}>
      {isSplashAnimationComplete && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: fadeAnim,
          }}
        >
          <LottieView
            autoPlay
            loop={false}
            source={animationSource}
            ref={animation}
            style={{
              height: hp("105%"),
              width: wp("100%"),
            }}
            resizeMode="cover"
          />
        </Animated.View>
      )}
    </View>
  );
}

function MainApp() {
  // for socket communication

  const [updateNormalesCompleted, setUpdateNormalesCompleted] = useState(false);
  const [updateCompleted, setUpdateCompleted] = useState(false);
  const [localSocket, setLocalSocket] = useState(null);
  // const [isSocketDisconnected, setIsSocketDisconnected] = useState(false);

  //const colorScheme = useColorScheme();

  const {
    socketDispatch,
    socketState,
    nuevaRecargaState,
    nuevaRecargaDispatch,
    userState,
    userDispatch,
  } = useContext(GlobalContext);

  const {
    transacciones_normales_esperadas,
    transacciones_premio_esperadas,
    actual_transaccion_premio_completada,
    actual_transaccion_premio_fallida,

    // ======
    transacciones_normales_completadas,
    transacciones_premio_completadas,
    transacciones_normales_fallidas,
    transacciones_premio_fallidas,
  } = socketState;

  const countryIsoCode = userState?.country;
  const operatorId = userState?.operator.id;
  const isUserRecuperado = userState?.isUserRecuperado;
  const { transactions_id_array } = nuevaRecargaState;
  const paymentIntentId = nuevaRecargaState.paymentIntentId;
  const productPriceUsd = nuevaRecargaState.productPriceUsd;

  const updateUserSocket = (socketId) => {
    const userToken = userState.token;
    const userId = userState.id;
    const url = `${BASE_URL}/users/${userId}/socket`;
    let config = {
      method: "put",
      url: url,
      params: { socketId },
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };

    return axios(config);
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
    return axios(config);
  };

  // =======================================

  const finish_checkout_fallidas = (transaccionesNormalesFallidasSocket) => {
    // 1 notificar que algunas fallaron
    // 2 finish checkout false si tieen premios asociados

    if (transaccionesNormalesFallidasSocket.length != 0) {
      // 1

      Toast.show(
        userState?.idioma === "spa"
          ? "Una o varias de tus transacciones fallaron"
          : "One or more of your transactions failed",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );

      // 2
      transaccionesNormalesFallidasSocket.forEach(
        (transaccionNormalFallida) => {
          const transaccionDePremioAsociada = transactions_id_array.find(
            (transaccion) => {
              return (
                transaccion.topUpId ===
                  transaccionNormalFallida.transactionId &&
                transaccion.prize_uuid != undefined
              );
            }
          );
          if (transaccionDePremioAsociada != undefined) {
            prize_finish_checkout(
              transaccionDePremioAsociada.prize_uuid,
              false
            );
          }
        }
      );
    }
  };

  const create_prize_transaction = (transaccionesNormalesCompletadasSocket) => {
    // 1 eliminar la nada si una salio bien
    // 2 crear transacciones de premios (claime prize)
    // nota: no se hace finish ckeckout

    let transacciones_premio_esperadas_array = [];

    // 1
    const prizeInApp = userState.prize;
    const prizeType = userState.prize?.type;

    if (prizeInApp != null && prizeType === "Nada") {
      // console.log("se entro a eliminar la nada");
      // elimina la Nada de la app
      storeData("user", { ...userState, prize: null });
      userDispatch(setPrizeForUser(null));
    }

    // 2
    transaccionesNormalesCompletadasSocket.forEach(
      (transaccionNormalCompletada) => {
        //console.log("transaccion completada", transaccionNormalCompletada);
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
          // el usuario tiene algun premio
          // añadir transaccion de premio esperada
          transacciones_premio_esperadas_array.push(transaccionDePremio);

          console.log("premio a reclamar", transaccionDePremio);

          claim_prize(
            transaccionDePremio.dtoneProductId,
            transaccionDePremio.beneficiary,
            transaccionDePremio.prize_uuid,
            transaccionDePremio.socketId
          )
            .then((resp) => {
              console.log("claim prize status", resp.status);

              // premio en pending
              // si hay premio en la app y no es la Nada...
              if (prizeInApp != null && prizeType != "Nada") {
                // si ESTE premio que estoy clameando
                // es el que tengo en la app
                // cambiar su estado a pending
                if (prizeInApp.uuid === transaccionDePremio.prize_uuid) {
                  console.log("premio de la app cambiado a pending");

                  storeData("user", {
                    ...userState,
                    prize: { ...prizeInApp, status: "pending" },
                  });
                  userDispatch(
                    setPrizeForUser({ ...prizeInApp, status: "pending" })
                  );
                }
              }
            })
            .catch((err) => {
              console.log("claim prize error", err.message);
              prize_finish_checkout(transaccionDePremio.prize_uuid, false);
              // se le dice al usuario que hubo un problema
              Toast.show(
                userState?.idioma === "spa"
                  ? "Hubo un error con la transacción de uno de tus premio"
                  : "There was an error with the transaction of one of your prizes",
                {
                  duaration: Toast.durations.LONG,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                }
              );
            });
        }
      }
    );

    console.log(
      "numero de transacciones premio esperadas",
      transacciones_premio_esperadas_array.length
    );
    socketDispatch(
      setTransaccionesPremioEsperadas(transacciones_premio_esperadas_array)
    );
  };

  const refund = (paymentIntentId, productPriceUsd) => {
    const user_token = userState.token;
    const _url = `${BASE_URL}/payments/refund/${paymentIntentId}`;

    let amount_refund = 0;
    const productPrice = parseFloat(productPriceUsd);

    for (let i = 0; i < transacciones_normales_fallidas.length; i++) {
      //const element = array[index];
      amount_refund = amount_refund + productPrice;
    }
    //console.log(typeof productPrice);
    //console.log(typeof productPriceUsd);
    //console.log(typeof amount_refund);

    if (amount_refund != 0) {
      console.log("reembolso", amount_refund);

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
          console.log("refund status", response.status);
        })
        .catch((error) => {
          console.log("refund error");
          console.log(error.message);
        });
    }
  };

  useEffect(() => {
    let num_transacciones_premio_esperadas;
    let num_transacciones_premio_resultado;

    let num_transacciones_normales_esperadas;
    let num_transacciones_normales_resultado;

    if (transacciones_normales_esperadas.length != 0) {
      num_transacciones_normales_esperadas =
        transacciones_normales_esperadas.length;
      num_transacciones_normales_resultado =
        transacciones_normales_completadas.length +
        transacciones_normales_fallidas.length;

      num_transacciones_premio_esperadas =
        transacciones_premio_esperadas.length;

      num_transacciones_premio_resultado =
        transacciones_premio_completadas.length +
        transacciones_premio_fallidas.length;

      if (
        !updateNormalesCompleted &&
        num_transacciones_normales_esperadas ===
          num_transacciones_normales_resultado
      ) {
        setUpdateNormalesCompleted(true);
        console.log("update normales completed");
        // crear transacciones de premio (claim prize)
        if (transacciones_normales_completadas.length != 0) {
          create_prize_transaction(transacciones_normales_completadas);
        }
        // FINISH CHECKOUT FALSE PREMIOS DE RECARGAS FALLIDAS
        finish_checkout_fallidas(transacciones_normales_fallidas);
        // DEVOLVER DINERO DE LAS QUE FALLARON
        if (transacciones_normales_fallidas.length != 0) {
          refund(paymentIntentId, productPriceUsd);
        }
      }

      if (
        !updateCompleted &&
        updateNormalesCompleted &&
        num_transacciones_premio_esperadas ===
          num_transacciones_premio_resultado
      ) {
        // si habian, se completaron las transacciones de premios

        setUpdateCompleted(true);
        console.log("update completed");

        // resetear variables relacionadas a la transaccion
        // aqui estoy seguro de que se hizo lo demas, pues updateNormalesCompleted es true
        socketDispatch(resetSocketState());
        nuevaRecargaDispatch(resetNuevaRecargaState());
      }
    }
  }, [
    transacciones_normales_esperadas,
    transacciones_premio_esperadas,
    // ====
    transacciones_normales_completadas,
    transacciones_normales_fallidas,
    transacciones_premio_completadas,
    transacciones_premio_fallidas,
    // ===
    transactions_id_array,
    // ====
    updateCompleted,
    updateNormalesCompleted,
  ]);

  useEffect(() => {
    // 1 si es el de la app, eliminarlo y notificar con modal
    // 2 si no está en la app, no hago nada (el finish checkout true lo hace backend)

    if (actual_transaccion_premio_completada != null) {
      const prize_completed = actual_transaccion_premio_completada;
      const prizeInApp = userState.prize;

      if (prizeInApp != null) {
        // console.log("prize transaction completed", prize_completed.uuid);
        // console.log("uuid del premio en la app", prizeInApp.uuid);

        // 1
        if (prizeInApp?.uuid === prize_completed.uuid) {
          // elimino
          storeData("user", { ...userState, prize: null });
          userDispatch(setPrizeForUser(null));
          console.log("premio eliminado de app");
          // modal notificacion
          nuevaRecargaDispatch(setHayPremioCobradoModal(true));
        }
      }
    }
  }, [actual_transaccion_premio_completada]);

  useEffect(() => {
    // el finish checkout false lo hace backend
    // si es el de la app notificar con modal

    if (actual_transaccion_premio_fallida != null) {
      const prizeInApp = userState.prize;
      const prize_fallido = actual_transaccion_premio_fallida;

      // notificar si está en la app
      if (prizeInApp?.uuid === prize_fallido.uuid) {
        nuevaRecargaDispatch(setHayPremioFallidoModal(true));
      }
    }
  }, [actual_transaccion_premio_fallida]);

  useEffect(() => {
    if (isUserRecuperado) {
      const newSocket = io.connect(`${BASE_URL}`);

      newSocket.on("connect", () => {
        console.log("connected to server, socket saved");
        setLocalSocket(newSocket);
        // actualizar a backend
        socketDispatch(setSocketId(newSocket.id));
        updateUserSocket(newSocket.id)
          .then((response) => {
            if (response.status === 200) {
              console.log("socket id actualizado en backend exitosamente");
            }
          })
          .catch((err) => {
            console.log("no se pudo actualizar el socketid en backend");
          });
      });
    }
  }, [isUserRecuperado]);

  useEffect(() => {
    if (localSocket != null) {
      console.log("eventos establecidos con el id:", localSocket.id);

      // ahora se definen los eventos a escuchar

      localSocket.on("disconnect", () => {
        console.log("socket disconnected");
      });

      localSocket.on("topup-completed", (transaccion_msg) => {
        console.log("normal completed", transaccion_msg);

        // lo añado solo si no existe

        socketDispatch(setNewTransaccionNormalCompletada(transaccion_msg));
      });

      localSocket.on("topup-failed", (transaccion_msg) => {
        console.log("normal failed", transaccion_msg);
        socketDispatch(setNewTransaccionNormalFallida(transaccion_msg));
      });

      localSocket.on("prize-topup-completed", (transaccion_msg) => {
        console.log("premio completada", transaccion_msg);
        // gestionar_nuevo_premio_completado(transaccion_msg);
        socketDispatch(setActualTransaccionPremioCompletada(transaccion_msg));
        socketDispatch(setNewTransaccionPremioCompletada(transaccion_msg));
      });

      localSocket.on("prize-topup-failed", (transaccion_msg) => {
        console.log("premio fallida", transaccion_msg);
        // gestionar_nuevo_premio_fallido(transaccion_msg);
        socketDispatch(setActualTransaccionPremioFallida(transaccion_msg));
        socketDispatch(setNewTransaccionPremioFallida(transaccion_msg));
      });
    }
  }, [localSocket]);

  useEffect(() => {
    if (updateCompleted) {
      setUpdateCompleted(false);
      setUpdateNormalesCompleted(false);
    }
  }, [updateCompleted]);

  /* useEffect(() => {
    //console.log("update normales completed? ", updateNormalesCompleted);
    //console.log("update premios completed? ", updatePremiosCompleted);

    if (updatePremiosCompleted && updateNormalesCompleted) {
      setUpdateCompleted(true);
      //socketDispatch(SetGlobalUpdateCompleted(true));
    }
  }, [updateNormalesCompleted, updatePremiosCompleted]); */

  return (
    <View style={{ flex: 1 }}>
      <Navigation />
      <StatusBar backgroundColor="transparent" style="light" />
    </View>
  );
}
