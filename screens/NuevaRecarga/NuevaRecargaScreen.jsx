import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";

import CustomButton from "../../components/CustomButton";
import { useForm, Controller } from "react-hook-form";
import NuevoContactoInput from "./components/NuevoContactoInput";
import { GlobalContext } from "../../context/GlobalProvider";
import { toogleAddContactAvaiable } from "../../context/Actions/actions";
import CodigoRecargaModal from "./components/CodigoRecargaModal";
import { NeuButton, NeuView } from "react-native-neu-element";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";

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
  const { addContactAvaiable, contactosSeleccionados } = nuevaRecargaState;

  // console.log(contactosSeleccionados);

  const [text, setText] = React.useState("");
  const [fields, setField] = React.useState([]);
  const [firstFieldId, setFirstFieldId] = React.useState("");
  const [codigos, setCodigos] = React.useState([]);
  const [actualBarcodeId, setActualBarcodeId] = React.useState([]);

  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    // en lugar de esto, añadir a la lista y tener una sola lógica
    // eliminar firstFieldId y firstInput
    if (contactosSeleccionados.length === 0) {
      setFirstFieldId(makeid(10));
      //console.log("contactos === 0");
    }
    //console.log("useEffect nueva recarga");
  }, []);

  React.useEffect(() => {
    //console.log(contactosSeleccionados);
    //console.log(contactosSeleccionados);
  }, [contactosSeleccionados]);

  const onPressBarcode = (fieldId) => {
    setActualBarcodeId(fieldId);
    setModalVisible(true);
  };

  const onPressOkModal = (fieldId, codigo) => {
    //console.log(fieldId, codigo);
    const codigosNoRepetidos = codigos.filter(
      (code) => code.fieldId !== fieldId
    );
    setModalVisible(false);
    setCodigos(codigosNoRepetidos.concat({ fieldId, codigo }));
  };

  //console.log(codigos);
  //console.log("add_contact_avaiable", addContactAvaiable);
  //console.log(contactSelected);

  const customStyle = {
    //paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
    borderRadius: 20
  };

  const onPressAddContact = () => {
    if (addContactAvaiable) {
      setField([...fields, { id: makeid(10), contact: "newContact" }]);
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

  const filterCodes = (id) => {
    let code;

    const codeFilteredArr = codigos.filter((code) => {
      return id === code.fieldId;
    });

    if (codeFilteredArr.length > 0) {
      code = codeFilteredArr[0].codigo;
      return code;
    } else {
      return null;
    }
  };
  const onPressContinuar = () => {
    if (addContactAvaiable) {
      navigation.navigate("RecargasDisponiblesScreen");
    } else {
      Toast.show("Deben completarse todos los campos", Toast.SHORT);
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
            navigation.navigate("Juego");
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
          actualBarcodeId={actualBarcodeId}
        />
        <View style={styles.innerContainer}>
          <View style={{ flex: 1, width: "100%" }}>
            <NuevoContactoInput
              fieldInputId={firstFieldId}
              navigation={navigation}
              iconName="trophy"
              contactSelected={filterContactsByFieldId(firstFieldId)}
              isFirstInput={true}
              onPressBarcode={onPressBarcode}
            />

            {fields.map((field) => (
              <View key={field.id}>
                <NuevoContactoInput
                  fieldInputId={field.id}
                  navigation={navigation}
                  iconName="barcode"
                  codigo={filterCodes(field.id)}
                  contactSelected={filterContactsByFieldId(field.id)}
                  onPressBarcode={onPressBarcode}
                  isFirstInput={false}
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
          <Text
            style={{
              color: "#01f9d2",
              fontWeight: "bold",
              fontSize: 20
            }}
          >
            CONTINUAR
          </Text>
        </NeuButton>
      </View>
    </View>
  );
};

export default NuevaRecargaScreen;

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
