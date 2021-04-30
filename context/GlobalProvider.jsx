import * as React from "react";
import { createContext, useReducer, useContext } from "react";

// initial states
import authInitialState from "./initialStates/authInitialState";
import nuevaRecargaInitialState from "./initialStates/nuevaRecargaInitialState";

// reducers
import AuthReducer from "./Reducers/AuthReducer";
import NuevaRecargaReducer from "./Reducers/NuevaRecargaReducer";

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

  const [authState, authDispatch] = useReducer(AuthReducer, authInitialState);
  const [nuevaRecargaState, nuevaRecargaDispatch] = useReducer(NuevaRecargaReducer, nuevaRecargaInitialState)

  const value = {
    authState, 
    authDispatch
  }

  return (
    <GlobalContext.Provider value={{
      authState, 
      authDispatch,
      nuevaRecargaState,
      nuevaRecargaDispatch
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

//const useStore = () => useContext(StoreContext)[0];
//const useDispatch = () => useContext(StoreContext)[1];


//export { GlobalContext, useStore, useDispatch };
export {GlobalContext}
export default GlobalProvider;

// crear contexto: createContext
// consumir contexto: useContext(MyContext)
