import { actionTypes } from "../Actions/types";
import userInitialState from "../initialStates/userInitialState";

const SIGNUP = actionTypes.SIGNUP;
const RESTORE_USER = actionTypes.RESTORE_USER;
const SET_PRIZE = actionTypes.SET_PRIZE;

const UserReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case SIGNUP:
    case RESTORE_USER:
      //console.log("signup or restore case (in user reducer):", state);
      //console.log("action user", action.user);
      return { ...state, ...action.user };
      break;
    case SET_PRIZE:
      return {
        ...state,
        prize: action.prize
      };
      break;
    default:
      //console.log("Default case (in user reducer):", state);
      return state;
  }
};

export default UserReducer;
