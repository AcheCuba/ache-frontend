import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { GlobalContext } from "../context/GlobalProvider";
import { restore_user, set_prize } from "../context/Actions/actions";
import moment from "moment";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const { userState, userDispatch } = React.useContext(GlobalContext);

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        let token;
        let user;

        token = await SecureStore.getItemAsync("token");
        user = await getData("user");
        //console.log(user);
        if (token != null && user.id != undefined) {
          if (user.prize !== null && user.prize.exchanged === false) {
            const currentPrizeState = user.prize;

            const currentTime = moment();
            const prizeEndTime = moment(currentPrizeState.prizeEndTime);
            const minutos_restantes = prizeEndTime.diff(currentTime, "minutes");
            console.log(minutos_restantes);
            if (minutos_restantes < 0) {
              // premio expirado
              storeData({
                ...user,
                prize: null
              });
              userDispatch(restore_user({ ...user, prize: null, token }));
            } else {
              storeData({
                ...user,
                prize: {
                  ...currentPrizeState,
                  minutos_restantes
                }
              });
              userDispatch(
                restore_user({
                  ...user,
                  prize: {
                    ...currentPrizeState,
                    minutos_restantes
                  },
                  token
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
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf")
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

  return isLoadingComplete;
}
