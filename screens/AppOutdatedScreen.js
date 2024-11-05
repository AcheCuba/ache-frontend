import * as React from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  Platform,
  StyleSheet,
} from "react-native";
import { GlobalContext } from "../context/GlobalProvider";

//  StackScreenProps<RootStackParamList, 'NotFound'>
export default function AppOutdatedScreen() {
  // console.log(storeLinkAndroid);
  const { userState } = React.useContext(GlobalContext);
  const { interfaceState } = React.useContext(GlobalContext);

  const { androidLinkUpdate } = interfaceState;
  const { iosLinkUpdate } = interfaceState;

  React.useEffect(() => {
    // console.log(userState);
    console.log(iosLinkUpdate);
    console.log(androidLinkUpdate);
    sacarAlerta();
  }, []);

  const sacarAlerta = () => {
    Alert.alert(
      "",
      userState?.idioma === "spa"
        ? "Debe actualizar continuar usando la aplicación"
        : "You must update to continue using the application",
      [
        {
          text:
            userState?.idioma === "spa"
              ? "Actualizar la app"
              : "Update your app",
          style: "default",
          onPress: () => {
            const storeUrl =
              Platform.OS === "ios" ? iosLinkUpdate : androidLinkUpdate;
            Linking.openURL(storeUrl);
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/first_screen_splash.png")}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
