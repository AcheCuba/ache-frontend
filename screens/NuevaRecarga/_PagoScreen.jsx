import React, { useContext } from "react";
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

//import Amplify, { API, graphqlOperation, Analytics } from "aws-amplify";
//import * as mutations from "./src/graphql/mutations";
//import { withAuthenticator } from "aws-amplify-react-native";
//import config from "./aws-exports";

//Amplify.configure(config);
//Analytics.disable();
const base_url = "https://react-paymentsite.herokuapp.com/";
const { manifest } = Constants;
//const _server_uri = `http://${manifest.debuggerHost.split(":").shift()}:4000`;

//ngrok
const server_url = "http://48e33416ac70.ngrok.io";

class _PagoScreen extends React.Component {
  /* nuevaRecargaState = useContext(GlobalContext);
  contactosSeleccionados = nuevaRecargaState.contactosSeleccionados;
  quantity = contactosSeleccionados.length; */

  state = {
    amount: 20,
    quantity: "0",
    screen: "product",
    initUrl: base_url,
    url: base_url + "payment-init",
    loading: true,
  };

  async createPaymentSession() {
    console.log("server_url", server_url);
    // hardcode input values, make these dynamic with the values from the logged in user
    const input = {
      amount: this.state.amount * this.state.quantity,
      name: "ramon",
      email: "ramon@ramon.nl",
    };

    /*    fetch(`${server_url}/api`)
      .then((result) => {
        //console.log(JSON.stringify(result));
        result.json().then((data) => {
          console.log(data);
        });
      })
      .catch((err) => console.log(err.message));*/
    fetch(
      `${server_url}/api/payments/mobile/create?amount=${input.amount}&name=${input.name}&email=${input.email}`,
      { method: "POST" }
    )
      .then((result) => {
        result.json().then((session_data) => {
          // console.log(session_data.body);
          const sessionID = JSON.parse(session_data.body);
          // console.log("id", sessionID.id);
          this.setState({
            url: this.state.initUrl + "payment?session=" + sessionID.id,
            loading: false,
          });
        });
        // const sessionID = JSON.parse(result.data.createPayment.body);
        // console.log("ok");
      })
      .catch((err) => console.log(err.message));
  }

  handleOrder() {
    this.setState({ screen: "payment" });
  }

  _onNavigationStateChange(webViewState) {
    console.log("webViewState.url", webViewState.url);
    if (webViewState.url === this.state.initUrl + "payment-init") {
      //console.log("webViewState.url", webViewState.url);
      this.createPaymentSession();
    }

    if (webViewState.url === this.state.initUrl + "payment-success") {
      //this.setState({ screen: "success" });
      const { navigation } = this.props;
      navigation.navigate("PagoCompletadoScreen");
      //console.log("success");
    }

    if (webViewState.url === this.state.initUrl + "payment-failure") {
      this.setState({ screen: "failure" });
    }
  }

  startPayment() {
    const loader = this.state.loading;
    let url = this.state.url;
    //let url = "http://10.0.2.2:3000/payment-init";
    //console.log("payment url", url);
    if (url === "") {
      url = this.state.initUrl;
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 2 }}>
          {loader && (
            <View style={[styles.loader, styles.horizontal]}>
              <ActivityIndicator
                animating={true}
                size="large"
                color="#de62bf"
              />
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
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          />
        </View>
      </View>
    );
  }

  showProduct() {
    return (
      <View style={styles.container}>
        <Text style={styles.product}>Product A</Text>
        <Text style={styles.text}>
          This is a great product which we sell to you
        </Text>
        <Text style={styles.text}>
          The price for today is € {this.state.amount},- per item
        </Text>
        <Text style={styles.quantity}>How many items do you want to buy?</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({ quantity: text })}
            value={this.state.quantity}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.handleOrder()}
          >
            <Text>Order now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    console.log("render", this.state.url);
    switch (this.state.screen) {
      case "product":
        return this.showProduct();
      case "payment":
        return this.startPayment();
      case "success":
        return (
          <View style={styles.container}>
            <Text style={{ fontSize: 25 }}>Payments Succeeded :)</Text>
          </View>
        );
      case "failure":
        return (
          <View style={styles.container}>
            <Text style={{ fontSize: 25 }}>Payments failed :(</Text>
          </View>
        );
      default:
        break;
    }
  }
}

export default _PagoScreen;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  textInput: {
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    padding: 15,
  },
  quantity: {
    marginTop: 50,
    fontSize: 17,
    marginBottom: 10,
  },
  text: {
    fontSize: 17,
    marginBottom: 10,
  },
  product: {
    fontSize: 22,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 40,
    margin: 10,
  },
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
