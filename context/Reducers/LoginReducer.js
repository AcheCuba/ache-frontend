import { actionTypes } from "../Actions/types";
import { initialStore } from "../StoreProvider";

const LOGIN = actionTypes.LOGIN;

const LoginReducer = (state = initialStore.user, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, user: { isLogged: true } };

    default:
      return state;
  }
};

export default LoginReducer;
