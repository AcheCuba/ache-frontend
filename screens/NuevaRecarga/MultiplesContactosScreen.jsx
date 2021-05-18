import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import Contact from "./components/Contact";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { GlobalContext } from "../../context/GlobalProvider";
import { selectContact } from "../../context/Actions/actions";

const MultiplesContactosScreen = ({ navigation, route }) => {
  const { contactInputId } = route.params;

  const [contacts, setContacts] = useState([]);
  const [contactsFiltered, setContactsFiltered] = useState([]);
  const [text, setText] = useState("");

  const { nuevaRecargaDispatch } = useContext(GlobalContext);

  const onPressContact = (id, contactName, contactNumber) => {
    nuevaRecargaDispatch(
      selectContact({ id, contactName, contactNumber, contactInputId })
    );
    navigation.navigate("Nueva Recarga");
  };

  const onChangeText = (value) => {
    setText(value);
    const _contactsFiltered = contacts.filter((contact) => {
      return (
        contact.firstName.toLowerCase().includes(value.toLowerCase()) ||
        contact.phoneNumber.toLowerCase().includes(value.toLowerCase())
      );
    });

    setContactsFiltered(_contactsFiltered);
  };

  const renderItemContact = useCallback((item) => {
    if (item !== undefined) {
      return (
        <Contact
          contactName={item.firstName}
          contactNumber={item.phoneNumber}
          id={item.id}
          navigation={navigation}
          onPressContact={onPressContact}
        />
      );
    }
  }, []);

  /* const getItemLayout = useCallback(
    (data, index) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),

    []
  );
 */
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          let _data = data.filter((cont) => {
            return cont.firstName.length > 0 && cont.phoneNumbers?.length > 0;
          });

          _data = _data.map((contact) => {
            return {
              id: contact.id,
              firstName: contact.firstName,
              phoneNumber: contact.phoneNumbers[0].number,
            };
          });

          setContacts(_data);
          // console.log(_data);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre o número de teléfono"
        onChangeText={(value) => onChangeText(value)}
        value={text}
        placeholderTextColor="rgba(0,0,0,0.3)"
        color="rgba(0,0,0,1)"
        //keyboardType="phone-pad"
      />
      <FlatList
        keyExtractor={(item) => item?.id}
        data={contactsFiltered.length === 0 ? contacts : contactsFiltered}
        renderItem={({ item }) => renderItemContact(item)}
        //getItemLayout={getItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
  },
  input: {
    //width: "90%",
    height: 50,
    //backgroundColor: "rgba(112, 28, 87, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingLeft: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
});

export default MultiplesContactosScreen;
