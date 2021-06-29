/* import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import GlobalProvider, { GlobalContext } from "./context/GlobalProvider";
// import rootReducer from "./context/Reducers/rootReducer";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

export default function App() {
  const isLoadingComplete = useCachedResources();
  //const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GlobalProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar backgroundColor="transparent" style="light" />
        </SafeAreaProvider>
      </GlobalProvider>
    );
  }
} */

import GlobalProvider from "./context/GlobalProvider";
import MainApp from "./screens/app";
import React from "react";

const App = () => {
  return (
    <GlobalProvider>
      <MainApp />
    </GlobalProvider>
  );
};

export default App;
