import React, { useCallback, useContext, useEffect, useState } from "react";
import * as Contacts from "expo-contacts";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Contact from "./components/Contact";
import { GlobalContext } from "../../context/GlobalProvider";
import {
  selectContact,
  deleteContact,
  toogleAddContactAvaiable,
} from "../../context/Actions/actions";

import Toast from "react-native-root-toast";
import { Image } from "react-native";
import { buttonColor, generalBgColor } from "../../constants/commonColors";
import { TextInput } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const MultiplesContactosScreen = ({ navigation, route }) => {
  const { fieldInputId } = route.params;
  // console.log(fieldInputId);

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsFiltered, setContactsFiltered] = useState([]);
  const [text, setText] = useState("");

  const [prizeForCurrentField, setPrizeForCurrentField] = useState(null);

  const { nuevaRecargaDispatch, nuevaRecargaState, userState } =
    useContext(GlobalContext);

  const userCountry = userState.country;

  const { contactosSeleccionados } = nuevaRecargaState;

  // verificar si el contacto actual existe
  // si tiene premio
  // almacenar el premio del contacto actual y ponerselo al contacto seleccionado, en lugar de null
  useEffect(() => {
    //console.log(contacts.length);
    const existente = contactosSeleccionados.find((contacto) => {
      return contacto.fieldInputId === fieldInputId;
    });

    //console.log(existente);
    if (existente != undefined) {
      setPrizeForCurrentField(existente.prize);
    } else {
      setPrizeForCurrentField(null);
    }
  });

  const onPressContact = (contactId, contactName, contactNumber) => {
    nuevaRecargaDispatch(deleteContact(fieldInputId));

    let literalCountry;
    let literalCountryEng;

    const cleanText = contactNumber
      .replace(/ /g, "")
      .replace(/\-/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "");

    console.log(cleanText);

    let isOfficialNumberMatched;
    let isNumberMatched;

    if (userCountry === "CUB") {
      literalCountry = "Cuba";
      literalCountryEng = "Cuba";

      /* const CubanOfficialNumberRegex =
        /^\(?\+53\)? ?5 ?-?[0-9]{3} ?-?[0-9]{2} ?-?[0-9]{2}/;
      const CubanNumberRegex = /^5-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/; */

      const CubanOfficialNumberRegex = /^\+53[0-9]{8}/;
      const CubanNumberRegex = /^[0-9]{8}/;

      const matchOfficialNumber = cleanText.match(CubanOfficialNumberRegex);
      const matchNumber = cleanText.match(CubanNumberRegex);

      isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanText.length === 11;
      isNumberMatched = matchNumber !== null && cleanText.length === 8;

      //console.log(isOfficialNumberMatched);
    }

    if (userCountry === "MEX") {
      literalCountry = "México";
      literalCountryEng = "Mexico";

      //para clean numbers
      const MexOfficialNumberRegex = /^\+52[0-9]{10}/;
      const MexNumberRegex = /^[0-9]{10}/;

      // en caso mexico, comparo con clean text, es mas sencillo.
      const matchOfficialNumber = cleanText.match(MexOfficialNumberRegex);
      const matchNumber = cleanText.match(MexNumberRegex);

      isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanText.length === 13;
      isNumberMatched = matchNumber !== null && cleanText.length === 10;
    }

    if (userCountry === "DOM") {
      literalCountry = "República Dominicana";
      literalCountryEng = "Dominican Republic";

      //para clean numbers
      const DomOfficialNumberRegex = /^\+1(809)|(829)|(849)[0-9]{7}/;
      const DomNumberRegex = /^[0-9]{10}/;

      // en caso mexico, comparo con clean text, es mas sencillo.
      const matchOfficialNumber = cleanText.match(DomOfficialNumberRegex);
      const matchNumber = cleanText.match(DomNumberRegex);

      isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanText.length === 12;
      isNumberMatched = matchNumber !== null && cleanText.length === 10;
    }

    //SI COINCIDE CON EL PAIS SELECCIONADO:
    if (isOfficialNumberMatched || isNumberMatched) {
      let finalContactNumber = cleanText;

      if (userCountry === "CUB") {
        if (cleanText.length === 8) {
          finalContactNumber = "+53" + cleanText;
        }
      }

      if (userCountry === "MEX") {
        if (cleanText.length === 10) {
          finalContactNumber = "+52" + cleanText;
        }
      }

      if (userCountry === "DOM") {
        if (cleanText.length === 10) {
          finalContactNumber = "+1" + cleanText;
        }
      }

      nuevaRecargaDispatch(
        selectContact({
          contactId,
          contactName,
          contactNumber: finalContactNumber,
          fieldInputId,
          prize: prizeForCurrentField,
        })
      );
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
      navigation.navigate("NuevaRecargaScreen");
    } else {
      // NO COINCIDE CON EL PAIS SELECCIONADO
      Toast.show(
        userState?.idioma === "spa"
          ? `El número telefónico no coincide con el formato de ${literalCountry}`
          : `The phone number does not match the format of ${literalCountryEng}`,

        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
    }
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
          phoneNumber: c.number,
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

    return multiplesContactosFiltered;
  };

  const onPressCheckmark = (country) => {
    //const CubanNumberOfficial = /\(?\+53\)? ?5 ?-?[0-9]{3} ?-?[0-9]{2} ?-?[0-9]{2}/;
    //const CubanNumber = /5-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/;

    //console.log(country);
    let literalCountry;
    let literalCountryEng;

    const cleanText = text
      .replace(/ /g, "")
      .replace(/\-/g, "")
      .replace(/\(/g, "")
      .replace(/\)/g, "");

    let isOfficialNumberMatched;
    let isNumberMatched;

    if (country === "CUB") {
      literalCountry = "Cuba";
      literalCountryEng = "Cuba";

      /* const CubanOfficialNumberRegex =
        /^\(?\+53\)? ?5 ?-?[0-9]{3} ?-?[0-9]{2} ?-?[0-9]{2}/;
      const CubanNumberRegex = /^5-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/; */
      const CubanOfficialNumberRegex = /^\+53[0-9]{8}/;
      const CubanNumberRegex = /^[0-9]{8}/;

      const matchOfficialNumber = text.match(CubanOfficialNumberRegex);
      const matchNumber = text.match(CubanNumberRegex);

      isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanText.length === 11;
      isNumberMatched = matchNumber !== null && cleanText.length === 8;
    }

    if (country === "MEX") {
      literalCountry = "México";
      literalCountryEng = "Mexico";

      //para clean numbers
      const MexOfficialNumberRegex = /^\+52[0-9]{10}/;
      const MexNumberRegex = /^[0-9]{10}/;

      // en caso mexico, comparo con clean text, es mas sencillo.
      const matchOfficialNumber = cleanText.match(MexOfficialNumberRegex);
      const matchNumber = cleanText.match(MexNumberRegex);

      isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanText.length === 13;
      isNumberMatched = matchNumber !== null && cleanText.length === 10;
    }

    if (country === "DOM") {
      literalCountry = "República Dominicana";
      literalCountryEng = "Dominican Republic";

      //para clean numbers
      const DomOfficialNumberRegex = /^\+1(809)|(829)|(849)[0-9]{7}/;
      const DomNumberRegex = /^[0-9]{10}/;

      // en caso mexico, comparo con clean text, es mas sencillo.
      const matchOfficialNumber = cleanText.match(DomOfficialNumberRegex);
      const matchNumber = cleanText.match(DomNumberRegex);

      isOfficialNumberMatched =
        matchOfficialNumber !== null && cleanText.length === 12;
      isNumberMatched = matchNumber !== null && cleanText.length === 10;
    }

    //const regexp = /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/;
    if (isOfficialNumberMatched || isNumberMatched) {
      let finalContactNumber = cleanText;

      if (userCountry === "CUB") {
        if (cleanText.length === 8) {
          finalContactNumber = "+53" + cleanText;
        }
      }

      if (userCountry === "MEX") {
        if (cleanText.length === 10) {
          finalContactNumber = "+52" + cleanText;
        }
      }

      if (userCountry === "DOM") {
        if (cleanText.length === 10) {
          finalContactNumber = "+1" + cleanText;
        }
      }

      nuevaRecargaDispatch(deleteContact(fieldInputId));
      nuevaRecargaDispatch(
        selectContact({
          contactId: undefined,
          contactName: undefined,
          contactNumber: finalContactNumber,
          fieldInputId: fieldInputId,
          prize: prizeForCurrentField,
        })
      );
      nuevaRecargaDispatch(toogleAddContactAvaiable(true));
      navigation.navigate("NuevaRecargaScreen");
    } else {
      Toast.show(
        userState?.idioma === "spa"
          ? `Introduzca un número de teléfono válido en ${literalCountry}`
          : `Enter a valid phone number in ${literalCountryEng}`,
        {
          duaration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        }
      );
    }

    //for testing
    /*  nuevaRecargaDispatch(deleteContact(fieldInputId));
    nuevaRecargaDispatch(
      selectContact({
        contactId: undefined,
        contactName: undefined,
        contactNumber: text,
        fieldInputId: fieldInputId,
        prize: prizeForCurrentField,
      })
    );
    nuevaRecargaDispatch(toogleAddContactAvaiable(true));
    navigation.navigate("NuevaRecargaScreen"); */
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
    // if (item.firstName === "AAA") {
    //console.log("another");
    //console.log(item.firstName, item.id);
    // console.log(item.phoneNumbers);
    //}
    //console.log(item.firstName, item.phoneNumbers);

    return (
      <Contact
        contactName={item.firstName}
        contactNumber={item.phoneNumber}
        contactId={item.id}
        navigation={navigation}
        onPressContact={onPressContact}
      />
    );
  };

  const renderEmptyList = () => {
    /*  return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
        <Text
          style={{
            color: "gray",
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "bs-italic",
          }}
        >
          No se encontraron coincidencias
        </Text>
      </View>
    ); */
    return null;
  };

  const getItemLayout = (data, index) => ({
    length: height / 9,
    offset: (height / 9) * index,
    index,
  });

  /*   const getItemLayout = useCallback((data, index) => ({
    length: width / 8 + 15 + 2 + 2,
    offset: (width / 8 + 15 + 2) * index,
    index,
  })); */

  useEffect(() => {
    (async () => {
      setLoading(true);

      let { status } = await Contacts.requestPermissionsAsync();

      if (status === "granted") {
        //console.log(Contacts.Fields);
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          let _data = data.filter((cont) => {
            if (cont.phoneNumbers != undefined && cont.firstName != undefined) {
              // console.log(cont.phoneNumbers[0].number);
              return cont.firstName.length > 0 && cont.phoneNumbers.length > 0;
            } else {
              //console.log(cont.phoneNumbers);
            }
          });

          _data = _data.map((contact) => {
            return {
              id: contact.id,
              firstName: contact.firstName,
              //phoneNumber: contact.phoneNumbers[0].number,
              phoneNumbers: contact.phoneNumbers,
            };
          });

          _data = filterNumbers(_data);

          setContacts(_data);

          /* setTimeout(() => {
            setLoading(false);
          }, 500); */
          setLoading(false);

          //console.log(contacts[10]);
          // console.log(contacts.length);
        }
      } else {
        setLoading(false);
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
          backgroundColor: generalBgColor,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("NuevaRecargaScreen");
          }}
          style={{
            backgroundColor: buttonColor,
            width: width / 7,
            height: width / 7 - 20,
            borderRadius: 5,
            marginLeft: marginGlobal,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/iconos/atras.png")}
            style={{ width: 15, height: 15 }}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            onPressCheckmark(userCountry);
          }}
          style={{
            backgroundColor: buttonColor,
            width: width / 7,
            height: width / 7 - 20,
            borderRadius: 5,
            marginRight: marginGlobal,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/iconos/check_mark.png")}
            style={{
              width: 18,
              height: 16,
            }}
          />
        </Pressable>
      </View>
      <View
        style={{
          alignItems: "center",
          marginTop: height / 30,
          marginBottom: 20,
        }}
      >
        <TextInput
          style={{
            backgroundColor: buttonColor,
            fontWeight: "bold",
            fontFamily: "bs-italic",
            fontSize: 18,
            paddingLeft: 10,
            color: "#fff",
          }}
          placeholder={
            userState?.idioma === "spa"
              ? "Escriba el teléfono o el nombre"
              : "Type phone number or name"
          }
          onChangeText={(value) => onChangeText(value)}
          value={text}
          placeholderTextColor="gray"
          color={"#fff"}
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
          <ActivityIndicator size="large" color="#01f9d2" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            keyExtractor={(item, index) => item.id}
            data={
              contactsFiltered.length === 0 && text === ""
                ? contacts
                : contactsFiltered
            }
            renderItem={renderItemContact}
            ListEmptyComponent={renderEmptyList}
            //performance
            //getItemLayout={getItemLayout} // esto traba el final del scroll
            removeClippedSubviews={true}
            maxToRenderPerBatch={45}
            initialNumToRender={50}
            updateCellsBatchingPeriod={0.01}
            windowSize={41} //default
            //onEndReachedThreshold={0.5}
            //disableVirtualization={false}
            scrollIndicatorInsets={{ right: 1 }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: generalBgColor,
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
