import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import GlobalProvider, { GlobalContext } from "../context/GlobalProvider";
// import rootReducer from "./context/Reducers/rootReducer";

import useCachedResources from "../hooks/useCachedResources";
//import useColorScheme from "../hooks/useColorScheme";
import Navigation from "../navigation";

export default function MainApp() {
  const isLoadingComplete = useCachedResources();
  //const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        {/*  <Navigation colorScheme={colorScheme} /> */}
        <Navigation />
        <StatusBar backgroundColor="transparent" style="light" />
      </SafeAreaProvider>
    );
  }
}
