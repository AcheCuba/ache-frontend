import { actionTypes } from "../Actions/types";
import userInitialState from "../initialStates/userInitialState";

const SIGNUP = actionTypes.SIGNUP;
const RESTORE_USER = actionTypes.RESTORE_USER;
const SET_PRIZE_FOR_USER = actionTypes.SET_PRIZE_FOR_USER;
const SET_IDIOMA = actionTypes.SET_IDIOMA;
const SET_COUNTRY_FOR_USER = actionTypes.SET_COUNTRY_FOR_USER;
const SET_OPERATOR_FOR_USER = actionTypes.SET_OPERATOR_FOR_USER;
const SET_HAS_PENDING_PRIZE = actionTypes.SET_HAS_PENDING_PRIZE;
const SET_USER_RECUPERADO = actionTypes.SET_USER_RECUPERADO;

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
        prize: action.prize,
      };
    case SET_IDIOMA:
      return {
        ...state,
        idioma: action.idioma,
      };
    case SET_COUNTRY_FOR_USER:
      return {
        ...state,
        country: action.country,
      };
    case SET_OPERATOR_FOR_USER:
      //console.log("action", action);
      const nuevo_operador = action.operator;
      return {
        ...state,
        operator: {
          ...state.operator,
          name: nuevo_operador.name,
          id: nuevo_operador.id,
        },
      };
    case SET_HAS_PENDING_PRIZE:
      return {
        ...state,
        hasPendingPrize: action.isPending,
      };

    case SET_USER_RECUPERADO:
      return {
        ...state,
        isUserRecuperado: action.isUserRecuperado,
      };

    default:
      //console.log("Default case (in user reducer):", state);
      return state;
  }
};

export default UserReducer;
