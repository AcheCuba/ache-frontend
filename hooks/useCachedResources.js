import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { restore_user } from "../context/Actions/actions";
import moment from "moment";
import { getData, storeData } from "../libs/asyncStorage.lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import { BASE_URL } from "../constants/domain";
import axios from "axios";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const { userState, userDispatch } = React.useContext(GlobalContext);

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

  const verificarEstadoPremio = (user) => {
    const user_token = user.token;
    const prize_id = user.prize?.uuid;
    const url = `${BASE_URL}/prize/status/${prize_id}`;

    let config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    return axios(config);
  };

  const prize_finish_checkout = (user, uuid, success) => {
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
  };

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

        //===================== solo para eliminar premio en app ===========================

        /* storeData("user", {
          ...user,
          prize: null,
        });
        userDispatch(restore_user({ ...user, prize: null, token }));

        user = await getData("user");  */

        //===================== solo para eliminar premio en app ===========================

        //===================== solo para eliminar user ===========================
        // await AsyncStorage.removeItem("user");
        // user = await getData("user");
        //===================== solo para eliminar user ===========================

        //===================== solo para eliminar token de expo push not ===========================
        //await SecureStore.deleteItemAsync("expo-push-token");
        //===================== solo para eliminar token de expo push not ===========================

        //console.log(user);
        //console.log(token);

        if (user != null && token != null) {
          if (user.prize !== null && user.prize.exchanged === false) {
            const currentPrizeState = user.prize;

            const currentTime = moment();
            const prizeEndTime = moment(currentPrizeState.prizeEndTime);
            const minutos_restantes = prizeEndTime.diff(currentTime, "minutes");
            //console.log(minutos_restantes);
            if (minutos_restantes < 0) {
              // premio expirado
              storeData("user", {
                ...user,
                prize: null,
              });
              userDispatch(restore_user({ ...user, prize: null, token }));
            } else {
              storeData("user", {
                ...user,
                prize: {
                  ...currentPrizeState,
                  minutos_restantes,
                },
              });
              userDispatch(
                restore_user({
                  ...user,
                  prize: {
                    ...currentPrizeState,
                    minutos_restantes,
                  },
                  token,
                })
              );

              verificarEstadoPremio(user)
                .then((response) => {
                  if (response.status === 200) {
                    const prizeStatus = response.data.status;
                    // console.log(prizeStatus)
                    if (prizeStatus === "pending") {
                      // finalizar checkout con false
                      const prize_id = currentPrizeState.uuid;
                      prize_finish_checkout(user, prize_id, false)
                        .then((response) => {
                          if (response.status === 201) {
                            // console.log("premio liberado")
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                    if (prizeStatus === "collected") {
                      // finalizar checkout con true
                      const prize_id = currentPrizeState.uuid;
                      prize_finish_checkout(user, prize_id, true)
                        .then((response) => {
                          if (response.status === 201) {
                            //console.log("premio liberado")
                          }
                        })
                        .catch((err) => {
                          //console.log(err)
                        });
                      // eliminar premio del storage
                      storeData("user", {
                        ...user,
                        prize: null,
                      });
                      // eliminar premio del estado de la app
                      userDispatch(
                        restore_user({ ...user, prize: null, token })
                      );
                    }
                  }
                })
                .catch((err) => {
                  // console.log(err)
                });
            }
          } else {
            // aqui se copia lo guardado en el storage para el estado actual de la app
            userDispatch(restore_user({ ...user, token }));
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
