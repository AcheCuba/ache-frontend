import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

// screens
//import TabOneScreen from "../screens/TabOneScreen";
//import TabTwoScreen from "../screens/TabTwoScreen";
//import TestContactsScreen from "../screens/testContactsScreen";
import GameScreen from "../screens/Game/GameScreen";
import CobrarPremioScreen from "../screens/Game/CobrarPremioScreen";
import NuevaRecargaScreen from "../screens/NuevaRecarga/NuevaRecargaScreen";
import PagoScreen from "../screens/NuevaRecarga/PagoScreen";
import MoreScreen from "../screens/MoreScreen";
import LanguageScreen from "../screens/LanguageScreen";

import { BottomTabParamList, TabOneParamList, TabTwoParamList } from "../types";

//const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Juego"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Juego"
        component={GameNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Nueva Recarga"
        component={NuevaRecargaNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Más"
        component={MoreNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Lenguaje"
        component={LanguageNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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

function GameNavigator() {
  return (
    <GameStack.Navigator>
      <GameStack.Screen
        name="GameScreen"
        component={GameScreen}
        options={{ headerTitle: "Aché" }}
      />
      <GameStack.Screen
        name="NuevaRecargaScreen"
        component={NuevaRecargaScreen}
        options={{ headerTitle: "Nueva Recarga" }}
      />
      <GameStack.Screen
        name="CobrarPremioScreen"
        component={CobrarPremioScreen}
        options={{ headerTitle: "Cobrar Premio" }}
      />
    </GameStack.Navigator>
  );
}

const NuevaRecargaStack = createStackNavigator();

function NuevaRecargaNavigator() {
  return (
    <NuevaRecargaStack.Navigator>
      <NuevaRecargaStack.Screen
        name="NuevaRecargaScreen"
        component={NuevaRecargaScreen}
        options={{ headerTitle: "Nueva Recarga" }}
      />
      <NuevaRecargaStack.Screen
        name="PagoScreen"
        component={PagoScreen}
        options={{ headerTitle: "Pago Online" }}
      />
    </NuevaRecargaStack.Navigator>
  );
}

const MoreStack = createStackNavigator();

function MoreNavigator() {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{ headerTitle: "Más" }}
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
