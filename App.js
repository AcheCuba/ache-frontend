import GlobalProvider from "./context/GlobalProvider";
import MainApp from "./screens/app";
import { RootSiblingParent } from "react-native-root-siblings";
import React from "react";

const App = () => {
  return (
    <GlobalProvider>
      <RootSiblingParent>
        <MainApp />
      </RootSiblingParent>
    </GlobalProvider>
  );
};

export default App;
