import { actionTypes } from "../Actions/types";
import userInitialState from "../initialStates/userInitialState";

const SIGNUP = actionTypes.SIGNUP;
const RESTORE_USER = actionTypes.RESTORE_USER;
const SET_PRIZE_FOR_USER = actionTypes.SET_PRIZE_FOR_USER;

const UserReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case SIGNUP:
    case RESTORE_USER:
      //console.log("signup or restore case (in user reducer):", state);
      //console.log("action user", action.user);
      return { ...state, ...action.user };
    case SET_PRIZE_FOR_USER:
      // console.log("========================== reducer", action.prize);
      return {
        ...state,
        prize: action.prize
      };
    default:
      //console.log("Default case (in user reducer):", state);
      return state;
  }
};

export default UserReducer;
