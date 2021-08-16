import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";

import Clipboard from "expo-clipboard";
import CommonNeuButton from "../../../components/CommonNeuButton";
import { NeuButton, NeuView } from "react-native-neu-element";
import { GlobalContext } from "../../../context/GlobalProvider";
import axios from "axios";
import { BASE_URL } from "../../../constants/domain";
import {
  resetNuevaRecargaState,
  setPrizeForUser,
} from "../../../context/Actions/actions";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import { getData, removeItem, storeData } from "../../../libs/asyncStorage.lib";
import { cancelNotification } from "../../../libs/expoPushNotification.lib";

const { width, height } = Dimensions.get("screen");

const CobrarPremioContent = ({ navigation, setModalVisible }) => {
  const { userState, userDispatch, nuevaRecargaDispatch } =
    React.useContext(GlobalContext);

  const currentPrize = userState.prize;

  const [codigoGenerado, setCodigoGenerado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [prizeType, setPrizeType] = useState("");

  React.useEffect(() => {
    setPrizeType(currentPrize?.type);
    //console.log(currentPrize?.type);
  }, []);

  const copyToClipboard = (code) => {
    Clipboard.setString(code);
  };

  /* const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      // saving error
      console.log(e);
    }
  }; */

  const EncriptarCodigo = (codigo) => {
    const codigoEncriptado =
      codigo.slice(0, 13) +
      "***" +
      codigo.slice(codigo.length - 3, codigo.length);

    return codigoEncriptado;
  };

  const onPressGenerarCodigo = () => {
    // setear codigo a la API
    // setear código resultante
    if (currentPrize !== null) {
      setLoading(true);

      const user_token = userState.token;
      const prize_id = currentPrize.uuid;
      const url = `${BASE_URL}/prize/exchange/${prize_id}`;
      //console.log(userState);
      //console.log(url);

      let config = {
        method: "post",
        url: url,
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      };
      axios(config)
        .then((response) => {
          if (response.status === 201) {
            const prizeResultUpdated = response.data; // exchanged true
            const prizeCode = currentPrize.uuid;

            // actualizar persistencia
            //storeData({ ...userState, prize: prizeResultUpdated });
            storeData("user", { ...userState, prize: null });

            // actualizar estado global
            userDispatch(setPrizeForUser(null));
            // para no afectar al estado de Nueva Recarga
            nuevaRecargaDispatch(resetNuevaRecargaState());

            // limpiar notificación
            cleanNotification();

            // actualizar estado local
            setCodigo(prizeCode);
            setCodigoGenerado(true);
            setLoading(false);
          } else {
            // do something
            console.log(response.status);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setCodigo("aj3d44Pk5Md***kd213");
      setCodigoGenerado(true);
    }
  };

  const cleanNotification = async () => {
    const notId = await getData("notification-prize-expire");
    cancelNotification(notId);
    removeItem(notId);
  };

  const onPressCopiar = () => {
    copyToClipboard(codigo);

    Toast.show("Código copiado al portapapeles", {
      duaration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });

    /* Toast.show("Código copiado al portapapeles", Toast.SHORT, [
      "RCTModalHostViewController"
    ]); */
    //setCodigoGenerado(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <NeuView
          style={{ marginBottom: (width / 4.4) * -1 }}
          width={width / 2.2}
          height={width / 2.2}
          color="#701c57"
          borderRadius={width / 4.4}
        ></NeuView>
        <View
          style={{
            backgroundColor: "#701c57",
            width: width / 2.2,
            height: width / 2.2,
            borderRadius: width / 4.4,
            //elevation: 0.01,
            zIndex: 2,
            position: "absolute",
            borderBottomWidth: 0,
            borderBottomColor: "#701c57",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {prizeType === "Jackpot" ? (
            <Image
              source={require("../../../assets/images/home/premios/diamanteCopia.png")}
              //resizeMode="center"
              style={{
                width: width / 5,
                height: width / 5,
              }}
            />
          ) : (
            <Image
              source={require("../../../assets/images/home/premios/capa102Copia.png")}
              //resizeMode="center"
              style={{
                width: width / 5,
                height: width / 4.5,
              }}
            />
          )}
        </View>
        <NeuView
          style={{}}
          width={width / 1.2}
          height={height / 4}
          color="#701c57"
          borderRadius={10}
        >
          <View
            style={{
              justifyContent: "space-around",
              alignItems: "center",
              height: height / 7,
              position: "absolute",
              bottom: 0,
              paddingHorizontal: width / 1.2 / 6,
            }}
          >
            <Text
              style={{
                color: "#01f9d2",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              NOMBRE PREMIO
            </Text>
            <Text
              style={{
                color: "gray",
                fontStyle: "italic",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              Texto explicativo con los detalles del premio
            </Text>
          </View>
        </NeuView>
      </View>

      <View style={{}}>
        <View style={styles.button}>
          {codigoGenerado ? (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <NeuView
                style={{}}
                width={width / 2}
                height={width / 8}
                color="#701c57"
                borderRadius={width / 8}
              >
                <Text
                  style={{
                    color: "gray",
                    fontStyle: "italic",
                    fontSize: 16,
                  }}
                >
                  {EncriptarCodigo(codigo)}
                </Text>
              </NeuView>
              <NeuButton
                color="#701c57"
                width={width / 4}
                height={width / 8}
                borderRadius={width / 8}
                onPress={() => onPressCopiar()}
              >
                <Text
                  style={{
                    color: "#01f9d2",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {" "}
                  COPIAR{" "}
                </Text>
              </NeuButton>
            </View>
          ) : (
            <CommonNeuButton
              screenWidth={width}
              text="COBRAR PREMIO"
              onPress={() => {
                setModalVisible(false);
                navigation.jumpTo("Nueva Recarga", {
                  screen: "Nueva Recarga",
                });
              }}
            />
          )}
        </View>
        <View style={styles.button}>
          {!loading ? (
            <CommonNeuButton
              screenWidth={width}
              text={codigoGenerado ? "TERMINAR" : "GENERAR CÓDIGO"}
              onPress={() => {
                codigoGenerado
                  ? setModalVisible(false)
                  : onPressGenerarCodigo();
              }}
            />
          ) : (
            <NeuButton
              color="#701c57"
              width={(4 / 5) * width}
              height={width / 7.5}
              borderRadius={width / 7.5}
              onPress={() => {}}
              inset
            >
              <ActivityIndicator size="large" color="#01f9d2" />
            </NeuButton>
          )}
        </View>
      </View>
    </View>
  );
};

export default CobrarPremioContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "rgba(112, 28, 87, .6)",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
  },
  codeModalContainer: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
  },

  codeModalContent: {
    backgroundColor: "rgba(112, 28, 87, .6)",
    padding: 22,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 17,
    marginHorizontal: 10,
    marginTop: 80,
  },
});
