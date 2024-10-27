import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import NotFoundScreen from "../screens/AppOutdatedScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";
import SignupScreenUptd from "../screens/SignupScreenUptd";

import BottomTabNavigator from "./BottomTabNavigator";
import { GlobalContext } from "../context/GlobalProvider";

import "react-native-gesture-handler";
import TfaScreen from "../screens/TfaScreen";

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
    <NavigationContainer
    //linking={LinkingConfiguration}
    //theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
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
  const { userState } = React.useContext(GlobalContext);

  // console.log(userState)
  // console.log("userState index.js", userState);
  // console.log("token", userState.token);

  /* const [userToken, setUserToken] = React.useState(undefined);

  React.useEffect(() => {
    if (userState.token !== undefined) {
      setUserToken(userState.token);
    }
  }, [userState]); */

  //Alert.alert(`token: ${userState.token}`)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userState.token !== undefined ? (
        <>
          <Stack.Screen name="Root" component={BottomTabNavigator} />
          {/* <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Oops!" }}
          /> */}
        </>
      ) : (
        <>
          <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
          <Stack.Screen name="Signup" component={SignupScreenUptd} />
          <Stack.Screen name="Tfa" component={TfaScreen} />
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
