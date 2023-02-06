// import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigationState } from "@react-navigation/native";
import * as React from "react";

import 'react-native-gesture-handler';

// screens

import GameScreen from "../screens/Game/GameScreen";
import NuevaRecargaScreen from "../screens/NuevaRecarga/NuevaRecargaScreen";
import RecargasDisponiblesScreen from "../screens/NuevaRecarga/RecargasDisponibesScreen";
import PagoScreen from "../screens/NuevaRecarga/PagoScreen";
import PrePagoScreen from "../screens/NuevaRecarga/PrePagoScreen";
import PagoCompletadoScreen from "../screens/NuevaRecarga/PagoCompletadoScreen";
import PagoErrorScreen from "../screens/NuevaRecarga/PagoErrorScreen";
import MoreScreen from "../screens/More/MoreScreen";
import AboutUsScreen from "../screens/More/AboutUsScreen";
import ModoUsoScreen from "../screens/More/ModoUsoScreen";
import PremioScreen from "../screens/More/PremioScreen";
import PrivacidadScreen from "../screens/More/PrivacidadScreen";
import TermUsoScreen from "../screens/More/TermUsoScreen";
import LanguageScreen from "../screens/LanguageScreen";
import MultiplesContactosScreen from "../screens/NuevaRecarga/MultiplesContactosScreen";
import { forHorizontal } from "./forHorizontal";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import TabButtonNeo from "./TabButtonNeo";
import { GlobalContext } from "../context/GlobalProvider";
import { setIdioma } from "../context/Actions/actions";
import { storeData } from "../libs/asyncStorage.lib";
import { View } from "react-native";
import NeuButton  from "../libs/neu_element/NeuButton";

import PremioDescription from "../screens/More/PremioDescription";
import { Audio } from "expo-av";

//const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = createBottomTabNavigator();

/* const isTabBarVisible = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "";
  if (routeName === "Juego") {
    return false;
  }

  return true;
}; */

export default function BottomTabNavigator({ navigation, route }) {
  //const colorScheme = useColorScheme();
  const state = useNavigationState((state) => state);
  //const [spa, setSpanish] = useState(true);
  const { userState, userDispatch } = React.useContext(GlobalContext);
  const idioma_definido = userState?.idioma;
  const [soundTabNav, setSoundTabNav] = React.useState();

  React.useEffect(() => {
    return soundTabNav
      ? () => {
          soundTabNav.unloadAsync();
        }
      : undefined;
  }, [soundTabNav]);

  async function playSoundTabNav() {
    //console.log("play sound");
    const _sound = new Audio.Sound();
    await _sound.loadAsync(require("../assets/Sonidos/tab_nav.wav"), {
      shouldPlay: true,
    });
    await _sound.setPositionAsync(0);
    await _sound.playAsync();
    setSoundTabNav(_sound);
  }

  const TabBarVisibility = () => {
    let routeName;
    const myRoutes = state?.routes[0]?.state?.routes[1]?.state?.routes;
    if (myRoutes) {
      routeName = myRoutes[myRoutes.length - 1]?.name;
    }
    switch (routeName) {
      case "MultiplesContactosScreen":
      //return false;
      case "RecargasDisponiblesScreen":
      //return false;
      case "PrePagoScreen":
      //return false;
      case "PagoScreen":
      case "PagoCompletadoScreen":
      case "PagoErrorScreen":
        return 'none';
      default:
        return 'flex';
    }
  }

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <BottomTab.Navigator
      //tabBar={(props) => <MyTabBar {...props} />}
      initialRouteName="Juego"
      screenOptions={{
        //activeTintColor: Colors.light.tint,
        tabBarActiveTintColor: "rgb(255, 248, 0)",
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
        tabBarHideOnKeyboard: true,
        //labelStyle: { fontSize: 12, marginBottom: 15, marginTop: -10 },
        tabBarLabelStyle: {
          fontSize: 12,
          position: "absolute",
          bottom: 0,
          marginBottom: -23,
          flex: 1,
          width: 70,
        },
        indicatorStyle: {
          backgroundColor: "transparent",
        },
    
        tabBarStyle: {
            display: TabBarVisibility(),
            justifyContent: "center",
            alignItems: "center",
            height: 100,
            //paddingTop: 3,
            allowFontScaling: true,
            backgroundColor: "rgba(112, 28, 87, 1)",
            borderTopWidth: 0,
            // zIndex: 10,
            paddingHorizontal: 20,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            paddingBottom: Platform.OS === "android" ? 10 : 18,
            //borderTopColor:
            //  Platform.OS === "android" ? "rgba(10,10,10, 0.1)" : null,
            shadowColor: Platform.OS === "android" ? null : "#1f0918",
            shadowOffset:
              Platform.OS === "android" ? null : { width: -6, height: -6 },
            shadowOpacity: Platform.OS === "android" ? null : 0.6,
            shadowRadius: Platform.OS === "android" ? null : 7,
            elevation: Platform.OS === "android" ? 200 : null,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
        }
      }}

    >
      <BottomTab.Screen
        name="Juego"
        component={GameNavigator}
        listeners={{
          tabPress: (e) => {
            //console.log("press home");
            playSoundTabNav();
          },
        }}
        options={{
          headerShown: false,
          tabBarIcon: () => <TabButtonNeo iconName="Ruleta" />,
          tabBarButton: (props) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 15,
                  flex: 1,
                }}
              >
                <NeuButton
                  {...props}
                  width={50}
                  height={50}
                  color="#701c57"
                  borderRadius={25}
                />
              </View>
            );
          }, 

          tabBarLabel: idioma_definido === "spa" ? "JUEGA" : "PLAY",
        }}
      />
     <BottomTab.Screen
        name="Nueva Recarga"
        component={NuevaRecargaNavigator}
        listeners={{
          tabPress: (e) => {
            playSoundTabNav();
          },
        }}
        options={{
          headerShown: false,
          tabBarIcon: () => <TabButtonNeo iconName="Recarga" />,
          tabBarButton: (props) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 15,
                  flex: 1,
                }}
              >
                <NeuButton
                  {...props}
                  width={50}
                  height={50}
                  color="#701c57"
                  borderRadius={25}
                />
              </View>
            );
          },
          tabBarLabel: idioma_definido === "spa" ? "RECARGA" : "RECHARGE",
        }}
      />
      <BottomTab.Screen
        name="Más"
        component={MoreNavigator}
        listeners={{
          tabPress: (e) => {
            playSoundTabNav();
          },
        }}
        options={{
          tabBarIcon: () => <TabButtonNeo iconName="Settings" />,
          headerShown: false,
          tabBarButton: (props) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 15,
                  flex: 1,
                }}
              >
                <NeuButton
                  {...props}
                  width={50}
                  height={50}
                  color="#701c57"
                  borderRadius={25}
                />
              </View>
            );
          },
          tabBarLabel: idioma_definido === "spa" ? "MÁS" : "MORE",
          /* tabBarVisible: ((route) => {
            //const routeName =
            //  getFocusedRouteNameFromRoute(route) ?? "MultiplesContactosScreen"; 
            let routeName;

            const myRoutes = state?.routes[0]?.state?.routes[2]?.state?.routes;
            if (myRoutes) {
              routeName = myRoutes[myRoutes.length - 1]?.name;
            }
            //console.log("new", state?.routes[0]?.state.routes[2].state?.routes);

            switch (routeName) {
              case "PremioDescription":
                return false;
              default:
                return true;
            }
          })(route), */
        }}
      />
      <BottomTab.Screen
        name="Language"
        component={LanguageNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            playSoundTabNav();
            if (idioma_definido === "spa") {
              userDispatch(setIdioma("eng"));

              storeData("user", {
                ...userState,
                idioma: "eng",
              });
            }

            if (idioma_definido === "eng") {
              userDispatch(setIdioma("spa"));

              storeData("user", {
                ...userState,
                idioma: "spa",
              });
            }

            // Do something with the `navigation` object
            //navigation.goBack();
          },
        })}
        options={{
          //  tabBarIcon: ({ color }) => (
          //  <TabBarIcon
          //    name="flag"
          //    //color={spa ? "#005005" : "#8e0000"}
          //    color={color}
          //  />
          // ),
          headerShown: false,
          tabBarIcon: () => <TabButtonNeo iconName="Idioma" />,
          tabBarLabel: idioma_definido === "spa" ? "IDIOMA" : "LANGUAGE",
          tabBarButton: (props) => {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 15,
                  flex: 1,
                }}
              >
                <NeuButton
                  {...props}
                  width={50}
                  height={50}
                  color="#701c57"
                  borderRadius={25}
                />
              </View>
            );
          },
          //tabBarLabel: spa ? "INGLÉS" : "SPANISH",
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/

/* function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
} */

/* function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
} */

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
//const TabOneStack = createStackNavigator<TabOneParamList>();

const GameStack = createStackNavigator();

GameStack.navigationOptions = ({ navigation }) => {
  /*  let tabBarVisible = true;
  for (let i = 0; i < navigation.state.routes.length; i++) {
    if (navigation.state.routes[i].routeName == "Juego") {
      tabBarVisible = false;
    }
  }
  return {
    tabBarVisible,
  }; */
};

function GameNavigator({ navigation, route }) {
  /*   React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName == "Juego") {
      console.log(routeName);
      navigation.setOptions({ tabBarVisible: false });
    } else {
      navigation.setOptions({ tabBarVisible: true });
    }
  }, [navigation, route]); */
  return (
    <GameStack.Navigator>
      <GameStack.Screen
        name="Juego"
        component={GameScreen}
        options={{
          headerShown: false,
          headerTitle: "Aché",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
    </GameStack.Navigator>
  );
}

const NuevaRecargaStack = createStackNavigator();

function NuevaRecargaNavigator({ navigation, route }) {
  return (
    <NuevaRecargaStack.Navigator>
      <NuevaRecargaStack.Screen
        name="NuevaRecargaScreen"
        component={NuevaRecargaScreen}
        options={{
          //headerTitle: "Nueva Recarga",
          headerShown: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />

      <NuevaRecargaStack.Screen
        name="RecargasDisponiblesScreen"
        component={RecargasDisponiblesScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="PrePagoScreen"
        component={PrePagoScreen}
        options={{
          headerShown: false,
          gestureDirection: "horizontal",
          gestureEnabled: false,
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="PagoScreen"
        component={PagoScreen}
        options={{
          headerShown: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="PagoCompletadoScreen"
        component={PagoCompletadoScreen}
        options={{
          headerShown: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="PagoErrorScreen"
        component={PagoErrorScreen}
        options={{
          headerShown: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="MultiplesContactosScreen"
        component={MultiplesContactosScreen}
        options={{
          headerShown: false,
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
    </NuevaRecargaStack.Navigator>
  );
}

const MoreStack = createStackNavigator();

function MoreNavigator({ navigation, route }) {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          headerShown: false,
          //headerTitle: "Más",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{
          headerShown: false,

          headerTitle: "Sobre Nosotros",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="ModoUsoScreen"
        component={ModoUsoScreen}
        options={{
          headerShown: false,

          headerTitle: "Modo de Uso",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="PrivacidadScreen"
        component={PrivacidadScreen}
        options={{
          headerShown: false,

          headerTitle: "Política de Privacidad",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="TermUsoScreen"
        component={TermUsoScreen}
        options={{
          headerShown: false,

          headerTitle: "Términos de Uso",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="PremioScreen"
        component={PremioScreen}
        options={{
          headerShown: false,

          headerTitle: "Premios del Mes",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="PremioDescription"
        component={PremioDescription}
        options={{
          headerShown: false,

          headerTitle: "",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
    </MoreStack.Navigator>
  );
}

const LanguageStack = createStackNavigator();

function LanguageNavigator() {
  return (
    <LanguageStack.Navigator>
      <LanguageStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerTitle: "Lenguaje" }}
      />
    </LanguageStack.Navigator>
  );
}
