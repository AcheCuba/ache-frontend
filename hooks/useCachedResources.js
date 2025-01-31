// import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { GlobalContext } from "../context/GlobalProvider";
import {
  restore_user,
  setHayPremioCobradoModal,
  setShowExpiredPrize,
  setShowInvisibleLoadData,
  setUserRecuperado,
} from "../context/Actions/actions";
import moment from "moment";
import { getData, storeData } from "../libs/asyncStorage.lib";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import { BASE_URL } from "../constants/domain";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPrizeForUser } from "../libs/getPrizeForUser";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const { userDispatch, interfaceDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);

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

  /*  const actualizarEstadoPremio = (user) => {
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
  }; */

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //SplashScreen.show();
        //SplashScreen.preventAutoHideAsync();

        //let token = null;
        //token = await SecureStore.getItemAsync("token");

        let user = null;
        // let token = undefined;

        // el token esta dentro del object user
        user = await getData("user");

        //===================== USO EN DEV: ELIMINAR PREMIO DE APP ===========================
        /* storeData("user", {
          ...user,
          prize: null,
        });
        userDispatch(restore_user({ ...user, prize: null }));

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
          // esto se activa solo cuando el usuario no tiene datos guardados y esta en login
          // es util para saber esto
          // lo se, el nombre es pesimo para el resto de usos
        } else {
          getPrizeForUser(user)
            .then((response) => {
              if (response.status === 200) {
                userDispatch(setUserRecuperado(true));
                const hasPrize = response.data.hasPrize;
                const currentPrize = response.data.activePrize;

                if (hasPrize) {
                  // tiene algo (premio o skull)

                  if (currentPrize === null) {
                    // tiene skull
                    // dibujar

                    // se actualiza expiration date segun backend
                    const expirationDate = moment(
                      response.data.skullExpirationTime
                    ).local();

                    storeData("user", {
                      ...user,
                      prize: {
                        type: "Nada",
                        expirationDate,
                      },
                    });
                    userDispatch(
                      restore_user({
                        ...user,
                        prize: {
                          type: "Nada",
                          expirationDate,
                        },
                      })
                    );
                  } else {
                    // tiene premio
                    // si estoy aqui, es que no ha expirado en bckend
                    // actualizacion del premio en frontend
                    // si está activo, lo dibujo en la app

                    // const prizeStatus = currentPrize.status;

                    // console.log(currentPrize);

                    storeData("user", {
                      ...user,
                      prize: {
                        ...currentPrize,
                      },
                    });
                    userDispatch(
                      restore_user({
                        ...user,
                        prize: {
                          ...currentPrize,
                        },
                      })
                    );

                    /* if (prizeStatus === "active") {
                      storeData("user", {
                        ...user,
                        prize: {
                          ...currentPrize,
                        },
                      });
                      userDispatch(
                        restore_user({
                          ...user,
                          prize: {
                            ...currentPrize,
                          },
                        })
                      );
                    } else {
                      userDispatch(restore_user(user));
                    } */
                  }
                } else {
                  // el usuario no tiene premio
                  // verificar si en la app habia un algo
                  // en ese caso, expiro (premio o calavera)

                  //console.log("hasPrize es false");

                  if (user.prize != null) {
                    // si no es skull, o se cobró o expiró
                    if (user.prize.type !== "Nada") {
                      // recupero el ultimo status
                      const prize_status = user.prize.status;
                      if (prize_status === "pending") {
                        nuevaRecargaDispatch(setHayPremioCobradoModal(true));
                      } else {
                        // si no estaba pending es que expiró
                        interfaceDispatch(setShowExpiredPrize(true));
                      }
                    }
                  }

                  // en cualquier caso, eliminar lo que haya en la app
                  storeData("user", {
                    ...user,
                    prize: null,
                  });
                  // eliminar premio del estado de la app
                  // recuperar storage para estado
                  // (si esto no se hace, no funciona la el index de navegacion)
                  userDispatch(restore_user({ ...user, prize: null }));
                }
              }
            })
            .catch((err) => {
              console.log("error obteniendo info del usuario", err);
              // carga la app con la info mas reciente
              userDispatch(restore_user(user));
            });
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
