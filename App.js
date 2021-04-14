import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import StoreProvider from "./context/StoreProvider";
import rootReducer from "./context/Reducers/rootReducer";

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
      <SafeAreaProvider>
        <StoreProvider rootReducer={rootReducer}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar backgroundColor="#ddd" style="light" />
        </StoreProvider>
      </SafeAreaProvider>
    );
  }
}
