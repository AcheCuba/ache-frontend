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
