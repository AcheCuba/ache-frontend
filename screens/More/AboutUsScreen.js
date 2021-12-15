import React from "react";
import { Dimensions } from "react-native";
import { Linking, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CommonHeader from "../../components/CommonHeader";

const { width, height } = Dimensions.get("screen");
const marginGlobal = width / 10;

const AboutUsScreen = ({ navigation }) => {
  /* React.useEffect(() => {
    const unsubs = navigation.addListener("beforeRemove", (e) => {
      console.log("yep");
      //console.log(navigation);
      e.preventDefault();
    });
    return unsubs;
  }, [navigation]); */

  return (
    <>
      <CommonHeader
        width={width}
        height={height}
        _onPress={() => navigation.navigate("MoreScreen")}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "rgba(112, 28, 87, 1)",
        }}
      >
        <View style={styles.container}>
          <View style={{ flex: 1, marginVertical: 10, marginHorizontal: 20 }}>
            <ScrollView>
              <Text style={styles.title}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                {"\n"} {"\n"}
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: "#fff800",
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 10,
                  }}
                  onPress={() => Linking.openURL("http://google.com")}
                >
                  ... Saber más
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(112, 28, 87, 1)",
    marginHorizontal: marginGlobal,
  },
  title: {
    fontSize: 20,
    //fontWeight: "bold",
    fontStyle: "italic",
    color: "#eee",
  },
});
