import React from "react";
import { ActivityIndicator, PixelRatio, TouchableOpacity } from "react-native";
import { StyleSheet, View, Dimensions } from "react-native";
import {
  buttonColor,
  generalBgColorTrans8,
} from "../../../constants/commonColors";
import { GlobalContext } from "../../../context/GlobalProvider";
import { TextBold, TextMedium } from "../../../components/CommonText";
import axios from "axios";
import { BASE_URL } from "../../../constants/domain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  resetSocketState,
  resetUserState,
  restoreNuevaRecargaInitialState,
} from "../../../context/Actions/actions";

const { width, height } = Dimensions.get("screen");

const DeleteUserContentModal = ({ navigation, setModalVisible }) => {
  const { userState, userDispatch, nuevaRecargaDispatch, socketDispatch } =
    React.useContext(GlobalContext);
  const [loading, setLoading] = React.useState(false);

  const onPressCancelar = () => {
    setModalVisible(false);
  };

  const deleteUserFromApp = async () => {
    setLoading(false);
    await AsyncStorage.removeItem("user");
    // reestablecer estado de la app
    userDispatch(resetUserState());
    nuevaRecargaDispatch(restoreNuevaRecargaInitialState());
    socketDispatch(resetSocketState());
  };

  const onPressDeleteUser = async () => {
    setLoading(true);
    // console.log("eliminar user");
    //obtener user id

    // llamada a backend
    // 200
    // eliminar usuario del app storage
    // restablecer estados de la app a estados iniciales
    // bad request
    // toast ("no se pudo")

    console.log("eliminar user: ", userState.id);
    const userId = userState.id;

    const user_token = userState.token;
    const url = `${BASE_URL}/users/${userId}`;

    // console.log(user_token);
    // console.log(url);

    let config = {
      method: "delete",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    setTimeout(() => {
      deleteUserFromApp();
    }, 2000);

    /*  axios(config)
      .then(() => {
        console.log("el usuario se eliminó correctamente de backend");
        deleteUserFromApp();
      })
      .catch((error) => {
        setLoading(false);
        Toast.show(error.message, {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }); */
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: generalBgColorTrans8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <TextMedium
          style={{
            color: "#fffc00",
            fontStyle: "italic",
            fontSize: 25 / PixelRatio.getFontScale(),
            marginTop: 30,
            textAlign: "center",
          }}
          text={
            userState.idioma === "spa"
              ? "¿Está seguro de que desea borrar su cuenta?"
              : "Are you sure you want to delete your account?"
          }
        />
      </View>
      <View
        style={{
          // flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 30,
          // width: width / 1.4,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onPressDeleteUser()}
          disabled={loading}
          style={{
            backgroundColor: buttonColor,
            borderRadius: width / 7.5,
            width: (3.6 / 5) * width,
            height: height / 16,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff800" />
          ) : (
            <TextBold
              text={
                userState.idioma === "spa" ? "ELIMINAR USUARIO" : "DELETE USER"
              }
              style={{
                color: "#fff800",
                //fontWeight: "bold",
                fontSize: 23 / PixelRatio.getFontScale(),
                textTransform: "uppercase",
              }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => onPressCancelar()}
          style={{
            backgroundColor: buttonColor,
            borderRadius: width / 7.5,
            width: (3.6 / 5) * width,
            height: height / 16,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TextBold
            text={userState.idioma === "spa" ? "CANCELAR" : "CANCEL"}
            style={{
              color: "#fff800",
              //fontWeight: "bold",
              fontSize: 23 / PixelRatio.getFontScale(),
              textTransform: "uppercase",
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeleteUserContentModal;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    alignItems: "center",
    backgroundColor: "gray",
  },
});
