import * as React from "react";
import { ImageBackground, Modal, ScrollView } from "react-native";
import { Image } from "react-native";
import { StyleSheet, View, Dimensions } from "react-native";
import LargeFlatButton from "../../components/LargeFlatButton";
import { generalBgColor } from "../../constants/commonColors";
import { GlobalContext } from "../../context/GlobalProvider";
import DeleteUserContentModal from "./components/DeleteUserContentModal";

const { width, height } = Dimensions.get("screen");
//const marginGlobal = width / 10;

const MoreScreen = ({ navigation }) => {
  const { userState } = React.useContext(GlobalContext);

  const [DeleteUserModal, setDeleteUserModal] = React.useState(false);

  return (
    <ImageBackground
      source={require("../../assets/images/degradado_general.png")}
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
      }}
      transition={false}
    >
      <View
        style={{
          paddingTop: 60,
          width: width,
          height: height / 6,
          //backgroundColor: "rgba(112, 28, 87, 1)",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/images/logo_amarillo.png")}
          //resizeMode="center"
          style={{
            //marginLeft: width / 10,
            width: width / 4.5,
            height: width / 8.6,
          }}
        />
      </View>

      {DeleteUserModal ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={DeleteUserModal}
          onRequestClose={() => setDeleteUserModal(false)}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              backgroundColor: generalBgColor,
            }}
          >
            <DeleteUserContentModal
              navigation={navigation}
              setModalVisible={setDeleteUserModal}
            />
          </View>
        </Modal>
      ) : null}

      <ScrollView
        contentContainerStyle={{
          width: width,
          alignItems: "center",
          marginTop: "5%",
          height: height * (5 / 6),
        }}
      >
        <View style={styles.buttons}>
          <LargeFlatButton
            text={userState?.idioma === "spa" ? "Sobre Nosotros" : "About Us"}
            onPress={() => navigation.navigate("AboutUsScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <LargeFlatButton
            text={userState?.idioma === "spa" ? "Premios" : "Prizes"}
            onPress={() => navigation.navigate("PremioScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <LargeFlatButton
            text={
              userState?.idioma === "spa"
                ? "Política de privacidad"
                : "Privacy Policy"
            }
            onPress={() => navigation.navigate("PrivacidadScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <LargeFlatButton
            text={
              userState?.idioma === "spa" ? "Términos de uso" : "Terms of Use"
            }
            onPress={() => navigation.navigate("TermUsoScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <LargeFlatButton
            text={userState?.idioma === "spa" ? "Modo de uso" : "Mode of Use"}
            onPress={() => navigation.navigate("ModoUsoScreen")}
          />
        </View>
        <View style={styles.buttons}>
          <LargeFlatButton
            text={userState?.idioma === "spa" ? "Contáctanos" : "Contact us"}
            onPress={() => navigation.navigate("ContactUs")}
          />
        </View>
        <View style={styles.buttons}>
          <LargeFlatButton
            text={
              userState?.idioma === "spa" ? "Eliminar Cuenta" : "Delete Account"
            }
            onPress={() => setDeleteUserModal(true)}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(112, 28, 87, 1)",
    justifyContent: "center",
  },
  containerButtons: {
    flex: 1,
    marginTop: "5%",
    alignItems: "center",
  },
  buttons: {
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
