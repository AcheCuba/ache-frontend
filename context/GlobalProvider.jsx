import * as React from "react";
import { createContext, useReducer, useContext } from "react";

// initial states
import authInitialState from "./initialStates/authInitialState";

// reducers
import AuthReducer from "./Reducers/AuthReducer";

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

  const value = {
    authState, 
    authDispatch
  }

  return (
    <GlobalContext.Provider value={{
      authState, 
      authDispatch
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useStore = () => useContext(StoreContext)[0];
const useDispatch = () => useContext(StoreContext)[1];


export { GlobalContext, useStore, useDispatch };
export default GlobalProvider;

// crear contexto: createContext
// consumir contexto: useContext(MyContext)
