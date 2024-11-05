import { actionTypes } from "../Actions/types";

import interfaceInitialState from "../initialStates/interfaceInitialState";

const SET_SHOW_EXPIRED_PRIZE = actionTypes.SET_SHOW_EXPIRED_PRIZE;
const SET_SHOW_INVISIBLE_LOAD_DATA = actionTypes.SET_SHOW_INVISIBLE_LOAD_DATA;
const SET_IS_APP_OUTDATED = actionTypes.SET_IS_APP_OUTDATED;
const SET_ANDROID_LINK_UPDATE = actionTypes.SET_ANDROID_LINK_UPDATE;
const SET_IOS_LINK_UPDATE = actionTypes.SET_IOS_LINK_UPDATE;

const InterfaceReducer = (state = interfaceInitialState, action) => {
  switch (action.type) {
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
    case SET_IS_APP_OUTDATED:
      return {
        ...state,
        isAppOutdated: action.isOutdated,
      };

    case SET_IOS_LINK_UPDATE:
      return {
        ...state,
        iosLinkUpdate: action.iosLink,
      };

    case SET_ANDROID_LINK_UPDATE:
      return {
        ...state,
        androidLinkUpdate: action.androidLink,
      };

    default:
      //console.log("Default case (in user reducer):", state);
      return state;
  }
};

export default InterfaceReducer;
