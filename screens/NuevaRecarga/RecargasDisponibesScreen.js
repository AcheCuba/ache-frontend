import * as React from "react";
import {
  ScrollView,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import NeuButton from "../../libs/neu_element/NeuButton";
import { BASE_URL } from "../../constants/domain";
import { GlobalContext } from "../../context/GlobalProvider";
import Toast from "react-native-root-toast";
import axios from "axios";
import { useAndroidBackHandler } from "react-navigation-backhandler";
import {
  resetNuevaRecargaState,
  setTransaccionesNormalesConfirmadas,
  setTransaccionesNormalesEsperadas,
  setTransaccionesNormalesResultado,
  setTransaccionesPremioConfirmadas,
  setTransaccionesPremioEsperadas,
  setTransaccionesPremioResultado,
  setTransactionsIdArray,
} from "../../context/Actions/actions";
import { TextBold, TextMedium } from "../../components/CommonText";
import { ImageBackground } from "react-native";
import { Image } from "react-native";
import { getNetworkState } from "../../libs/networkState.lib";
import {
  NuevaRecargaTextEnglish,
  NuevaRecargaTextSpanish,
} from "../../constants/Texts";
import { Audio } from "expo-av";
import { buttonColor, generalBgColor } from "../../constants/commonColors";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const RecargasDisponiblesScreen = ({ navigation, route }) => {
  const { userState } = React.useContext(GlobalContext);

  const countryIsoCode = userState?.country;
  const operatorId = userState?.operator.id;

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
  const [soundError, setSoundError] = React.useState();

  //const [price_usd, setPrice_usd] = React.useState("");

  React.useEffect(() => {
    //console.log("pressedProductId", pressedProductId);
    //console.log("price_usd", price_usd);
    //console.log(esDirecta);
    //console.log("validated prizes rec disp", validated_prizes);
    console.log("CONTACTOS SELECCIONADOS", contactosSeleccionados);
  }, [contactosSeleccionados]);

  React.useEffect(() => {
    return soundError
      ? () => {
          //console.log("Unloading Sound");
          soundError.unloadAsync();
        }
      : undefined;
  }, [soundError]);

  async function playSoundError() {
    //console.log("Loading Sound");

    const _sound = new Audio.Sound();
    await _sound.loadAsync(require("../../assets/Sonidos/error.wav"), {
      shouldPlay: true,
    });
    await _sound.setPositionAsync(0);

    try {
      await _sound.playAsync();
    } catch (e) {
      //console.error(e);
      setSoundError(_sound);
    }
  }

  const ResolveText = (site) => {
    const idioma = userState?.idioma;
    const textSpa = NuevaRecargaTextSpanish();
    const textEng = NuevaRecargaTextEnglish();

    if (idioma === "spa") {
      return textSpa[site];
    }

    if (idioma === "eng") {
      return textEng[site];
    }
  };

  const getlocalCurrency = (countryIsoCode) => {
    switch (countryIsoCode) {
      case "CUB":
        return "CUP";
      case "MEX":
        return "MXN";
      case "DOM":
        return "DOP";
      default:
        return null;
    }
  };

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
            userState?.idioma === "spa"
              ? "Recarga cancelada, podrás cobrar tu premio en otro momento"
              : "Recharge aborted, you can collect your prize at a later time.",

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
          Toast.show(
            userState?.idioma === "spa"
              ? "Error al finalizar el checkout del premio"
              : "Error at prize checkout",
            {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            }
          );
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
    finish_checkout_all_prizes();
    nuevaRecargaDispatch(resetNuevaRecargaState());
    navigation.navigate("NuevaRecargaScreen");
  };

  const popUpAlert = () => {
    Alert.alert(
      userState?.idioma === "spa"
        ? "¿Desea abandonar la recarga?"
        : "Do you want to exit?",
      userState?.idioma === "spa"
        ? "Si abandona la pantalla, se perderá el progreso de la recarga actual"
        : "If you leave the screen, the progress of the current recharge will be lost",

      [
        {
          text: userState?.idioma === "spa" ? "Cancelar" : "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: userState?.idioma === "spa" ? "Abortar" : "Abort",
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
      params: {
        countryIsoCode,
        operatorId,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    axios(config)
      .then((response) => {
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

  const getProducts = async (cancelToken) => {
    setLoadingProducts(true);
    const networkState = await getNetworkState();
    if (!networkState.isConnected || !networkState.isInternetReachable) {
      setTimeout(() => {
        let toast = Toast.show(ResolveText("errorConexion"), {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setLoadingProducts(false);
        playSoundError();
        onPressCancelarRecarga();
      }, 1500);
    } else {
      const user_token = userState.token;
      const url = `${BASE_URL}/topup/products`;

      const config = {
        method: "get",
        cancelToken,
        url,
        params: {
          countryIsoCode,
          operatorId,
        },
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
          playSoundError();
          setLoadingProducts(false);
          Toast.show(ResolveText("errorDesconocido"), {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          onPressCancelarRecarga();
        });
    }
  };

  const create_transaction = async (contacto, productId) => {
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/create-transaction`;
    //console.log("socket id pasado al endpoint", socketId);

    let config;

    config = {
      method: "post",
      url,
      data: {
        beneficiary: contacto.contactNumber,
        //prizeCode: "",
        dtoneProductId: productId,
        socketId: socketId,
        countryIsoCode,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    /*     if (contacto.prize != null) {
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
    } else { */
    //console.log("contacto", contacto);
    //console.log("productId", productId);

    return axios(config);
  };
  const onPressProduct = async (
    productId,
    productPriceUsd,
    productDescription
  ) => {
    // por cada contacto, se crea una transaccion
    // endpoint: create-transacition

    let transaction_id_array = [];
    setLoadingContinuar(true);

    const networkState = await getNetworkState();
    if (!networkState.isConnected || !networkState.isInternetReachable) {
      Toast.show(ResolveText("errorConexion"), {
        duaration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
      playSoundError();
      onPressCancelarRecarga();
    } else {
      // para comunicacion socket
      let transacciones_normales_esperadas = []; // [{mobile_number, transaction_id}, ...]
      let transacciones_premio_esperadas = [];

      socketDispatch(setTransaccionesNormalesResultado([]));
      socketDispatch(setTransaccionesPremioResultado([]));

      let contador_contactos = 0;
      let transaction_error = false;

      let promisesForTransaction = [];
      contactosSeleccionados.forEach((contacto) => {
        promisesForTransaction.push(create_transaction(contacto, productId));
        // promisesForTransaction.push(create_transaction(contacto, "123")); //provocar error
      });

      for (const promise of promisesForTransaction) {
        await promise
          .then((response) => {
            const transaction_data = response.data;
            //console.log(transaction_data);

            // test - bad request
            // const transaction_data = response.data.lol;

            // update 3 de mayo, 2023
            // se mandan las transacciones normales aqui
            // se recibe un object

            transaction_id_array.push({
              topUpId: transaction_data.id,
              //prizeId: undefined, //transactionId
              dtoneProductId: productId,
              beneficiary:
                contactosSeleccionados[contador_contactos].contactNumber,
              socketId: socketId,
              prize_uuid:
                contactosSeleccionados[contador_contactos].prize != null
                  ? contactosSeleccionados[contador_contactos].prize.uuid
                  : undefined,
            });

            // normales esperadas
            transacciones_normales_esperadas.push({
              mobile_number:
                transaction_data.credit_party_identifier.mobile_number,
              transaction_id: transaction_data.id,
            });

            if (contactosSeleccionados[contador_contactos].prize != null) {
              transacciones_premio_esperadas.push(1); //solo uso la cantidad
            }

            contador_contactos += 1;
          })
          .catch((err) => {
            /*  if (err.response) {
         const err_data = err.response.data;
         console.log(err_data);
       }

       if (err.request) {
         //console.log("Error");
       } */

            playSoundError();
            setLoadingContinuar(false);
            Toast.show(
              userState?.idioma === "spa"
                ? "No se pudo crear la transacción"
                : "Transaction could not be created",
              {
                duaration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              }
            );

            transaction_error = true;
          });
      }
      if (transaction_error) {
        //console.log("entra en return");
        setTimeout(() => {
          onPressCancelarRecarga();
        }, 1000);

        return;
      } else {
        setLoadingContinuar(false);

        socketDispatch(
          setTransaccionesNormalesEsperadas(transacciones_normales_esperadas)
        );
        socketDispatch(
          setTransaccionesPremioEsperadas(transacciones_premio_esperadas)
        );

        nuevaRecargaDispatch(setTransaccionesNormalesConfirmadas([]));
        nuevaRecargaDispatch(setTransaccionesPremioConfirmadas([]));
        nuevaRecargaDispatch(setTransactionsIdArray(transaction_id_array));

        navigation.navigate("PrePagoScreen", {
          productPriceUsd,
          productDescription,
          transaction_id_array,
        });
      }
    }
  };

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
      <View
        style={{
          paddingTop: 50,
          width: width,
          height: height / 6,
          backgroundColor: generalBgColor,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <NeuButton
          color={buttonColor}
          width={width / 7}
          height={width / 7 - 20}
          borderRadius={5}
          onPress={() => onPressBackButton()}
          style={{ marginLeft: marginGlobal, marginTop: 10 }}
        >
          <Image
            source={require("../../assets/images/iconos/equis.png")}
            style={{ width: 16, height: 16 }}
          />
        </NeuButton>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <TextBold
          text={ResolveText("ofertas")}
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
            paddingBottom: 30 + height / 5, // box height,
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
              const product_price_usd = parseFloat(product.price_usd).toFixed(
                2
              );

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
                      onPressProduct(
                        product.id,
                        product.price_usd,
                        product.product_description
                      );
                    }}
                    width={width / 1.3}
                    height={height / 5}
                    borderRadius={10}
                    color={buttonColor}
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
                          text={product.product_title}
                          style={{
                            fontSize: 24,
                            textTransform: "uppercase",
                            color: "#fffb00",
                            marginBottom: 6,
                            marginTop: 5,
                          }}
                        />

                        <TextMedium
                          text={`${ResolveText(
                            "precio"
                          )}: ${product_price_usd} USD`}
                          style={{
                            fontSize: 20,
                            color: "rgba(255,255,255,0.6)",
                            marginBottom: 6,
                            textTransform: "uppercase",
                          }}
                        />

                        <TextMedium
                          text={`DESC: ${product.product_description}`}
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
