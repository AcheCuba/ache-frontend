import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  PixelRatio,
} from "react-native";

import NuevoContactoInput from "./components/NuevoContactoInput";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  updatePrizeForContact,
  deletePrizeByFieldId,
  setFields,
  setPrize,
  toggleValidateInProcess,
  toogleAddContactAvaiable,
  updatePrize,
  openSocket,
  setCountryForUser,
  setOperatorForUser,
  resetNuevaRecargaState,
} from "../../context/Actions/actions";
import CodigoRecargaModal from "./components/CodigoRecargaModal";
import Toast from "react-native-root-toast";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold } from "../../components/CommonText";
import {
  NuevaRecargaTextEnglish,
  NuevaRecargaTextSpanish,
} from "../../constants/Texts";
import CountryMenuModal from "./components/CountryMenuModal";
import { storeData } from "../../libs/asyncStorage.lib";
import ProviderMenuModal from "./components/ProviderMenuModal";
import { buttonColor } from "../../constants/commonColors";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

function makeid(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const NuevaRecargaScreen = ({ navigation, route }) => {
  const inOrderToCobrarPremio = route.params?.inOrderToCobrarPremio;
  //console.log("inOrderToCobrarPremio", inOrderToCobrarPremio);

  const { nuevaRecargaDispatch, nuevaRecargaState } = useContext(GlobalContext);
  const {
    addContactAvaiable,
    contactosSeleccionados,
    validated_prizes,
    fields,
    validatetInProcess,
  } = nuevaRecargaState;
  const { userState, userDispatch } = React.useContext(GlobalContext);

  const userCountry = userState?.country;

  const { socketState, socketDispatch } = React.useContext(GlobalContext);

  const [loadingContinuar, setLoadingContinuar] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [fieldIdMatched, setFieldIdMatched] = React.useState("");
  const [animacionPremioNoValido, setAnimacionPremioNoValido] = React.useState({
    fieldId: undefined,
    valid: true,
  });

  const [countryMenuVisible, setCountryMenuVisible] = React.useState(false);
  const [providerMenuVisible, setProviderMenuVisible] = React.useState(false);
  const [loadingProviders, setLoadingProviders] = React.useState(false);
  const [providerList, setProviderList] = React.useState([]);

  /* useEffect(() => {
    console.log(contactosSeleccionados);
  }, [contactosSeleccionados]); */

  useEffect(() => {
    setLoadingProviders(true);
    getOperators(userState?.country);
    // console.log(userState.country);
  }, [userState]);

  useFocusEffect(
    React.useCallback(() => {
      //console.log("inOrder on focus", inOrderToCobrarPremio);

      // cuando no hay ningun contacto agregado
      if (contactosSeleccionados.length === 0 && fields.length === 0) {
        const firstFieldId = makeid(15);

        //console.log("no hay contacto agregado");

        // set first field
        nuevaRecargaDispatch(setFields(true, firstFieldId));

        // cuando el usuario viene a cobrar premio
        if (inOrderToCobrarPremio === true) {
          const type = userState.prize.type;
          const uuid = userState.prize.uuid;
          const fieldId = firstFieldId;

          nuevaRecargaDispatch(
            setPrize({ fieldId, uuid, type, loading: true })
          );

          validate_prize(uuid)
            .then(() => {
              nuevaRecargaDispatch(
                updatePrize(uuid, {
                  fieldId,
                  uuid,
                  type,
                  loading: false,
                })
              );
              nuevaRecargaDispatch(toggleValidateInProcess(false));
            })
            .catch((err) => {
              console.log(err.message);
              nuevaRecargaDispatch(deletePrizeByFieldId(fieldId));
              nuevaRecargaDispatch(toggleValidateInProcess(false));
            });
        }
      } else {
        // cuando no se trata del primer slot
        // cuando el usuario viene a cobrar premio

        //console.log("hay contacto agregado");

        if (inOrderToCobrarPremio === true) {
          // verificar que el premio no esta agregado ya
          const prizeAlreadyExist = validated_prizes.find(
            (prize) => prize.uuid === userState.prize.uuid
          );

          //console.log(prizeAlreadyExist);

          // si existe, no hacer nada
          // si no existe, agregar
          if (prizeAlreadyExist === undefined) {
            // si hay un slot vacio, solo agregar
            const type = userState.prize.type;
            const uuid = userState.prize.uuid;

            //let fieldId;

            if (contactosSeleccionados.length < fields.length) {
              const fieldId = fields[fields.length - 1].fieldId;

              nuevaRecargaDispatch(
                setPrize({ fieldId, uuid, type, loading: true })
              );

              validate_prize(uuid)
                .then((response) => {
                  console.log(response.status);
                  console.log(response.data);
                  nuevaRecargaDispatch(
                    updatePrize(uuid, {
                      fieldId,
                      uuid,
                      type,
                      loading: false,
                    })
                  );
                  nuevaRecargaDispatch(toggleValidateInProcess(false));
                })
                .catch((err) => {
                  console.log(err.message);
                  nuevaRecargaDispatch(deletePrizeByFieldId(fieldId));
                  nuevaRecargaDispatch(toggleValidateInProcess(false));
                });
            } else {
              // si no hay un slot vacio, agregar slot y premio
              const fieldId = makeid(15);

              nuevaRecargaDispatch(setFields(true, fieldId));

              nuevaRecargaDispatch(
                setPrize({ fieldId, uuid, type, loading: true })
              );

              validate_prize(uuid)
                .then(() => {
                  nuevaRecargaDispatch(
                    updatePrize(uuid, {
                      fieldId,
                      uuid,
                      type,
                      loading: false,
                    })
                  );
                  nuevaRecargaDispatch(toggleValidateInProcess(false));
                })
                .catch((err) => {
                  //console.log(err.message);
                  deletePrizeByFieldId(fieldId);
                  nuevaRecargaDispatch(toggleValidateInProcess(false));
                });
            }
          }
          navigation.setParams({ inOrderToCobrarPremio: false });
        }
      }

      //const hayPremio =
      //userState.prize != null && userState.prize.type !== "Nada";
      //contactosSeleccionados, fields, userState, validated_prizes
    }, [
      contactosSeleccionados,
      userState,
      fields,
      validated_prizes,
      inOrderToCobrarPremio,
    ])
  );

  /* React.useEffect(() => {
    console.log(contactosSeleccionados);
  }, [contactosSeleccionados]); */

  React.useEffect(() => {
    const unsub = navigation.addListener("blur", () => {
      navigation.setParams({ inOrderToCobrarPremio: false });
      //console.log("prize", userState.prize);
    });

    return unsub;
  }, [navigation]);

  const prize_init_checkout = (prize_id) => {
    //console.log("init checkout");
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/init-checkout/${prize_id}`;

    let config = {
      method: "post",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };
    return axios(config);
  };

  const validate_prize = (prize_id) => {
    nuevaRecargaDispatch(toggleValidateInProcess(true));
    // console.log("init validate");
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/validate/${prize_id}`;

    const config = {
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    return axios(config);
  };

  const getOperators = (selectedCountry) => {
    const countryIsoCode = selectedCountry;
    const user_token = userState.token;
    const url = `${BASE_URL}/topup/operators`;

    const config = {
      method: "get",
      url,
      params: {
        countryIsoCode,
      },
      headers: {
        Authorization: `Bearer ${user_token}`,
      },
    };

    //console.log(config);

    axios(config)
      .then((response) => {
        //console.log(response.data);
        const data = response.data;
        //console.log("data", [...data]);

        setProviderList([...data]);

        // console.log(data.length);
        if (data.length !== 0) {
        }
      })
      .catch((err) => {
        //console.log(err.message);
        setProviderList([]);
        Toast.show(
          userState?.idioma === "spa"
            ? "No se pudo cargar la lista de operadores de esta región"
            : "Unable to load the list of operators in this region",
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
      .finally(() => {
        setLoadingProviders(false);
      });
  };

  const onSelectCountry = (anteriorCountry, selectedCountry) => {
    //console.log(anteriorCountry);
    //console.log(selectedCountry);

    //actualizar estado app
    userDispatch(setCountryForUser(selectedCountry));
    userDispatch(setOperatorForUser({ name: undefined, id: undefined }));
    //actualizar almacenamiento de la app
    storeData("user", {
      ...userState,
      country: selectedCountry,
      operator: { name: undefined, id: undefined },
    });

    // si el pais seleccionado es != pais actual
    // eliminar contactos seleccionados
    if (selectedCountry !== anteriorCountry) {
      nuevaRecargaDispatch(resetNuevaRecargaState());
    }

    // cerrar drom down menu
    setCountryMenuVisible(false);
    // refrescar operadores
    setLoadingProviders(true);
    getOperators(selectedCountry);
    //debe cambiar el icono solo
  };

  const onSelectProvider = (selectedProvider) => {
    //console.log("selected", selectedProvider);
    // userDispatch
    userDispatch(setOperatorForUser(selectedProvider));
    // storeData
    storeData("user", {
      ...userState,
      operator: selectedProvider,
    });
    setProviderMenuVisible(false);
  };

  const comprobarUuidRepetido = (uuid) => {
    //premio asociado a este fieldId
    const prizeAlreadyValidated = validated_prizes.find((prize) => {
      return prize.uuid === uuid;
    });

    return prizeAlreadyValidated !== undefined;
  };

  const onPressOkModal = (fieldId, uuid) => {
    const repetido = comprobarUuidRepetido(uuid);
    //console.log("fieldId", fieldId);
    //console.log("uuid", uuid);

    if (repetido) {
      // el premio esta siendo usado
      // el premio ya esta validado para otro beneficiario, considere eliminarlo
      Toast.show(
        userState?.idioma === "spa"
          ? "El premio ya está validado para otro beneficiario, considere eliminarlo"
          : "The prize is already validated for another beneficiary, consider removing it",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
      setModalVisible(false);
    } else {
      // actualizar loading
      nuevaRecargaDispatch(
        setPrize({
          fieldId,
          uuid,
          type: undefined,
          loading: true,
        })
      );

      validate_prize(uuid)
        .then((response) => {
          const currentPrize = response.data;
          //console.log(currentPrize);
          const type = currentPrize.type;

          // actualizar lista de premios validados
          nuevaRecargaDispatch(
            updatePrize(uuid, {
              fieldId,
              uuid,
              type,
              loading: false,
            })
          );
          nuevaRecargaDispatch(toggleValidateInProcess(false));
        })
        .catch(() => {
          Toast.show(ResolveText("codigoInvalido"), {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          // activar/ desactivar despues de 1 seg: animacion de error
          setAnimacionPremioNoValido({ fieldId, valid: false });

          setTimeout(() => {
            setAnimacionPremioNoValido({ fieldId: undefined, valid: true });
          }, 1000);

          //eleminar el que se añadió y actualizar loading, no es válido
          nuevaRecargaDispatch(deletePrizeByFieldId(fieldId));
          nuevaRecargaDispatch(toggleValidateInProcess(false));
        });
      setModalVisible(false);
    }
  };

  const onPressBarcode = (fieldId) => {
    setFieldIdMatched(fieldId);
    setModalVisible(true);
  };

  const onPressAddContactField = () => {
    if (addContactAvaiable) {
      nuevaRecargaDispatch(setFields(false, makeid(15)));

      //al final -> deshabilitar botón
      nuevaRecargaDispatch(toogleAddContactAvaiable(false));
    } else {
      Toast.show("Añade un contacto antes de añadir otro campo", {
        duaration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  const filterContactsByFieldId = (id) => {
    let contactSelected;

    const contactSelectedArr = contactosSeleccionados.filter((contact) => {
      return id === contact.fieldInputId;
    });

    if (contactSelectedArr.length > 0) {
      contactSelected = contactSelectedArr[0];
      return contactSelected;
    } else {
      return null;
    }
  };

  const filterCodes = (fieldId) => {
    /*  const currentIsNada =
      userState.prize != null &&
      userState.prize.type === "Nada" &&
      isFirstField;
    if (currentIsNada) {
      return {
        fieldId,
        uuid: undefined,
        type: "Nada",
        loading: false
      };
    }  */
    const prizeById = validated_prizes.find(
      (prize) => fieldId === prize.fieldId
    );

    if (prizeById !== undefined) {
      return prizeById;
    } else {
      return null;
    }
  };

  const onPressContinuar = () => {
    if (!addContactAvaiable) {
      Toast.show(
        userState?.idioma === "spa"
          ? "Selecciona al menos a un contacto para recargar"
          : "Select at least one contact to recharge",
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
    } else {
      setLoadingContinuar(true);

      if (validatetInProcess) {
        Toast.show(
          userState?.idioma === "spa"
            ? "Se están validando tus premios"
            : "Your prizes are being validated",
          {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          }
        );
        setLoadingContinuar(false);
      } else {
        if (
          userState.operator.id == undefined ||
          userState.operator.name == undefined
        ) {
          Toast.show(
            userState?.idioma === "spa"
              ? "Antes de continuar, seleccione su operador"
              : "Before proceeding, select your carrier",
            {
              duaration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            }
          );
          setLoadingContinuar(false);
        } else {
          /*   console.log(
          "socket state - nueva recarga screen",
          socketState.socketOpen
        ); */

          if (!socketState.socketIsOpen) {
            socketDispatch(openSocket());
          }

          // init checkout de los premios validados
          // si un premio está asociado a un contacto, es que está en checkout

          let prizesForInitCheckoutPromise = [];

          validated_prizes.forEach((prize_validado) => {
            prizesForInitCheckoutPromise.push(
              prize_init_checkout(prize_validado.uuid)
            );
          });

          Promise.all(prizesForInitCheckoutPromise)
            .then(() => {
              // antes de CONTINUAR
              // se actualiza el arreglo de contactos seleccionados
              // con los premios correspondientes
              validated_prizes.forEach((prize) => {
                nuevaRecargaDispatch(
                  updatePrizeForContact(prize.fieldId, {
                    uuid: prize.uuid,
                    type: prize.type,
                  })
                );
              });
              setLoadingContinuar(false);
              //console.log(BASE_URL);
              navigation.navigate("RecargasDisponiblesScreen");
            })
            .catch((err) => {
              setLoadingContinuar(false);
              Toast.show(err.message, {
                duaration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            });
        }
      }
    }
  };

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

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
      }}
      transition={false}
    >
      <View
        style={{
          paddingTop: 65,
          width: width,
          height: height / 6,
          backgroundColor: { buttonColor },
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            setCountryMenuVisible(!countryMenuVisible);
          }}
          style={{
            marginLeft: marginGlobal,
            marginTop: 10,
            backgroundColor: buttonColor,
            width: width / 7,
            height: width / 7 - 20,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {userCountry == "CUB" ? (
              <Image
                source={require("../../assets/images/bandera_cub.jpg")}
                style={{ width: 30, height: 16 }}
              />
            ) : userCountry == "MEX" ? (
              <Image
                source={require("../../assets/images/bandera_mex.jpg")}
                style={{ width: 30, height: 16 }}
              />
            ) : userCountry == "DOM" ? (
              <Image
                source={require("../../assets/images/bandera_do.jpg")}
                style={{ width: 30, height: 16 }}
              />
            ) : null}
            <TextBold
              text={userCountry}
              style={{
                fontSize: 14 / PixelRatio.getFontScale(),
                color: "#fffb00",
                textTransform: "uppercase",
                marginTop: 5,
              }}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: width / 3.3,
            height: width / 7 - 20,
            //flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              loadingProviders || providerList.length == 0
                ? null
                : setProviderMenuVisible(!providerMenuVisible);
            }}
            activeOpacity={0.6}
            style={{
              marginTop: 10,
              backgroundColor: buttonColor,
              width: width / 3,
              height: width / 7 - 20,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loadingProviders ? (
              <ActivityIndicator size="small" color="#fffb00" />
            ) : (
              <TextBold
                //text={ResolveText("continuar")}
                text={
                  userState.operator.id != undefined
                    ? userState.operator.name
                    : userState.idioma == "spa"
                    ? "OPERADORES"
                    : "CARRIER"
                }
                style={{
                  fontSize: 20 / PixelRatio.getFontScale(),
                  color: "#fffb00",
                  textTransform: "uppercase",
                }}
              />
            )}
          </TouchableOpacity>
          {/* <Image
            source={require("../../assets/images/iconos/abajo.png")}
            style={{ width: 12, height: 10, marginTop: 8, marginLeft: -15 }}
          /> */}
        </View>

        <TouchableOpacity
          onPress={() => onPressAddContactField()}
          activeOpacity={0.6}
          style={{
            marginTop: 10,
            marginRight: marginGlobal,
            backgroundColor: buttonColor,
            width: width / 7,
            height: width / 7 - 20,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/iconos/add_user.png")}
            style={{ width: 31, height: 21 }}
          />
        </TouchableOpacity>
      </View>
      <CountryMenuModal
        modalVisible={countryMenuVisible}
        setModalVisible={setCountryMenuVisible}
        transparent={true}
        width={width}
        height={height}
        onSelectCountry={onSelectCountry}
      />
      <ProviderMenuModal
        modalVisible={providerMenuVisible}
        setModalVisible={setProviderMenuVisible}
        transparent={true}
        width={width}
        height={height}
        onSelectProvider={onSelectProvider}
        providerList={providerList}
      />
      <ScrollView style={styles.outterContainer}>
        <CodigoRecargaModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onPressOkModal={onPressOkModal}
          transparent={true}
          width={width}
          height={height}
          fieldIdMatched={fieldIdMatched}
          //actualBarcodeId={actualBarcodeId}
        />
        <View style={styles.innerContainer}>
          <View style={{ flex: 1, width: "100%" }}>
            {fields.map((field) => (
              <View key={field.fieldId}>
                <NuevoContactoInput
                  fieldInputId={field.fieldId}
                  navigation={navigation}
                  prizeByFieldId={filterCodes(field.fieldId)}
                  contactSelected={filterContactsByFieldId(field.fieldId)}
                  onPressBarcode={onPressBarcode}
                  isFirstInput={field.isFirstField}
                  animacionPremioNoValido={animacionPremioNoValido}
                />
              </View>
            ))}

            <View
              style={{
                marginTop: 20,
                flex: 1,
                width: "100%",
                alignItems: "center",
              }}
            ></View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.button_continuar, { alignItems: "center" }]}>
        <TouchableOpacity
          //color="#611951"
          activeOpacity={0.6}
          onPress={() => onPressContinuar()}
          style={{
            backgroundColor: buttonColor,
            width: (4 / 5) * width,
            height: width / 7.5,
            borderRadius: width / 7.5,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 100,
          }}
        >
          {loadingContinuar ? (
            <ActivityIndicator size="large" color="#01f9d2" />
          ) : (
            <TextBold
              text={ResolveText("continuar")}
              style={{
                fontSize: 20,
                color: "#01f9d2",
                textTransform: "uppercase",
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default NuevaRecargaScreen;

/*  */

const styles = StyleSheet.create({
  outterContainer: {
    //  backgroundColor: "rgba(112, 28, 87, 1)",
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    //height: height,
    marginHorizontal: marginGlobal,

    //justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button_add_contacto: {
    marginTop: 30,
    marginBottom: 20,
  },
  button_continuar: {
    marginBottom: 25,
  },

  input: {
    width: "50%",
    //height: 50,
    //backgroundColor: "rgba(112, 28, 87, 0.1)",
    //borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: { buttonColor },
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
