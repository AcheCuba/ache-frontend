import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";
import { useForm, Controller } from "react-hook-form";
import NuevoContactoInput from "./components/NuevoContactoInput";

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
  const [text, setText] = React.useState("");
  const [contacts, setContact] = React.useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

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

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{ flex: 1, width: "100%", marginTop: 40, marginVertical: 20 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <TextInput
              style={styles.input}
              placeholder="+535 222-22-22"
              onChangeText={(value) => setText(value)}
              value={text}
              placeholderTextColor="rgba(0,0,0,0.3)"
              color="rgba(0,0,0,1)"
              keyboardType="phone-pad"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  navigation.navigate("MultiplesContactosScreen");
                }}
              >
                <Ionicons
                  name="person-add"
                  color="rgba(112, 28, 87, 1)"
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="trophy" size={30} />
              </TouchableOpacity>
            </View>
          </View>
          {contacts.map((contact) => (
            <View key={contact.id}>
              <NuevoContactoInput
                contactId={contact.id}
                navigation={navigation}
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
                onPress={() =>
                  setContact([
                    ...contacts,
                    { id: makeid(7), contact: "newContact" },
                  ])
                }
                customStyle={customStyle}
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
