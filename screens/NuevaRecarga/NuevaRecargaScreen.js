import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import NuevoContactoInput from "./components/NuevoContactoInput";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  updatePrizeForContact,
  deletePrize,
  deletePrizeByFieldId,
  setFields,
  setPrize,
  toggleValidateInProcess,
  toogleAddContactAvaiable,
  updatePrize,
  deleteAllValidatedPrizes,
  resetNuevaRecargaState,
  openSocket,
} from "../../context/Actions/actions";
import CodigoRecargaModal from "./components/CodigoRecargaModal";
import { NeuButton, NeuView } from "react-native-neu-element";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { TextBold } from "../../components/CommonText";
import {
  NuevaRecargaTextEnglish,
  NuevaRecargaTextSpanish,
} from "../../constants/Texts";

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
  const { userState } = React.useContext(GlobalContext);

  const { socketDispatch } = React.useContext(GlobalContext);

  const [loadingContinuar, setLoadingContinuar] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [fieldIdMatched, setFieldIdMatched] = React.useState("");

  useFocusEffect(
    React.useCallback(() => {
      console.log("inOrder on focus", inOrderToCobrarPremio);

      // cuando no hay ningun contacto agregado
      if (contactosSeleccionados.length === 0 && fields.length === 0) {
        const firstFieldId = makeid(15);

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
                updatePrize(uuid, { fieldId, uuid, type, loading: false })
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

        if (inOrderToCobrarPremio === true) {
          // verificar que el premio no esta agregado ya
          const prizeAlreadyExist = validated_prizes.find(
            (prize) => prize.uuid === userState.prize.uuid
          );

          console.log(prizeAlreadyExist);

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
                .then(() => {
                  nuevaRecargaDispatch(
                    updatePrize(uuid, { fieldId, uuid, type, loading: false })
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
                    updatePrize(uuid, { fieldId, uuid, type, loading: false })
                  );
                  nuevaRecargaDispatch(toggleValidateInProcess(false));
                })
                .catch((err) => {
                  console.log(err.message);
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

  React.useEffect(() => {
    const unsub = navigation.addListener("blur", () => {
      //console.log("masdmasd");
      navigation.setParams({ inOrderToCobrarPremio: false });
      //console.log("prize", userState.prize);
    });

    return unsub;
  }, [navigation]);

  const prize_init_checkout = (prize_id) => {
    console.log("init checkout");
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
    console.log("init validate");
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

  const comprobarUuidRepetido = (uuid) => {
    //premio asociado a este fieldId
    const prizeAlreadyValidated = validated_prizes.find((prize) => {
      return prize.uuid === uuid;
    });

    return prizeAlreadyValidated !== undefined;
  };

  const onPressOkModal = (fieldId, uuid) => {
    const repetido = comprobarUuidRepetido(uuid);
    if (repetido) {
      // el premio esta siendo usado
      // el premio ya esta validado para otro beneficiario, considere eliminarlo
      Toast.show(
        "El premio ya esta validado para otro beneficiario, considere eliminarlo",
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
        setPrize({ fieldId, uuid, type: undefined, loading: true })
      );

      validate_prize(uuid)
        .then((response) => {
          const currentPrize = response.data;
          const type = currentPrize.type;

          // actualizar lista de premios validados
          nuevaRecargaDispatch(
            updatePrize(uuid, { fieldId, uuid, type, loading: false })
          );
          nuevaRecargaDispatch(toggleValidateInProcess(false));
        })
        .catch((error) => {
          Toast.show("La cadena introducida no es válida", {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
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

  const onPressAddContact = () => {
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
      Toast.show("Selecciona al menos a un contacto para recargar", {
        duaration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    } else {
      setLoadingContinuar(true);

      if (validatetInProcess) {
        Toast.show("Se están validando tus premios", {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setLoadingContinuar(false);
      } else {
        // open socket
        // guardar id
        console.log("se ha llamado a open socket");
        socketDispatch(openSocket());

        // init checkout de los premios validados
        // si un premio está asociado a un contacto, es que está en checkout

        if (validated_prizes.length === 0) {
          Toast.show("No hay premios válidos por cobrar", {
            duaration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
          setLoadingContinuar(false);
          navigation.navigate("RecargasDisponiblesScreen", { esDirecta: true });
        } else {
          let prizesForInitCheckoutPromise = [];

          validated_prizes.forEach((prize_validado) => {
            prizesForInitCheckoutPromise.push(
              prize_init_checkout(prize_validado.uuid)
            );
          });

          Promise.all(prizesForInitCheckoutPromise)
            .then(() => {
              validated_prizes.forEach((prize) => {
                nuevaRecargaDispatch(
                  updatePrizeForContact(prize.fieldId, {
                    uuid: prize.uuid,
                    type: prize.type,
                  })
                );
              });
              setLoadingContinuar(false);
              console.log(BASE_URL);
              navigation.navigate("RecargasDisponiblesScreen", {
                esDirecta: false,
              });
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
          paddingTop: 50,
          width: width,
          height: height / 6,
          backgroundColor: "rgba(112, 28, 87, 1)",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <NeuButton
          color="#701c57"
          width={width / 7}
          height={width / 7 - 20}
          borderRadius={5}
          onPress={() => {
            navigation.jumpTo("Juego"), { screen: "Juego" };
          }}
          style={{ marginLeft: marginGlobal, marginTop: 10 }}
        >
          {/*           <Ionicons name="chevron-back" size={30} color="#01f9d2" />
           */}
          <Image
            source={require("../../assets/images/iconos/atras.png")}
            style={{ width: 15, height: 15 }}
          />
        </NeuButton>
        <NeuButton
          color="#701c57"
          width={width / 7}
          height={width / 7 - 20}
          borderRadius={5}
          onPress={() => onPressAddContact()}
          style={{ marginRight: marginGlobal, marginTop: 10 }}
        >
          {/*    <Ionicons name="person-outline" size={30} color="gray" /> */}
          {/* <Ionicons
            name="add-circle-sharp"
            size={30}
            color="#01f9d2"
            style={{ position: "absolute", right: -2, bottom: -5 }}
          /> */}
          <Image
            source={require("../../assets/images/iconos/Añadir_usuario.png")}
            style={{ width: 31, height: 21 }}
          />
        </NeuButton>
      </View>
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
                  iconName="barcode"
                  prizeByFieldId={filterCodes(field.fieldId)}
                  contactSelected={filterContactsByFieldId(field.fieldId)}
                  onPressBarcode={onPressBarcode}
                  isFirstInput={field.isFirstField}
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
        <NeuButton
          color="#701c57"
          width={(4 / 5) * width}
          height={width / 7.5}
          borderRadius={width / 7.5}
          onPress={() => onPressContinuar()}
          style={{ marginBottom: 100 }}
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

            /*   <Text
              style={{
                color: "#01f9d2",
                fontWeight: "bold",
                fontSize: 20,
                textTransform: "uppercase",
              }}
            >
              continuar
            </Text> */
          )}
        </NeuButton>
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
    borderBottomColor: "rgba(112, 28, 87, 1)",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
