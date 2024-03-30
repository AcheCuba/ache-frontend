import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { GlobalContext } from "../context/GlobalProvider";
import {
  restore_user,
  setShowExpiredPrize,
  setShowHasPendingPrize,
  setShowInvisibleLoadData,
} from "../context/Actions/actions";
import moment from "moment";
import { getData, storeData } from "../libs/asyncStorage.lib";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import { BASE_URL } from "../constants/domain";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const { userDispatch, interfaceDispatch } = React.useContext(GlobalContext);

  const [assets] = useAssets([
    require("../assets/images/home/fondoOscuro.png"),
    require("../assets/images/home/bisel.png"),
    require("../assets/images/home/fondo.png"),
    require("../assets/images/home/centro.png"),
    require("../assets/images/home/sombra.png"),
    require("../assets/images/home/premios_finales/Diamante_GRAN_PREMIO.png"),
    require("../assets/images/home/premios_finales/Monedas_250_CUP.png"),
    require("../assets/images/home/premios_finales/Monedas_500_CUP.png"),
    require("../assets/images/home/premios_finales/calavera_roja.png"),
  ]);

  const [loaded] = useFonts({
    "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "bs-medium": require("../assets/fonts/bloggerSans/BloggerSans-Medium.ttf"),
    "bs-bold": require("../assets/fonts/bloggerSans/BloggerSans-Bold.ttf"),
    "bs-italic": require("../assets/fonts/bloggerSans/BloggerSans-MediumItalic.ttf"),
    "bs-bold-italic": require("../assets/fonts/bloggerSans/BloggerSans-BoldItalic.ttf"),
  });

  const actualizarEstadoPremio = (user) => {
    const user_token = user.token;
    const userId = user.id;
    //const prize_id = user.prize?.uuid;
    //const url = `${BASE_URL}/prize/status/${prize_id}`;
    const url = `${BASE_URL}/users/${userId}`;

    let config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    return axios(config);
  };

  /* const prize_finish_checkout = (user, uuid, success) => {
    const user_token = user.token;
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
  }; */

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //SplashScreen.show();
        //SplashScreen.preventAutoHideAsync();

        let token = null;
        let user = null;

        token = await SecureStore.getItemAsync("token");
        user = await getData("user");

        //console.log(token);
        //===================== USO EN DEV: ELIMINAR PREMIO DE APP ===========================
        /* storeData("user", {
          ...user,
          prize: null,
        });
        userDispatch(restore_user({ ...user, prize: null, token }));

        user = await getData("user"); */
        //===================== USO EN DEV: ELIMINAR PREMIO DE APP ============================

        //===================== USO EN DEV: ELIMINAR USER DE LA APP ===========================
        // await AsyncStorage.removeItem("user");
        // user = await getData("user");
        //===================== USO EN DEV: ELIMINAR USER DE LA APP ===========================

        //===================== USO EN DEV eliminar token de expo push not ===========================
        //await SecureStore.deleteItemAsync("expo-push-token");
        //===================== USO EN DEV eliminar token de expo push not ===========================

        //console.log(user);
        //console.log(token);

        if (user === null) {
          console.log("user es null");
          interfaceDispatch(setShowInvisibleLoadData(true));
        }

        if (user != null && token != null) {
          //if (user.prize !== null && user.prize.exchanged === false) {
          if (user.prize !== null) {
            // const currentPrizeStorage = user.prize;
            // console.log("useCachedResources.js", currentPrizeStorage);

            actualizarEstadoPremio(user)
              .then((response) => {
                console.log("get user usedCachedResources", response.status);
                if (response.status === 200) {
                  const hasPrize = response.data.hasPrize;
                  // console.log("hasPrize", hasPrize);
                  const currentPrize = response.data.activePrize;
                  // console.log("current prize get user", currentPrize);
                  if (hasPrize) {
                    // tiene premio
                    // si es null, tiene skull

                    if (currentPrize === null) {
                      // tiene skull
                      const currentTime = moment();
                      const expirationDate = moment(
                        response.data.skullExpirationTime
                      ).local();
                      const minutos_restantes = expirationDate.diff(
                        currentTime,
                        "minutes"
                      );
                      if (minutos_restantes < 0) {
                        // expiro la skull
                        // puede cobrar premios otra vez
                        storeData("user", {
                          ...user,
                          prize: null,
                        });
                        userDispatch(
                          restore_user({ ...user, prize: null, token })
                        );
                      } else {
                        // aun tiene skull
                        // actualizar tiempo restante
                        storeData("user", {
                          ...user,
                          prize: {
                            ...user.prize,
                            minutos_restantes,
                          },
                        });
                        userDispatch(
                          restore_user({
                            ...user,
                            prize: {
                              ...user.prize,
                              minutos_restantes,
                            },
                            token,
                          })
                        );
                      }
                    } else {
                      // tiene premio
                      // actualizar en estado y storage de app:
                      // sea cual sea
                      const currentTime = moment();
                      const expirationDate = moment(
                        currentPrize.expirationDate
                      ).local();
                      const minutos_restantes = expirationDate.diff(
                        currentTime,
                        "minutes"
                      );
                      if (minutos_restantes < 0) {
                        // premio expirado, eliminar de la app
                        storeData("user", {
                          ...user,
                          prize: null,
                        });
                        userDispatch(
                          restore_user({ ...user, prize: null, token })
                        );

                        //--- activar bandera: premio expirado---
                        interfaceDispatch(setShowExpiredPrize(true));
                      } else {
                        // minutos_restantes > 0!
                        // --- el premio esta vigente ---

                        // actualizacion del premio en la app
                        storeData("user", {
                          ...user,
                          prize: {
                            ...currentPrize,
                            minutos_restantes,
                          },
                        });
                        userDispatch(
                          restore_user({
                            ...user,
                            prize: {
                              ...currentPrize,
                              minutos_restantes,
                            },
                            token,
                          })
                        );

                        console.log("premio actual en la app", {
                          ...currentPrize,
                          minutos_restantes,
                        });

                        // obtener estado estado
                        const prizeStatus = currentPrize.status;

                        if (prizeStatus === "pending") {
                          // tiene un premio pendiente
                          // notificar en el modal de la app
                          interfaceDispatch(setShowHasPendingPrize(true));
                        }
                      }
                    }
                  } else {
                    // no tiene premio, actualizar en app
                    // sirve para el caso pending
                    // tambien para skull
                    storeData("user", {
                      ...user,
                      prize: null,
                    });
                    // eliminar premio del estado de la app
                    userDispatch(restore_user({ ...user, prize: null, token }));
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // no hay premio guardado en la app
            // se verifica si realmente no tiene premio
            // sirve para el caso de desinstalacion de la app

            actualizarEstadoPremio(user)
              .then((response) => {
                console.log("useCachedRes - get new user", response.status);
                if (response.status === 200) {
                  const hasPrize = response.data.hasPrize;
                  const currentPrize = response.data.activePrize;
                  if (hasPrize) {
                    // tiene premio

                    if (currentPrize === null) {
                      // tiene skull y la app no lo sabia
                      // dibujar skull
                      const currentTime = moment();
                      const expirationDate = moment(
                        response.data.skullExpirationTime
                      ).local();
                      //const expirationDate = moment().add(1, "days");

                      const minutos_restantes = expirationDate.diff(
                        currentTime,
                        "minutes"
                      );

                      storeData("user", {
                        ...user,
                        prize: {
                          type: "Nada",
                          minutos_restantes,
                          expirationDate,
                        },
                      });
                      userDispatch(
                        restore_user({
                          ...user,
                          prize: {
                            type: "Nada",
                            minutos_restantes,
                            expirationDate,
                          },
                          token,
                        })
                      );
                    } else {
                      // tiene premio y la app no lo sabia
                      // dibujar premio

                      const currentTime = moment();
                      const expirationDate = moment(
                        currentPrize.expirationDate
                      ).local();
                      const minutos_restantes = expirationDate.diff(
                        currentTime,
                        "minutes"
                      );
                      storeData("user", {
                        ...user,
                        prize: {
                          ...currentPrize,
                          minutos_restantes,
                        },
                      });
                      userDispatch(
                        restore_user({
                          ...user,
                          prize: {
                            ...currentPrize,
                            minutos_restantes,
                          },
                          token,
                        })
                      );
                    }
                  } else {
                    // no tiene premio, es consistente con la app
                    // restaurar el storage del user en el estado de la app
                    // el estado de la app recuerda lo almacenado
                    userDispatch(restore_user({ ...user, token }));
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!assets || !loaded) {
    return false;
  }
  return isLoadingComplete;
}
