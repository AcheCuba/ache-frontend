import * as React from "react";
import { createContext, useReducer, useContext } from "react";

// initial states
import nuevaRecargaInitialState from "./initialStates/nuevaRecargaInitialState";
import userInitialState from "./initialStates/userInitialState";

// reducers
import NuevaRecargaReducer from "./Reducers/NuevaRecargaReducer";
import UserReducer from "./Reducers/UserReducer";

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
        nuevaRecargaDispatch
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
