import GlobalProvider from "./context/GlobalProvider";
import MainAppWrapper from "./screens/app";
import { RootSiblingParent } from "react-native-root-siblings";
import React from "react";
//import * as Sentry from "sentry-expo";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

/* Sentry.init({
  dsn: "https://7d4121e01a674daaa645b8c483a6f48d@o4504601837109248.ingest.sentry.io/4504601850216448",
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
}); */

const App = () => {
  return (
    <GlobalProvider>
      <RootSiblingParent>
        <MainAppWrapper />
      </RootSiblingParent>
    </GlobalProvider>
  );
};

export default App;
