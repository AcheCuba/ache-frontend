import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import GlobalProvider from "./context/GlobalProvider";
// import rootReducer from "./context/Reducers/rootReducer";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GlobalProvider>
        <SafeAreaProvider>
          {/*  <Navigation colorScheme={colorScheme} /> */}
          <Navigation />
          <StatusBar backgroundColor="#ddd" style="light" />
        </SafeAreaProvider>
      </GlobalProvider>
    );
  }
}
