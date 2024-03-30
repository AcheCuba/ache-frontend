import React from "react";
import { View } from "react-native";
import { setShowInvisibleLoadData } from "../../../context/Actions/actions";
import { GlobalContext } from "../../../context/GlobalProvider";
import useCachedResources from "../../../hooks/useCachedResources";

const LoadingUserDataDummyModal = () => {
  useCachedResources();
  const { interfaceDispatch } = React.useContext(GlobalContext);
  React.useEffect(() => {
    interfaceDispatch(setShowInvisibleLoadData(false));
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0)",
      }}
    ></View>
  );
};
//701c57
export default LoadingUserDataDummyModal;
