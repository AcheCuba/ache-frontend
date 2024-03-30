import { actionTypes } from "../Actions/types";

import interfaceInitialState from "../initialStates/interfaceInitialState";

const SET_SHOW_HAS_PENDING_PRIZE = actionTypes.SET_SHOW_HAS_PENDING_PRIZE;
const SET_SHOW_EXPIRED_PRIZE = actionTypes.SET_SHOW_EXPIRED_PRIZE;
const SET_SHOW_INVISIBLE_LOAD_DATA = actionTypes.SET_SHOW_INVISIBLE_LOAD_DATA;

const InterfaceReducer = (state = interfaceInitialState, action) => {
  switch (action.type) {
    case SET_SHOW_HAS_PENDING_PRIZE:
      return {
        ...state,
        showHasPendingPrize: action.isPending,
      };
    case SET_SHOW_EXPIRED_PRIZE:
      return {
        ...state,
        showExpiredPrize: action.isExpired,
      };
    case SET_SHOW_INVISIBLE_LOAD_DATA:
      return {
        ...state,
        showInvisibleLoadData: action.isNewUser,
      };
    default:
      //console.log("Default case (in user reducer):", state);
      return state;
  }
};

export default InterfaceReducer;
