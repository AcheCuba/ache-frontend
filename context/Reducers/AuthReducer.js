import { actionTypes } from "../Actions/types";
import authInitialState from "../initialStates/authInitialState";

const SIGNUP = actionTypes.SIGNUP;

const AuthReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case SIGNUP:
      console.log("signup case (in reducer):", state);
      return { ...state, registered: true };
    default:
      console.log("Default case (in reducer):", state);
      return state;
  }
};

export default AuthReducer;
