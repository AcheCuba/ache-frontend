import * as React from "react";
import {
  ScrollView,
  StyleSheet,
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
  resetNuevaRecargaState,
  setTransaccionesEsperadas,
  setTransaccionesResultado,
} from "../../context/Actions/actions";
import { TextBold, TextMedium } from "../../components/CommonText";
import { ImageBackground } from "react-native";
import { Image } from "react-native";

const { width, height } = Dimensions.get("screen");

const RecargasDisponiblesScreen = ({ navigation, route }) => {
  //const { esDirecta } = route?.params;

  const { userState } = React.useContext(GlobalContext);
  const { nuevaRecargaState, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);
  const { contactosSeleccionados, validated_prizes } = nuevaRecargaState;

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

  /* React.useEffect(() => {
    //console.log("pressedProductId", pressedProductId);
    //console.log("price_usd", price_usd);
    //console.log(esDirecta);
    //console.log("rec disp", validated_prizes);
  }); */

  const prize_finish_checkout = (uuid) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/finish-checkout/${uuid}`;
    let config = {
      method: "post",
      url: url,
      params: { success: false }, // el premio no se ha cobrado
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    return axios(config);
  };

  const finish_checkout_all_prizes = () => {
    //console.log("finish checkout recargas disponibles screen");
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
          //console.log(e.message);
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

    //socketDispatch(closeSocket());

    finish_checkout_all_prizes();
    nuevaRecargaDispatch(resetNuevaRecargaState());
    navigation.navigate("NuevaRecargaScreen");
  };

  const popUpAlert = () => {
    Alert.alert(
      "¿Desea salir?",
      "Si abandona la pantalla, se perderá el progreso de la recarga actual",
      [
        { text: "Atrás", style: "cancel", onPress: () => {} },
        {
          text: "Salir",
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
        //console.log(err.message);
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
        //console.log(err.message);
        /* if (err.response) {
          console.log(err.response.message);
        } */

        setLoadingProducts(false);
      });
  };

  const create_transaction = (contacto, productId) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/create-transaction`;
    //console.log("socket id pasado al endpoint", socketId);

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
      //console.log("contacto", contacto);
      //console.log("productId", productId);
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
        response.forEach((transactions_array) => {
          const _transactions_array = transactions_array.data;

          // se recibe un arreglo que puede tener 2 transaccios (para caso de premio de 500)
          _transactions_array.map((transaction) => {
            //console.log("transaction id", transaction.id);
            transaction_id_array.push(transaction.id);
            transacciones_esperadas.push({
              mobile_number: transaction.credit_party_identifier.mobile_number,
              transaction_id: transaction.id,
            });
          });
        });
        setLoadingContinuar(false);

        /* console.log(
          "esperadas en recargas disponibles screen",
          transacciones_esperadas
        ); */
        socketDispatch(setTransaccionesEsperadas(transacciones_esperadas));

        navigation.navigate("PrePagoScreen", {
          productPriceUsd,
          transaction_id_array,
        });
      })
      .catch((err) => {
        if (err.response) {
          const err_data = err.response.data;
          //const err_headers = err.response.headers;
          console.log(err_data);
          //console.log(err_headers);
        }

        if (err.request) {
          console.log("Error");

          //console.log(err.request);
        }

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

  /*  const onPressProduct = (productId, productPriceUsd) => {
    // por cada contacto, se crea una transaccion
    // endpoint: create-transacition

    let transaction_id_array = [];
    setLoadingContinuar(true);

     let promisesForTransaction = [];
    contactosSeleccionados.forEach((contacto) => {
      promisesForTransaction.push(create_transaction(contacto, productId));
    }); 

    const contacto = contactosSeleccionados[0];

    // para comunicacion socket
    let transacciones_esperadas = []; // [{mobile_number, transaction_id}, ...]
    socketDispatch(setTransaccionesResultado([]));

    create_transaction(contacto, productId)
      .then((response) => {
        response.forEach((transactions_array) => {
          const _transactions_array = transactions_array.data;

          // se recibe un arreglo que puede tener 2 transaccios (para caso de premio de 500)
          _transactions_array.map((transaction) => {
            //console.log("transaction id", transaction.id);
            transaction_id_array.push(transaction.id);
            transacciones_esperadas.push({
              mobile_number: transaction.credit_party_identifier.mobile_number,
              transaction_id: transaction.id,
            });
          });
        });

        setLoadingContinuar(false);

        console.log(
          "esperadas en recargas disponibles screen",
          transacciones_esperadas
        );
        socketDispatch(setTransaccionesEsperadas(transacciones_esperadas));

        // abrir nuevo socket
        socketDispatch(openSocket());

        navigation.navigate("PrePagoScreen", {
          productPriceUsd,
          transaction_id_array,
        });
      })
      .catch((err) => {
        if (err.response) {
          const err_data = err.response.data;
          //const err_headers = err.response.headers;

          console.log(err_data);
          //console.log(err_headers);
        }

        if (err.request) {
          //console.log(err.request);
        }

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
  }; */

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: "center",
      }}
      transition={false}
    >
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => onPressBackButton()}
      />
      {/*       <View style={styles.container}>
       */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <TextBold
          text="Ofertas Disponibles"
          style={{
            fontSize: 30,
            color: "#fffb00",
            textTransform: "uppercase",
          }}
        />
      </View>
      {!loadingProducts && !loadingPromotions ? (
        <View
          style={{
            //flex: 1,
            marginTop: 10,
            alignItems: "center",
            width: width,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              width: width,
              //flex: 1,
              alignItems: "center",
            }}
          >
            {products.map((product, index) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    padding: 5,
                    flex: 1,
                  }}
                  key={index}
                >
                  <NeuButton
                    onPress={() => {
                      //console.log(product);
                      setPressed(product.id); // para el loading
                      onPressProduct(product.id, product.price_usd);
                    }}
                    width={width / 1.3}
                    height={height / 5}
                    borderRadius={10}
                    color="#701c57"
                    style={{
                      marginBottom: 25,
                    }}
                    //key={index}
                    containerStyle={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        width: width / 1.3,
                        padding: 20,
                      }}
                    >
                      <View>
                        <TextBold
                          text={product.name}
                          style={{
                            fontSize: 24,
                            textTransform: "uppercase",
                            color: "#fffb00",
                            marginBottom: 6,
                            marginTop: 5,
                          }}
                        />

                        <TextMedium
                          text={`monto: ${product.amount_cup} CUP`}
                          style={{
                            fontSize: 20,
                            color: "rgba(255,255,255,0.6)",
                            marginBottom: 6,
                            textTransform: "uppercase",
                          }}
                        />

                        <TextMedium
                          text={`precio: ${product.price_usd} USD`}
                          style={{
                            fontSize: 20,
                            color: "rgba(255,255,255,0.6)",
                            marginBottom: 6,
                            textTransform: "uppercase",
                          }}
                        />

                        {promoTitle != undefined &&
                        productsWithPromo.includes(product.id) ? (
                          <TextBold
                            text={`promotion: ${promoTitle}`}
                            style={{
                              fontSize: 16,
                              color: "#fffb00",
                              marginTop: 5,
                              textTransform: "uppercase",
                            }}
                          />
                        ) : null}
                      </View>
                      <View
                        style={{
                          height: height / 8,
                          justifyContent: "center",
                        }}
                      >
                        {loadingContinuar && product.id === pressedProductId ? (
                          <ActivityIndicator size="small" color="#fffb00" />
                        ) : (
                          /*     <Ionicons
                            name="chevron-forward-outline"
                            size={25}
                            color="#fffb00"
                          /> */

                          <Image
                            source={require("../../assets/images/iconos/atras.png")}
                            style={{
                              width: 15,
                              height: 15,
                              transform: [{ rotate: "180deg" }],
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </NeuButton>
                </View>
              );
            })}
          </ScrollView>
        </View>
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
    </ImageBackground>
  );
};

export default RecargasDisponiblesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#701c57",
    //alignItems: "center",
    //justifyContent: "flex-start",
  },
  innerContainer: {
    //backgroundColor: "#701c57",
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
