import * as React from "react";
import { createContext, useReducer, useContext } from "react";

export const initialStore = {
  user: {
    isLogged: false,
  },
};
const StoreContext = createContext();

const StoreProvider = ({ children, rootReducer }) => {
  const [store, dispatch] = useReducer(rootReducer, initialStore);

  return (
    <StoreContext.Provider value={[store, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => useContext(StoreContext)[0];
const useDispatch = () => useContext(StoreContext)[1];

export { useStore, useDispatch };
export default StoreProvider;

// crear contexto: createContext
// consumir contexto: useContext(MyContext)
