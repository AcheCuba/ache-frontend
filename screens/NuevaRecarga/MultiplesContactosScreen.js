import React, { useCallback, useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import Contact from "./components/Contact";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";

const MultiplesContactosScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [text, setText] = useState("");

  const renderItemContact = useCallback((item) => {
    if (item !== undefined) {
      return (
        <Contact contactName={item.firstName} contactNumber={item.phonNumber} />
      );
    }
  }, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 100,
      offset: 100 * index,
      index,
    }),

    []
  );

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const _data = data.map((contact) => {
            if (contact.firstName && contact.phoneNumbers) {
              return {
                id: contact.id,
                firstName: contact.firstName,
                phonNumber: contact.phoneNumbers[0].number,
              };
            }
          });

          setContacts(_data);
          console.log(_data);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre"
        onChangeText={(value) => setText(value)}
        value={text}
        placeholderTextColor="rgba(0,0,0,0.3)"
        color="rgba(0,0,0,1)"
        //keyboardType="phone-pad"
      />
      <FlatList
        keyExtractor={(item) => item?.id}
        data={contacts}
        renderItem={({ item }) => renderItemContact(item)}
        // getItemLayout={getItemLayout}
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
