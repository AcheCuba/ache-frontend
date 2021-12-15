import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigationState } from "@react-navigation/native";
import * as React from "react";
import { useState } from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

// screens

import GameScreen from "../screens/Game/GameScreen";
//import CobrarPremioScreen from "../screens/Game/CobrarPremioScreen";

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

import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "../types";
import MultiplesContactosScreen from "../screens/NuevaRecarga/MultiplesContactosScreen";
import { forHorizontal } from "./forHorizontal";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import TabButtonNeo from "./TabButtonNeo";
import { GlobalContext } from "../context/GlobalProvider";
import { setIdioma } from "../context/Actions/actions";
import { storeData } from "../libs/asyncStorage.lib";

//const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = createBottomTabNavigator();

const isTabBarVisible = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "";
  if (routeName === "Juego") {
    return false;
  }

  return true;
};

export default function BottomTabNavigator({ navigation, route }) {
  //const colorScheme = useColorScheme();
  const state = useNavigationState((state) => state);
  //const [spa, setSpanish] = useState(true);
  const { userState, userDispatch } = React.useContext(GlobalContext);
  const idioma_definido = userState?.idioma;

  //Ej: activeTintColor: Colors[colorScheme].tint => dice a la app qué esquema de coloresusar según la conf del usuario

  return (
    <BottomTab.Navigator
      initialRouteName="Juego"
      tabBarOptions={{
        //activeTintColor: Colors.light.tint,
        activeTintColor: "rgb(255, 248, 0)",
        inactiveTintColor: "rgba(255,255,255,0.3)",
        keyboardHidesTabBar: true,
        labelStyle: { fontSize: 12, marginBottom: 15, marginTop: -10 },
        style: {
          justifyContent: "center",
          height: 110,
          // paddingTop: 3,
          allowFontScaling: true,
          backgroundColor: "rgba(112, 28, 87, 1)",
          color: "yellow",
          borderTopWidth: 0,
          // zIndex: 10,
          /*  paddingHorizontal: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30, */
          paddingBottom: 2,
          borderTopWidth: Platform.OS === "android" ? 1 : 0,
          borderTopColor:
            Platform.OS === "android" ? "rgba(10,10,10, 0.1)" : null,
          shadowColor: Platform.OS === "android" ? "#000" : "#1f0918",
          shadowOffset: { width: -3, height: -3 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          elevation: Platform.OS === "android" ? 30 : null,
        },
        tabStyle: {
          backgroundColor: "rgba(112, 28, 87, 1)",
        },
      }}
      // screenOptions={({ route }) => ({ tabBarVisible: isTabBarVisible(route) })}
    >
      <BottomTab.Screen
        name="Juego"
        component={GameNavigator}
        options={{
          /*  tabBarIcon: ({ color }) => (
            <TabBarIcon name="game-controller" color={color} />
          ), */
          tabBarIcon: () => <TabButtonNeo iconName="Ruleta" />,
          tabBarLabel: idioma_definido === "spa" ? "JUEGA" : "PLAY",
          tabBarVisible: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Juego"; // trampilla
            //console.log("route name", routeName);
            //const routeName = getFocusedRouteNameFromRoute(route);

            if (routeName === "Juego") {
              return false;
            }

            return true;
          })(route),
        }}
      />
      <BottomTab.Screen
        name="Nueva Recarga"
        component={NuevaRecargaNavigator}
        options={{
          tabBarIcon: () => <TabButtonNeo iconName="Recarga" />,

          tabBarLabel: idioma_definido === "spa" ? "RECARGA" : "RECHARGE",
          tabBarVisible: ((route) => {
            /* const routeName =
              getFocusedRouteNameFromRoute(route) ?? "MultiplesContactosScreen"; */
            let routeName;

            const myRoutes = state?.routes[0]?.state?.routes[1]?.state?.routes;
            if (myRoutes) {
              routeName = myRoutes[myRoutes.length - 1]?.name;
            }
            switch (routeName) {
              case "MultiplesContactosScreen":
                return false;
              case "RecargasDisponiblesScreen":
                return false;
              case "PrePagoScreen":
                return false;
              default:
                return true;
            }
          })(route),
        }}
      />
      <BottomTab.Screen
        name="Más"
        component={MoreNavigator}
        options={{
          tabBarIcon: () => <TabButtonNeo iconName="Settings" />,

          tabBarLabel: idioma_definido === "spa" ? "MÁS" : "MORE",
        }}
      />
      <BottomTab.Screen
        name="Language"
        component={LanguageNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            //setSpanish(!spa);
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
          /*  tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="flag"
              //color={spa ? "#005005" : "#8e0000"}
              color={color}
            />
          ), */
          tabBarIcon: () => <TabButtonNeo iconName="Idioma" />,
          tabBarLabel: idioma_definido === "spa" ? "IDIOMA" : "LANGUAGE",
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

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

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
