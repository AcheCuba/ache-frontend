import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ScrollView
} from "react-native";
import Contact from "./components/Contact";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlobalContext } from "../../context/GlobalProvider";
import {
  selectContact,
  deleteContact,
  toogleAddContactAvaiable
} from "../../context/Actions/actions";

import { Ionicons } from "@expo/vector-icons";
import { NeuButton, NeuInput, NeuSpinner } from "react-native-neu-element";
import Toast from "react-native-simple-toast";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const MultiplesContactosScreen = ({ navigation, route }) => {
  const { fieldInputId } = route.params;
  // console.log(fieldInputId);

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsFiltered, setContactsFiltered] = useState([]);
  const [text, setText] = useState("");

  const { nuevaRecargaDispatch } = useContext(GlobalContext);

  const onPressContact = (id, contactName, contactNumber) => {
    nuevaRecargaDispatch(deleteContact(fieldInputId));

    nuevaRecargaDispatch(
      selectContact({ id, contactName, contactNumber, fieldInputId })
    );
    nuevaRecargaDispatch(toogleAddContactAvaiable(true));
    navigation.navigate("Nueva Recarga");
  };

  const filterNumbers = (contacts) => {
    let actualArray = [];
    let multiplesContactosFiltered = [];

    for (let i = 0; i < contacts.length; i++) {
      const length = contacts[i].phoneNumbers.length;
      actualArray = contacts[i].phoneNumbers;

      const cleanActualArray = actualArray.map((c) => {
        return {
          id: c.id,
          firstName: contacts[i].firstName,
          phoneNumber: c.number
        };
      });

      // sin repeticiones
      const _cleanActualArray = cleanActualArray.filter(
        (actualContact, actualIndex, array) => {
          const actualPhone = actualContact.phoneNumber
            .replace(/ /g, "")
            .replace(/\-/g, "")
            .replace(/\(/g, "")
            .replace(/\)/g, "");
          let anteriorPhone = "123";
          if (actualIndex > 0) {
            anteriorPhone = array[actualIndex - 1].phoneNumber
              .replace(/ /g, "")
              .replace(/\-/g, "")
              .replace(/\(/g, "")
              .replace(/\)/g, "");
          }
          return actualPhone !== anteriorPhone;
        }
      );

      multiplesContactosFiltered =
        multiplesContactosFiltered.concat(_cleanActualArray);
    }

    const filtered = multiplesContactosFiltered.filter((contact) => {
      const number = contact.phoneNumber;

      const CubanOfficialNumberRegex =
        /^\(?\+53\)? ?5 ?-?[0-9]{3} ?-?[0-9]{2} ?-?[0-9]{2}/;
      const CubanNumberRegex = /^5-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/;

      const matchOfficialNumber = number.match(CubanOfficialNumberRegex);
      const matchNumber = number.match(CubanNumberRegex);

      const cleanNumber = number
        .replace(/ /g, "")
        .replace(/\-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");

      const isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanNumber.length === 11;
      const isNumberMatched = matchNumber !== null && cleanNumber.length === 8;

      return isOfficialNumberMatched || isNumberMatched;
    });

    return filtered;
  };

  const onPressCheckmark = () => {
    //const CubanNumberOfficial = /\(?\+53\)? ?5 ?-?[0-9]{3} ?-?[0-9]{2} ?-?[0-9]{2}/;
    //const CubanNumber = /5-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/;

    const CubanOfficialNumberRegex =
      /^\(?\+53\)? ?5 ?-?[0-9]{3} ?-?[0-9]{2} ?-?[0-9]{2}/;
    const CubanNumberRegex = /^5-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/;

    const matchOfficialNumber = text.match(CubanOfficialNumberRegex);
    const matchNumber = text.match(CubanNumberRegex);

    const cleanText = text
      .replace(/ /g, "")
      .replace(/\-/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "");

    const isOfficialNumberMatched =
      matchOfficialNumber !== null && cleanText.length === 11;
    const isNumberMatched = matchNumber !== null && cleanText.length === 8;

    /* const regexp =
      /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/; */
    if (isOfficialNumberMatched || isNumberMatched) {
      nuevaRecargaDispatch(deleteContact(fieldInputId));
      nuevaRecargaDispatch(
        selectContact({
          id: undefined,
          contactName: undefined,
          contactNumber: text,
          fieldInputId: fieldInputId
        })
      );
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
      navigation.navigate("Nueva Recarga");
    } else {
      Toast.show(
        "Introduzca un número de teléfono válidado en Cuba",
        Toast.SHORT
      );
    }
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

  const renderItemContact = ({ item }) => {
    if (item.firstName === "AAA") {
      //console.log("another");
      //console.log(item.firstName, item.id);
      // console.log(item.phoneNumbers);
    }
    //console.log(item.firstName, item.phoneNumbers);

    return (
      <Contact
        contactName={item.firstName}
        contactNumber={item.phoneNumber}
        id={item.id}
        navigation={navigation}
        onPressContact={onPressContact}
      />
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
        <Text style={{ color: "gray", fontSize: 20, fontWeight: "bold" }}>
          No se encontraron coincidencias{" "}
        </Text>
      </View>
    );
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 100,
      offset: 100 * index,
      index
    }),

    []
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers]
        });

        if (data.length > 0) {
          let _data = data.filter((cont) => {
            return cont.firstName.length > 0 && cont.phoneNumbers?.length > 0;
          });

          _data = _data.map((contact) => {
            return {
              id: contact.id,
              firstName: contact.firstName,
              //phoneNumber: contact.phoneNumbers[0].number,
              phoneNumbers: contact.phoneNumbers
            };
          });

          _data = filterNumbers(_data);

          setContacts(_data);

          setLoading(false);
          //console.log(contacts[10]);
          // console.log(contacts.length);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
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
            navigation.goBack();
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
          onPress={() => {
            onPressCheckmark();
          }}
          style={{ marginRight: marginGlobal, marginTop: 10 }}
        >
          <Ionicons name="checkmark" size={30} color="#01f9d2" />
        </NeuButton>
      </View>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 10 }}>
        <NeuInput
          textStyle={{ color: "#fff" }}
          placeholder="Buscar por nombre o  teléfono"
          onChangeText={(value) => onChangeText(value)}
          value={text}
          placeholderTextColor="gray"
          color="#701c57"
          width={width / 1.3}
          height={40}
          borderRadius={20}
          //keyboardType="phone-pad"
        />
      </View>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <NeuSpinner
            color="#701c57"
            indicatorColor="#701c57"
            width={50}
            height={50}
            size={50}
          />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item, index) => item.id}
          data={
            contactsFiltered.length === 0 && text === ""
              ? contacts
              : contactsFiltered
          }
          renderItem={renderItemContact}
          ListEmptyComponent={renderEmptyList}
          getItemLayout={getItemLayout}
          //performance
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          updateCellsBatchingPeriod={1}
          windowSize={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#701c57"
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
    marginBottom: 10
  }
});

export default MultiplesContactosScreen;
