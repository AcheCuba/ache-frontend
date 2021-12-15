import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { restore_user } from "../context/Actions/actions";
import moment from "moment";
import { getData, storeData } from "../libs/asyncStorage.lib";
import { useAssets } from "expo-asset";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const { userState, userDispatch } = React.useContext(GlobalContext);
  const [assets] = useAssets([
    require("../assets/images/home/fondoOscuro.png"),
    require("../assets/images/home/bisel.png"),
    require("../assets/images/home/casillas2.png"),
    require("../assets/images/home/fondo.png"),
    require("../assets/images/home/premios/capa102Copia.png"),
    require("../assets/images/home/premios/diamanteCopia.png"),
    require("../assets/images/home/premios/Nada2.png"),
    require("../assets/images/more/asset3.png"),
    require("../assets/images/nueva_recarga/diez.png"),
    require("../assets/images/nueva_recarga/jackpot.png"),
    require("../assets/images/nueva_recarga/Nada2.png"),
    require("../assets/images/onboarding_test/circle.png"),
    require("../assets/images/onboarding_test/square.png"),
    require("../assets/images/onboarding_test/triangle.png"),
  ]);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        let token;
        let user;

        token = await SecureStore.getItemAsync("token");
        user = await getData("user");

        //console.log(token);

        //===================== solo para eliminar premio en app ===========================

        /* storeData("user", {
          ...user,
          prize: null,
        });
        userDispatch(restore_user({ ...user, prize: null, token }));

        user = await getData("user"); */

        //===================== solo para eliminar premio en app ===========================

        //===================== solo para eliminar user ===========================
        //await AsyncStorage.removeItem("user");
        //user = await getData("user");
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
            console.log(minutos_restantes);
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
            }
          } else {
            userDispatch(restore_user({ ...user, token }));
          }
        }

        // Load fonts
        // api calls
        // etc, etc ...

        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!assets) {
    return false;
  }
  return isLoadingComplete;
}
