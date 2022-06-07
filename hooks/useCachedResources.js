import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { restore_user } from "../context/Actions/actions";
import moment from "moment";
import { getData, storeData } from "../libs/asyncStorage.lib";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";

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

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //SplashScreen.show();
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
            }
          } else {
            userDispatch(restore_user({ ...user, token }));
          }
        }

        // Load fonts
        // api calls
        // etc, etc ...
        //console.log("async loading");
        /*  await Font.loadAsync({
          //...Ionicons.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
          "bs-medium": require("../assets/fonts/BloggerSans-Medium.ttf"),
          "bs-bold": require("../assets/fonts/BloggerSans-Bold.ttf"),
          "bs-italic": require("../assets/fonts/BloggerSans-MediumItalic.ttf"),
          //"bs-light": require("../assets/fonts/BloggerSans-Light.otf"),
        }); */
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        //console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!assets || !loaded) {
    return false;
  }
  return isLoadingComplete;
}
