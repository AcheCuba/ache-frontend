import React, { useContext, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { GlobalContext } from "../../context/GlobalProvider";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";

const frontend_url = "https://react-paymentsite.herokuapp.com/";

// antes
// `${server_url}/api/payments/mobile/create?amount=${input.amount}&name=${input.name}&email=${input.email}`,

// ngrok
// const server_url = "http://48e33416ac70.ngrok.io";

const PagoScreen = ({ navigation, route }) => {
  const [srceen, setScreen] = React.useState("payment");
  const [loading, setLoading] = React.useState(true);
  const [initUrl, setinitUrl] = React.useState(frontend_url);
  const [url, setUrl] = React.useState(frontend_url + "payment-init");

  console.log(url);
  const amount = route.params?.amount;

  const { userState } = React.useContext(GlobalContext);
  const { name, email } = userState;

  const createPaymentSession = async () => {
    const input = {
      amount: amount,
      name: name,
      email: email,
    };

    const user_token = userState.token;
    const _url = `${BASE_URL}/payments/create-payment`;

    console.log(url);

    let config = {
      method: "post",
      url: _url,
      data: {
        amount: input.amount,
        name: input.name,
        email: input.email,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    console.log(config);

    axios(config)
      .then((response) => {
        console.log(response);
        const sessionID = response;
        setUrl(initUrl + "payment?session=" + sessionID.id);
        setLoading(false);
      })
      .catch((e) => console.log(e.message));

    /*    fetch(
      `${BASE_URL}/payments/create-payment?amount=${input.amount}&name=${input.name}&email=${input.email}`,
      { method: "POST" }
    )
      .then((result) => {
        result.json().then((session_data) => {
          const sessionID = JSON.parse(session_data.body);
          setUrl(initUrl + "payment?session=" + sessionID.id);
          setLoading(false);
        });
      })
      .catch((err) => console.log(err.message)); */
  };

  const _onNavigationStateChange = (webViewState) => {
    if (webViewState.url === initUrl + "payment-init") {
      createPaymentSession();
    }

    if (webViewState.url === initUrl + "payment-success") {
      navigation.navigate("PagoCompletadoScreen");
    }

    if (webViewState.url === initUrl + "payment-failure") {
      //navigation.navigate("PagoFallidoScreen")
      // no existe aun
    }
  };

  //casos
  //- start payment -> webview

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2 }}>
        {loading && (
          <View style={[styles.loader, styles.horizontal]}>
            <ActivityIndicator animating={true} size="large" color="#701c57" />
          </View>
        )}
        <View
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            height: 70,
            width: Dimensions.get("window").width,
            zIndex: 200,
          }}
        />
        <WebView
          mixedContentMode="never"
          source={{
            uri: url,
          }}
          onNavigationStateChange={_onNavigationStateChange}
        />
      </View>
    </View>
  );
};

export default memo(PagoScreen);

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
