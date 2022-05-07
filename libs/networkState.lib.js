import * as React from "react";
import * as Network from "expo-network";

export const getNetworkState = async () => {
  const networkState = await Network.getNetworkStateAsync();
  //console.log(networkState);
  return networkState;
};
