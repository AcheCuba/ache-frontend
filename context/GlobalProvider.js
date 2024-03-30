import * as React from "react";
import { createContext, useReducer, useContext } from "react";

// initial states
import nuevaRecargaInitialState from "./initialStates/nuevaRecargaInitialState";
import socketInitialState from "./initialStates/socketInitialState";
import userInitialState from "./initialStates/userInitialState";
import interfaceInitialState from "./initialStates/interfaceInitialState";

// reducers
import NuevaRecargaReducer from "./Reducers/NuevaRecargaReducer";
import SocketReducer from "./Reducers/SocketReducer";
import UserReducer from "./Reducers/UserReducer";
import InterfaceReducer from "./Reducers/InterfaceReducer";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  // const [state, dispatch] = useReducer(reducer, initialState);

  /* const value = {
    state1, 
    dispatch1,
    state2,
    dispatch2,
    ...
  } */

  //const [authState, authDispatch] = useReducer(AuthReducer, authInitialState);

  const [userState, userDispatch] = useReducer(UserReducer, userInitialState);
  const [nuevaRecargaState, nuevaRecargaDispatch] = useReducer(
    NuevaRecargaReducer,
    nuevaRecargaInitialState
  );
  const [socketState, socketDispatch] = useReducer(
    SocketReducer,
    socketInitialState
  );
  const [interfaceState, interfaceDispatch] = useReducer(
    InterfaceReducer,
    interfaceInitialState
  );

  /*  const value = {
    authState,
    authDispatch
  }; */

  return (
    <GlobalContext.Provider
      value={{
        userState,
        userDispatch,
        nuevaRecargaState,
        nuevaRecargaDispatch,
        socketState,
        socketDispatch,
        interfaceState,
        interfaceDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

//const useStore = () => useContext(StoreContext)[0];
//const useDispatch = () => useContext(StoreContext)[1];

//export { GlobalContext, useStore, useDispatch };
export { GlobalContext };
export default GlobalProvider;

// crear contexto: createContext
// consumir contexto: useContext(MyContext)
