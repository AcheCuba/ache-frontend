import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import normalize from "react-native-normalize";
import { TextBold, TextMedium } from "../../../components/CommonText";
import {
  buttonColor,
  generalBgColor,
  generalBgColorTrans5,
  generalBgColorTrans8,
} from "../../../constants/commonColors";
import { GlobalContext } from "../../../context/GlobalProvider";

const ProviderMenuModal = ({
  modalVisible,
  setModalVisible,
  transparent,
  width,
  onSelectProvider,
  providerList,
}) => {
  const { userState } = React.useContext(GlobalContext);
  const actualCountry = userState?.country;

  const numOptions = 5;
  const heightOption = 40;
  const marginOption = 10;
  const gap = 40;
  const heightList = numOptions * (heightOption + marginOption) + gap;

  React.useEffect(() => {
    //console.log("inside modal", providerList);
  }, [providerList]);

  const separator = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 3,
            width: width / 2.3,
            //backgroundColor: "rgba(255, 251, 0, 0.7)",
            backgroundColor: generalBgColorTrans8,
            alignItems: "center",
          }}
        />
      </View>
    );
  };

  const renderProviderList = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          width: width / 1.5,
          height: heightOption,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
          marginBottom: 10,
          //marginBottom: 10,
        }}
        onPress={() => onSelectProvider(item)}
      >
        <TextMedium
          style={{
            fontSize: normalize(23),
            color: "#fffb00",
          }}
          text={item.name}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      transparent={transparent}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPressOut={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: generalBgColorTrans8,
          }}
        />
      </TouchableWithoutFeedback>

      <View
        style={{
          position: "absolute",
          top: width / 1.4,
          left: (0.5 * width) / 3,
        }}
        /* style={{
          flex: 1,
          backgroundColor: generalBgColorTrans5,
          justifyContent: "center",
          alignItems: "center",
        }} */
      >
        <View
          width={width / 1.5}
          height={heightList}
          color={buttonColor}
          borderRadius={30}
          style={{
            backgroundColor: buttonColor,
            width: width / 1.5,
            height: heightList,
            borderRadius: 30,
          }}
        >
          <FlatList
            keyExtractor={(item) => item.id}
            data={providerList}
            ItemSeparatorComponent={separator}
            renderItem={renderProviderList}
            //ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={true}
            style={{
              width: width / 1.5,
              marginBottom: 20,
              marginTop: 20,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProviderMenuModal;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    //justifyContent: "center",
    // backgroundColor: "pink",
    alignItems: "center",
    backgroundColor: "gray",
  },

  input: {
    // width: "90%",
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    marginBottom: 10,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
});
