import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator
} from "react-native";
import { NeuButton, NeuView } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";

import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import Toast from "react-native-simple-toast";
import axios from "axios";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import { resetNuevaRecargaState } from "../../context/Actions/actions";

const { width, height } = Dimensions.get("screen");

const RecargasDisponiblesScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);
  const { nuevaRecargaState, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { contactosSeleccionados } = nuevaRecargaState;

  const [products, setProducts] = React.useState([]);
  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [loadingContinuar, setLoadingContinuar] = React.useState(false);

  const [pressedProductId, setPressed] = React.useState(0);
  const [price_usd, setPrice_usd] = React.useState("");

  React.useEffect(() => {
    //console.log("pressedProductId", pressedProductId);
    //console.log("price_usd", price_usd);
  });

  const prize_finish_checkout = (uuid) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/finish-checkout/${uuid}`;
    let config = {
      method: "post",
      url: url,
      headers: {
        "Authorization": `Bearer ${user_token}`
      }
    };
    return axios(config);
  };

  const finish_checkout_all_prizes = () => {
    let primisesForFinish = [];
    const prizesInCheckout = contactosSeleccionados.map(
      (contacto) => contacto.prize
    );
    const prizesInCheckout_clean = prizesInCheckout.filter(
      (prize) => prize != null
    );

    if (prizesInCheckout_clean.length === 0) {
      return;
    } else {
      prizesInCheckout_clean.forEach((prize) => {
        primisesForFinish.push(prize_finish_checkout(prize.uuid));
      });

      Promise.all(primisesForFinish)
        .then(() => {
          Toast.show(
            "Los premios están libres, y podrán cobrarse en otro momento",
            Toast.LONG
          );
        })
        .catch((e) => {
          console.log(e.message);
          Toast.show("Los premios no pudieron liberarse", Toast.SHORT);
        });
    }
  };

  useAndroidBackHandler(() => {
    /*
     *   Returning `true` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */
    popUpAlert();
    return true;
  });

  const onPressBackButton = () => {
    popUpAlert();
  };

  const onPressCancelarRecarga = () => {
    //console.log(nuevaRecargaState);

    finish_checkout_all_prizes();
    nuevaRecargaDispatch(resetNuevaRecargaState());
    navigation.navigate("NuevaRecargaScreen");
  };

  const popUpAlert = () => {
    Alert.alert(
      "¿Desea cancelar?",
      "Si abandona la pantalla, se perderá el progreso de la recarga actual",
      [
        { text: "No quiero salir", style: "cancel", onPress: () => {} },
        {
          text: "Cancelar recarga",
          style: "destructive",

          onPress: () => onPressCancelarRecarga()
        }
      ]
    );
  };

  React.useEffect(() => {
    // console.log(loadingProducts);
    console.log("recargas disp screen, contactos", contactosSeleccionados);
  }, [contactosSeleccionados]);

  React.useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getProducts(source.token);

    return () => {
      source.cancel("Operation canceled by the user.");
      setLoadingProducts(false);
      setProducts([]);
    };
  }, []);

  const getProducts = (cancelToken) => {
    setLoadingProducts(true);
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/products`;

    const config = {
      method: "get",
      cancelToken,
      url,
      headers: {
        "Authorization": `Bearer ${user_token}`
      }
    };

    axios(config)
      .then((response) => {
        setProducts(response.data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingProducts(false);
      });
  };

  const create_transaction = (contacto) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/create-transaction`;
    let config;
    if (contacto.prize != null) {
      config = {
        method: "post",
        url,
        data: {
          "beneficiary": contacto.contactNumber,
          "prizeCode": contacto.prize.uuid,
          "dtoneProductId": pressedProductId
        },
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      };
    } else {
      config = {
        method: "post",
        url,
        data: {
          "beneficiary": contacto.contactNumber,
          "prizeCode": "",
          "dtoneProductId": pressedProductId
        },
        headers: {
          "Authorization": `Bearer ${user_token}`
        }
      };
    }
    console.log(config);
    return axios(config);
  };

  const onPressContinuar = () => {
    let transaction_id_array = [];
    if (pressedProductId === "") {
      Toast.show("Debe seleccionar algún producto para continuar", Toast.SHORT);
    } else {
      setLoadingContinuar(true);

      let promisesForTransaction = [];
      contactosSeleccionados.forEach((contacto) => {
        promisesForTransaction.push(create_transaction(contacto));
      });

      Promise.all(promisesForTransaction)
        .then((response) => {
          response.forEach((transaction) => {
            //console.log(transaction.data);
            console.log(transaction.data.id);
            transaction_id_array.push(transaction.data.id);
          });
          setLoadingContinuar(false);
          navigation.navigate("PrePagoScreen", {
            price_usd,
            transaction_id_array
          });
        })
        .catch((err) => {
          console.log(err.message);
          setLoadingContinuar(false);
          Toast.show("No se pudo crear la transacción", Toast.SHORT);
        });
    }
  };

  return (
    <>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => onPressBackButton()}
      />
      <View style={styles.container}>
        {loadingProducts ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ActivityIndicator size="large" color="#01f9d2" />
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.innerContainer}>
              {products.map((product, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setPressed(product.id);
                      setPrice_usd(product.price_usd);
                      console.log(product);
                    }}
                    style={{
                      width: width / 1.3,
                      height: height / 8,
                      marginBottom: 25,
                      backgroundColor:
                        pressedProductId === product.id
                          ? "rgba(0,0,0,0.1)"
                          : "rgba(0,0,0,0)"
                    }}
                    key={index}
                  >
                    <NeuView
                      color="#701c57"
                      width={width / 1.3}
                      height={height / 8}
                      borderRadius={10}
                      inset={pressedProductId === product.id ? true : false}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 0,
                          width: width / 1.3,
                          borderRadius: 10,
                          backgroundColor:
                            pressedProductId === product.id
                              ? "rgba(0,0,0,0.1)"
                              : "rgba(0,0,0,0)"
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            textTransform: "uppercase",
                            color: "#01f9d2",
                            marginBottom: 6
                          }}
                        >
                          {product.name}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "gray",
                            marginBottom: 6
                          }}
                        >
                          {`monto: ${product.amount_cup} CUP`}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "gray",
                            marginBottom: 4
                          }}
                        >
                          {`precio: ${product.price_usd} USD`}
                        </Text>
                      </View>
                    </NeuView>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
      <View
        style={{
          backgroundColor: "#701c57",
          alignItems: "center",
          justifyContent: "center",
          height: height / 7,
          elevation: 30
          // TODO: shadow on iOS
        }}
      >
        <NeuButton
          color="#701c57"
          width={(4 / 5) * width}
          height={width / 7.5}
          borderRadius={width / 7.5}
          onPress={() => onPressContinuar()}
          style={{}}
        >
          {loadingContinuar ? (
            <ActivityIndicator size="large" color="#01f9d2" />
          ) : (
            <Text
              style={{
                color: "#01f9d2",
                fontWeight: "bold",
                fontSize: 20,
                textTransform: "uppercase"
              }}
            >
              continuar
            </Text>
          )}
        </NeuButton>
      </View>
    </>
  );
};

export default RecargasDisponiblesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#701c57"
    //alignItems: "center",
    //justifyContent: "flex-start",
  },
  innerContainer: {
    backgroundColor: "#701c57",
    flex: 1,
    marginTop: 10,
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  button: {
    width: "90%",
    marginTop: 10
  }
});

/* 
 <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 1"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 2"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 3"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 4"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 5"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 6"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 7"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 8"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
*/
