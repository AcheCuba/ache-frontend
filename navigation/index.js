import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import NotFoundScreen from "../screens/NotFoundScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import SignupScreen from "../screens/SignupScreen";

import { RootStackParamList } from "../types";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import { GlobalContext, useStore } from "../context/GlobalProvider";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
// const Stack = createStackNavigator<RootStackParamList>();
const Stack = createStackNavigator();

//const onBoardingConsumed = true;

function RootNavigator() {
  const { authState } = React.useContext(GlobalContext);
  const { registered } = authState;

  console.log("authState", authState);
  console.log("registered", registered);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!registered ? (
        <>
          <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator} />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

/*   <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onBoardingConsumed && (
        <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
      )}
      {!isLogged && <Stack.Screen name="Login" component={LoginScreen} />}
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator> */
