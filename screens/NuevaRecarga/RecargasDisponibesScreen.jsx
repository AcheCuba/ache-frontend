import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { NeuButton, NeuView } from "react-native-neu-element";
import CommonHeader from "../../components/CommonHeader";
import CommonNeuButton from "../../components/CommonNeuButton";
import CustomButton from "../../components/CustomButton";

const { width, height } = Dimensions.get("screen");

const RecargasDisponiblesScreen = ({ navigation }) => {
  const [pressed, setPressed] = React.useState("");
  const recargas = [
    "Recarga 1",
    "Recarga 2",
    "Recarga 3",
    "Recarga 4",
    "Recarga 5",
    "Recarga 6",
    "Recarga 7",
    "Recarga 8",
    "Recarga 9",
  ];

  return (
    <>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => {
          navigation.jumpTo("Nueva Recarga", {
            screen: "Nueva Recarga",
          });
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            {recargas.map((rec, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setPressed(rec);
                  }}
                  style={{
                    width: width / 1.3,
                    height: height / 8,
                    marginBottom: 25,
                    backgroundColor:
                      pressed === rec ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0)",
                  }}
                  key={index}
                >
                  <NeuView
                    color="#701c57"
                    width={width / 1.3}
                    height={height / 8}
                    borderRadius={10}
                    inset={pressed === rec ? true : false}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 0,
                        width: width / 1.3,
                        borderRadius: 10,
                        backgroundColor:
                          pressed === rec ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0)",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          textTransform: "uppercase",
                          color: "#01f9d2",
                        }}
                      >
                        {rec}
                      </Text>
                    </View>
                  </NeuView>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: "#701c57",
          alignItems: "center",
          justifyContent: "center",
          height: height / 7,
          elevation: 30,
          // TODO: shadow on iOS
        }}
      >
        <CommonNeuButton
          text="continuar"
          screenWidth={width}
          onPress={() => navigation.navigate("PrePagoScreen")}
        />
      </View>
    </>
  );
};

export default RecargasDisponiblesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#701c57",
    //alignItems: "center",
    //justifyContent: "flex-start",
  },
  innerContainer: {
    backgroundColor: "#701c57",
    flex: 1,
    marginTop: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    width: "90%",
    marginTop: 10,
  },
});

/* 
 <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 1"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 2"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 3"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 4"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 5"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 6"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 7"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
            <View style={styles.button}>
              <CustomButton
                customStyle={customStyle}
                title="Recarga 8"
                onPress={() => navigation.navigate("PagoScreen")}
              />
            </View>
*/
