import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

// screens
//import TabOneScreen from "../screens/TabOneScreen";
//import TabTwoScreen from "../screens/TabTwoScreen";
//import TestContactsScreen from "../screens/testContactsScreen";
import GameScreen from "../screens/Game/GameScreen";
import CobrarPremioScreen from "../screens/Game/CobrarPremioScreen";

import NuevaRecargaScreen from "../screens/NuevaRecarga/NuevaRecargaScreen";
import RecargasDisponiblesScreen from "../screens/NuevaRecarga/RecargasDisponibesScreen";
import PagoScreen from "../screens/NuevaRecarga/PagoScreen";

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
  const [spa, setSpanish] = useState(true);
  //Ej: activeTintColor: Colors[colorScheme].tint => dice a la app qué esquema de coloresusar según la conf del usuario
  /*   React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Juego") {
      navigation.setOptions({ tabBarVisible: false });
    } else {
      // navigation.setOptions({ tabBarVisible: true });
    }
  }, [navigation, route]); */
  return (
    <BottomTab.Navigator
      initialRouteName="Juego"
      tabBarOptions={{
        activeTintColor: Colors.light.tint,
        keyboardHidesTabBar: true,
        labelStyle: { fontSize: 13, marginBottom: -5 },
        tabStyle: { height: 40, paddingTop: 3 },
      }}
      // screenOptions={({ route }) => ({ tabBarVisible: isTabBarVisible(route) })}
    >
      <BottomTab.Screen
        name="Juego"
        component={GameNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="game-controller" color={color} />
          ),
          tabBarVisible: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "Juego"; // trampilla
            console.log("route name", routeName);
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
          tabBarIcon: ({ color }) => <TabBarIcon name="card" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Más"
        component={MoreNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="information-circle" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name={spa ? "Inglés" : "Spanish"}
        component={LanguageNavigator}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            setSpanish(!spa);

            // Do something with the `navigation` object
            //navigation.goBack();
          },
        })}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="flag" color={spa ? "#005005" : "#8e0000"} />
          ),
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
          headerTitle: "Aché",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <GameStack.Screen
        name="CobrarPremioScreen"
        component={CobrarPremioScreen}
        options={{
          headerTitle: "Cobrar Premio",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <GameStack.Screen
        name="NuevaRecargaNavigator"
        component={NuevaRecargaNavigator}
        // for nesting
        options={{
          headerShown: false,
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
        name="Nueva Recarga"
        component={NuevaRecargaScreen}
        options={{
          headerTitle: "Nueva Recarga",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="RecargasDisponiblesScreen"
        component={RecargasDisponiblesScreen}
        options={{
          headerTitle: "Recargas disponibles",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="PagoScreen"
        component={PagoScreen}
        options={{
          headerTitle: "Pago Online",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <NuevaRecargaStack.Screen
        name="MultiplesContactosScreen"
        component={MultiplesContactosScreen}
        options={{
          headerTitle: "Contactos",
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
          headerTitle: "Más",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="AboutUsScreen"
        component={AboutUsScreen}
        options={{
          headerTitle: "Sobre Nosotros",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="ModoUsoScreen"
        component={ModoUsoScreen}
        options={{
          headerTitle: "Modo de Uso",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="PrivacidadScreen"
        component={PrivacidadScreen}
        options={{
          headerTitle: "Política de Privacidad",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="TermUsoScreen"
        component={TermUsoScreen}
        options={{
          headerTitle: "Términos de Uso",
          gestureDirection: "horizontal",
          cardStyleInterpolator: forHorizontal,
        }}
      />
      <MoreStack.Screen
        name="PremioScreen"
        component={PremioScreen}
        options={{
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
