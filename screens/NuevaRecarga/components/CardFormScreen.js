import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { PaymentsStripe as Stripe } from "expo-payments-stripe";
import axios from "axios";
import CardButton from "./CardButton";

export default class CardFormScreen extends PureComponent {
  static title = "Card Form";

  state = {
    loading: false,
    token: null,
  };

  componentDidMount() {
    Stripe.setOptionsAsync({
      publishableKey:
        "pk_test_51IlpAKGXwjeEInzC7WJaPODCcCQhaYgngfus40GZKRcs8MWkd1PNcnXju2Q28XA5PWD0Vi4xiKOi7BjaPS6MUar900oBNocxZp",
      androidPayMode: "test", // [optional] used to set wallet environment (AndroidPay)
      merchantId: "your_merchant_id", // [optional] used for payments with ApplePay
    });
  }

  handleCardPayPress = async () => {
    console.log("button pressed");
    try {
      this.setState({ loading: true, token: null });
      const options = {
        requiredBillingAddressFields: "full",
        prefilledInformation: {
          billingAddress: {
            name: "Test Name",
            line1: "Test Line 1",
            line2: "4",
            city: "Test City",
            state: "Test State",
            country: "Test Country",
            postalCode: "31217",
          },
        },
      };

      const token = await Stripe.paymentRequestWithCardFormAsync(options);
      this.setState({ loading: false, token });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  makePayment = async () => {
    this.setState({ loading: true });
    console.log("algo");
    axios({
      method: "POST",
      url: `http://192.168.43.44:4000/api/payments/mobile/create?total=AMOUNT_TO_PAY&token=${this.state.token.tokenId}}`,
    })
      .then((response) => {
        const { onSuccess } = this.props;
        onSuccess();

        // YEY! PAYMENT DONE
        // CHECKOUT YOUR STRIPE DASHBOARD FOR PAYMENTS MADE
      })
      .catch((error) => {
        this.setState({ loading: false, token: null });
        console.log(error);
      });
  };

  render() {
    const { loading, token } = this.state;
    console.log("asdasd");
    return (
      <View style={styles.container}>
        <CardButton
          text="Enter you card and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
          //   {...testID('cardFormButton')}
        />
        <View style={styles.token}>
          {token && (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
              }}
            >
              <Text style={styles.instruction}>Token: {token.tokenId}</Text>
              <CardButton
                text="Make Payment"
                loading={loading}
                onPress={this.makePayment}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instruction: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
    padding: 5,
  },
  token: {},
});
