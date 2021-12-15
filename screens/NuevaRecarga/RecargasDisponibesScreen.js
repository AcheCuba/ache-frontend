import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NeuButton, NeuView } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";

import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import Toast from "react-native-root-toast";
import axios from "axios";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import {
  closeSocket,
  resetNuevaRecargaState,
  setTransaccionesEsperadas,
  setTransaccionesResultado,
} from "../../context/Actions/actions";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

const RecargasDisponiblesScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);
  const { nuevaRecargaState, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { contactosSeleccionados } = nuevaRecargaState;

  const [products, setProducts] = React.useState([]);
  const [productsWithPromo, setProductsWithPromo] = React.useState([]);
  const [promoTitle, setPromoTitle] = React.useState(undefined);

  const { socketState, socketDispatch } = React.useContext(GlobalContext);
  const { socketId } = socketState;
  //console.log(socketId);

  const [loadingProducts, setLoadingProducts] = React.useState(false);
  const [loadingPromotions, setLoadingPromotions] = React.useState(false);
  const [loadingContinuar, setLoadingContinuar] = React.useState(false);

  const [pressedProductId, setPressed] = React.useState(0);
  //const [price_usd, setPrice_usd] = React.useState("");

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
        Authorization: `Bearer ${user_token}`,
      },
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
            {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            }
          );
        })
        .catch((e) => {
          console.log(e.message);
          Toast.show("Los premios no pudieron liberarse", {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
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

    socketDispatch(closeSocket());
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

          onPress: () => onPressCancelarRecarga(),
        },
      ]
    );
  };

  React.useEffect(() => {
    // console.log(loadingProducts);
    // console.log("recargas disp screen, contactos", contactosSeleccionados);
  }, [contactosSeleccionados]);

  React.useEffect(() => {
    // get products
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    getProducts(source.token);

    // get promotions
    const CancelTokenPromotions = axios.CancelToken;
    const sourceProm = CancelTokenPromotions.source();
    getPromotions(sourceProm.token);

    return () => {
      source.cancel("Operation canceled by the user.");
      setLoadingProducts(false);
      setProducts([]);
    };
  }, []);

  const getPromotions = (cancelToken) => {
    setLoadingPromotions(true);
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/promotions`;

    const config = {
      method: "get",
      cancelToken,
      url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    axios(config)
      .then((response) => {
        //setProducts(response.data);
        //console.log("Promociones");
        //console.log(response.data);
        const data = response.data;
        // console.log(data.length);
        if (data.length !== 0) {
          //console.log(response.data);
          //console.log(data[0].productsIds);
          setProductsWithPromo(data[0].productsIds);
          //console.log(data[0].title);
          setPromoTitle(data[0].title);
        }
        setLoadingPromotions(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingPromotions(false);
      });
  };

  const getProducts = (cancelToken) => {
    setLoadingProducts(true);
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/products`;

    const config = {
      method: "get",
      cancelToken,
      url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    axios(config)
      .then((response) => {
        setProducts(response.data);
        //console.log("products");
        //console.log(response.data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingProducts(false);
      });
  };

  const create_transaction = (contacto, productId) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/create-transaction`;
    console.log("socket id pasado al endpoint");
    console.log(socketId);
    let config;
    if (contacto.prize != null) {
      config = {
        method: "post",
        url,
        data: {
          beneficiary: contacto.contactNumber,
          prizeCode: contacto.prize.uuid,
          dtoneProductId: productId,
          socketId: socketId,
        },
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      };
    } else {
      config = {
        method: "post",
        url,
        data: {
          beneficiary: contacto.contactNumber,
          prizeCode: "",
          dtoneProductId: productId,
          socketId: socketId,
        },
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      };
    }
    //console.log(config);
    return axios(config);
  };

  const onPressProduct = (productId, productPriceUsd) => {
    // por cada contacto, se crea una transaccion
    // endpoint: create-transacition

    let transaction_id_array = [];
    setLoadingContinuar(true);

    let promisesForTransaction = [];
    contactosSeleccionados.forEach((contacto) => {
      promisesForTransaction.push(create_transaction(contacto, productId));
    });

    // para comunicacion socket
    let transacciones_esperadas = []; // [{mobile_number, transaction_id}, ...]
    socketDispatch(setTransaccionesResultado([]));

    Promise.all(promisesForTransaction)
      .then((response) => {
        response.forEach((transaction) => {
          //console.log(transaction.data);
          //console.log(transaction.data.id);
          transaction_id_array.push(transaction.data.id);
          transacciones_esperadas.push({
            mobile_number:
              transaction.data.credit_party_identifier.mobile_number,
            transaction_id: transaction.data.id,
          });
        });
        setLoadingContinuar(false);

        console.log(
          "esperadas en recargas disponibles screen",
          transacciones_esperadas
        );
        socketDispatch(setTransaccionesEsperadas(transacciones_esperadas));

        navigation.navigate("PrePagoScreen", {
          productPriceUsd,
          transaction_id_array,
        });
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingContinuar(false);
        Toast.show("No se pudo crear la transacción", {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      });
  };

  return (
    <>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => onPressBackButton()}
      />
      <View style={styles.container}>
        {!loadingProducts && !loadingPromotions ? (
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.innerContainer}>
              {products.map((product, index) => {
                return (
                  <NeuButton
                    onPress={() => {
                      //console.log(product);
                      setPressed(product.id); // para el loading
                      onPressProduct(product.id, product.price_usd);
                    }}
                    width={width / 1.3}
                    height={height / 6}
                    borderRadius={10}
                    color="#701c57"
                    style={{
                      marginBottom: 25,
                    }}
                    key={index}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 0,
                        width: width / 1.3,
                        height: height / 6,
                        borderRadius: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          width: width / 1.3,
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 20,
                              textTransform: "uppercase",
                              color: "#01f9d2",
                              marginBottom: 6,
                              marginTop: 5,
                            }}
                          >
                            {product.name}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 20,
                              color: "gray",
                              marginBottom: 6,
                            }}
                          >
                            {`monto: ${product.amount_cup} CUP`}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 20,
                              color: "gray",
                              marginBottom: 4,
                            }}
                          >
                            {`precio: ${product.price_usd} USD`}
                          </Text>
                          {promoTitle != undefined &&
                          productsWithPromo.includes(product.id) ? (
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                textTransform: "uppercase",
                                color: "#01f9d2",
                                marginTop: 5,
                              }}
                            >
                              {`promotion: ${promoTitle}`}
                            </Text>
                          ) : null}
                        </View>
                        <View
                          style={{
                            height: height / 8,
                            justifyContent: "center",
                          }}
                        >
                          {loadingContinuar &&
                          product.id === pressedProductId ? (
                            <ActivityIndicator size="small" color="#01f9d2" />
                          ) : (
                            <Ionicons
                              name="chevron-forward-outline"
                              size={25}
                              color="#01f9d2"
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  </NeuButton>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#01f9d2" />
          </View>
        )}
      </View>
    </>
  );
};

export default RecargasDisponiblesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#701c57",
    //alignItems: "center",
    //justifyContent: "flex-start",
  },
  innerContainer: {
    backgroundColor: "#701c57",
    flex: 1,
    marginTop: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    width: "90%",
    marginTop: 10,
  },
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
