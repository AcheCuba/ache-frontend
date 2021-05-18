import React, { useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";
import { useForm, Controller } from "react-hook-form";
import NuevoContactoInput from "./components/NuevoContactoInput";
import { GlobalContext } from "../../context/GlobalProvider";
import { toogleAddContactAvaiable } from "../../context/Actions/actions";
import CodigoRecargaModal from "./components/CodigoRecargaModal";

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
  const { addContactAvaiable, contactSelected } = nuevaRecargaState;

  const [text, setText] = React.useState("");
  const [contacts, setContact] = React.useState([]);
  //const [hasCode, setHasCode] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);

  const onPressBarcode = () => {
    setModalVisible(true);
  };

  const onPressOkModal = () => {
    setModalVisible(false);
    //setHasCode(true);
  };

  //console.log("add_contact_avaiable", addContactAvaiable);
  //console.log(contactSelected);

  const customStyle = {
    //paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
    borderRadius: 20,
  };

  const onPressAddContact = () => {
    nuevaRecargaDispatch(toogleAddContactAvaiable(false));
    setContact([...contacts, { id: makeid(7), contact: "newContact" }]);
  };

  return (
    <ScrollView>
      <CodigoRecargaModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onPressOkModal={onPressOkModal}
      />
      <View style={styles.container}>
        <View style={{ flex: 1, width: "100%", marginVertical: 20 }}>
          <NuevoContactoInput
            contactId={makeid(7)}
            navigation={navigation}
            iconNameLeft="person-add"
            iconNameRight="trophy"
            contactSelected={contactSelected}
          />

          {contacts.map((contact) => (
            <View key={contact.id}>
              <NuevoContactoInput
                contactInputId={contact.id}
                navigation={navigation}
                iconNameLeft="person-add"
                iconNameRight="barcode"
                contactSelected={contactSelected}
                onPressBarcode={onPressBarcode}
                //hasCode={hasCode}
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
          >
            <View style={[styles.buttons, { width: "80%" }]}>
              <CustomButton
                title="Añadir Contacto"
                onPress={() => onPressAddContact()}
                customStyle={customStyle}
                disabled={!addContactAvaiable}
              />
            </View>
            <View style={[styles.buttons, { width: "50%" }]}>
              <CustomButton
                title="Continuar"
                onPress={() => navigation.navigate("RecargasDisponiblesScreen")}
                customStyle={customStyle}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default NuevaRecargaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttons: {
    marginTop: 10,
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
