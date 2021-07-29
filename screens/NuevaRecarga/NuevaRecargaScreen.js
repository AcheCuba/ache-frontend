import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert
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
  updatePrize
} from "../../context/Actions/actions";
import CodigoRecargaModal from "./components/CodigoRecargaModal";
import { NeuButton, NeuView } from "react-native-neu-element";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { BASE_URL } from "../../constants/domain";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

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

const NuevaRecargaScreen = ({ navigation }) => {
  const { nuevaRecargaDispatch, nuevaRecargaState } = useContext(GlobalContext);
  const {
    addContactAvaiable,
    contactosSeleccionados,
    validated_prizes,
    fields,
    validatetInProcess
  } = nuevaRecargaState;
  const { userState } = React.useContext(GlobalContext);

  //console.log(userState.prize);

  const [loadingContinuar, setLoadingContinuar] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [fieldIdMatched, setFieldIdMatched] = React.useState("");

  useFocusEffect(
    React.useCallback(() => {
      // console.log("contactos selec", contactosSeleccionados);
      if (contactosSeleccionados.length === 0 && fields.length === 0) {
        const firstFieldId = makeid(15);

        // set first field
        nuevaRecargaDispatch(setFields(true, firstFieldId));

        //console.log("contactos === 0");
        // si el usuario tiene premio añadirlo a la lista
        const hayPremio =
          userState.prize != null && userState.prize.type !== "Nada";
        if (validated_prizes.length === 0 && hayPremio) {
          const type = userState.prize.type;
          const uuid = userState.prize.uuid;
          const fieldId = firstFieldId;

          validate_prize(uuid)
            .then((resp) => {
              console.log("validate in useEffect", resp.data);
              nuevaRecargaDispatch(
                setPrize({ fieldId, uuid, type, loading: false })
              );
              nuevaRecargaDispatch(toggleValidateInProcess(false));
            })
            .catch((err) => {
              console.log(err.message);
              nuevaRecargaDispatch(toggleValidateInProcess(false));
            });
        }
      }
    }, [contactosSeleccionados, fields, validated_prizes, userState])
  );

  /* React.useEffect(() => {
    if (contactosSeleccionados.length === 0) {
      const firstFieldId = makeid(15);

      if (fields.length === 0) {
        nuevaRecargaDispatch(setFields(true, firstFieldId));
      }

      //console.log("contactos === 0");
      // si el usuario tiene premio añadirlo a la lista
      const hayPremio =
        userState.prize != null && userState.prize.type !== "Nada";
      if (validated_prizes.length === 0 && hayPremio) {
        const type = userState.prize.type;
        const uuid = userState.prize.uuid;
        const fieldId = firstFieldId;

        validate_prize(uuid)
          .then((resp) => {
            console.log("validate in useEffect", resp.data);
            nuevaRecargaDispatch(
              setPrize({ fieldId, uuid, type, loading: false })
            );
            nuevaRecargaDispatch(toggleValidateInProcess(false));
          })
          .catch((err) => {
            console.log(err.message);
            nuevaRecargaDispatch(toggleValidateInProcess(false));
          });
      }
    }

    return () => {
      //console.log("cleanup?");
      //finish_checkout_all_prizes();
    };
  }, []); */

  /* React.useEffect(() => {
    //console.log("validated_prizes nueva recarga screen", validated_prizes);
    console.log("fields", fields);
    console.log("contactos seleccionados", contactosSeleccionados);
    console.log("validated_prizes", validated_prizes);
  }, [validated_prizes]); */

  const overwritePrizeForField = (fieldId) => {
    const prizeForFinishCheckout = validated_prizes.find(
      (prize) => prize.fieldId === fieldId
    );

    if (prizeForFinishCheckout !== undefined) {
      nuevaRecargaDispatch(deletePrize(prizeForFinishCheckout.uuid));
    }
  };

  const prize_init_checkout = (prize_id) => {
    console.log("init checkout");
    const user_token = userState.token;
    const url = `${BASE_URL}/prize/init-checkout/${prize_id}`;

    let config = {
      method: "post",
      url: url,
      headers: {
        "Authorization": `Bearer ${user_token}`
      }
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
        "Authorization": `Bearer ${user_token}`
      }
    };

    return axios(config);
  };

  const comprobarUuidRepetido = (fieldId, uuid) => {
    //premio asociado a este fieldId
    const prizeForField = validated_prizes.find((prize) => {
      return prize.fieldId === fieldId;
    });

    if (prizeForField != undefined) {
      return prizeForField.uuid === uuid;
    } else {
      return false;
    }
  };

  const onPressOkModal = (fieldId, uuid) => {
    const repetido = comprobarUuidRepetido(fieldId, uuid);
    if (repetido) {
      // no se hace nada más
      setModalVisible(false);
    } else {
      overwritePrizeForField(fieldId);

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
          Toast.show("El premio no es válido", Toast.SHORT);
          Toast.show(error.message, Toast.SHORT);
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
      Toast.show("Añade un contacto antes de añadir otro campo", Toast.SHORT);
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

  /* const onPressContinuar = () => {
    navigation.navigate("RecargasDisponiblesScreen");
  }; */

  const onPressContinuar = () => {
    if (!addContactAvaiable) {
      Toast.show(
        "Selecciona al menos a un contacto para recargar",
        Toast.SHORT
      );
    } else {
      setLoadingContinuar(true);
      /*  const hayPremio =
        userState.prize != null && userState.prize.type !== "Nada";
      if (!hayPremio) {
        setLoadingContinuar(false);
        navigation.navigate("RecargasDisponiblesScreen");
        console.log("No hay premio");
      } else { */
      if (validatetInProcess) {
        Toast.show("Se están validando tus premios", Toast.SHORT);
        setLoadingContinuar(false);
      } else {
        // init checkout de los premios validados
        // si un premio está asociado a un contacto, es que está en checkout
        if (validated_prizes.length === 0) {
          Toast.show("No hay premios válidos por cobrar", Toast.SHORT);
          setLoadingContinuar(false);
          navigation.navigate("RecargasDisponiblesScreen");
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
                    type: prize.type
                  })
                );
              });
              setLoadingContinuar(false);
              navigation.navigate("RecargasDisponiblesScreen");
            })
            .catch((err) => {
              setLoadingContinuar(false);
              Toast.show(err.message, Toast.SHORT);
            });
        }
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(112, 28, 87, 1)"
      }}
    >
      <View
        style={{
          paddingTop: 50,
          width: width,
          height: height / 6,
          backgroundColor: "rgba(112, 28, 87, 1)",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <NeuButton
          color="#701c57"
          width={width / 7}
          height={width / 7}
          borderRadius={width / 14}
          onPress={() => {
            navigation.jumpTo("Juego");
          }}
          style={{ marginLeft: marginGlobal, marginTop: 10 }}
        >
          <Ionicons name="chevron-back" size={30} color="#01f9d2" />
        </NeuButton>
        <NeuButton
          color="#701c57"
          width={width / 7}
          height={width / 7}
          borderRadius={width / 14}
          onPress={() => onPressAddContact()}
          style={{ marginRight: marginGlobal, marginTop: 10 }}
        >
          <Ionicons name="person-outline" size={30} color="gray" />
          <Ionicons
            name="add-circle-sharp"
            size={30}
            color="#01f9d2"
            style={{ position: "absolute", right: -2, bottom: -5 }}
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
                alignItems: "center"
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
    </View>
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
    marginHorizontal: marginGlobal

    //justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  button_add_contacto: {
    marginTop: 30,
    marginBottom: 20
  },
  button_continuar: {
    marginBottom: 25
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
    marginHorizontal: 10
  }
});
