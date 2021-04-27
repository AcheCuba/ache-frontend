import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { TabActions } from "@react-navigation/native";

const LanguageScren = ({ navigation }) => {
  //const navigation = useNavigation();
  const jumpToAction = TabActions.jumpTo("Juego");

  /* useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();
      console.log("dentro de use Effect");
      navigation.goBack();
    });

    //return unsubscribe;
  }, [navigation]) */ useFocusEffect(
    useCallback(() => {
      navigation.goBack();
      // navigation.dispatch(jumpToAction);
      // console.log("asdadasd");
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona el lenguaje</Text>
    </View>
  );
};

export default LanguageScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
