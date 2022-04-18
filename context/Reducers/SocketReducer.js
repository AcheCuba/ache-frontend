import { actionTypes } from "../Actions/types";
import socketInitialState from "../initialStates/socketInitialState";

const OPEN_SOCKET = actionTypes.OPEN_SOCKET;
const CLOSE_SOCKET = actionTypes.CLOSE_SOCKET;
const SET_SOCKET_ID = actionTypes.SET_SOCKET_ID;
const SET_UPDATE_COMPLETED = actionTypes.SET_UPDATE_COMPLETED;

const SET_TRANSACCIONES_NORMALES_ESPERADAS =
  actionTypes.SET_TRANSACCIONES_NORMALES_ESPERADAS;
const SET_TRANSACCIONES_PREMIO_ESPERADAS =
  actionTypes.SET_TRANSACCIONES_PREMIO_ESPERADAS;
const SET_TRANSACCIONES_NORMALES_RESULTADO =
  actionTypes.SET_TRANSACCIONES_NORMALES_RESULTADO;
const SET_TRANSACCIONES_PREMIO_RESULTADO =
  actionTypes.SET_TRANSACCIONES_PREMIO_RESULTADO;
const SET_NEW_TRANSACCION_NORMAL_RESULTADO =
  actionTypes.SET_NEW_TRANSACCION_NORMAL_RESULTADO;
const SET_NEW_TRANSACCION_PREMIO_RESULTADO =
  actionTypes.SET_NEW_TRANSACCION_PREMIO_RESULTADO;

//const SET_TRANSACCIONES_RESULTADO = actionTypes.SET_TRANSACCIONES_RESULTADO;
//const SET_NEW_TRANSACCION_RESULTADO = actionTypes.SET_NEW_TRANSACCION_RESULTADO;

const SocketReducer = (state = socketInitialState, action) => {
  switch (action.type) {
    case OPEN_SOCKET:
      return {
        ...state,
        socketIsOpen: true,
      };
    case CLOSE_SOCKET:
      //console.log("close socket - reducer");
      return {
        ...state,
        socketIsOpen: false,
      };
    case SET_SOCKET_ID:
      return {
        ...state,
        socketId: action.socketId,
      };
    case SET_TRANSACCIONES_NORMALES_ESPERADAS:
      return {
        ...state,
        transacciones_normales_esperadas: action.transactions,
      };
    case SET_TRANSACCIONES_PREMIO_ESPERADAS:
      return {
        ...state,
        transacciones_premio_esperadas: action.transactions,
      };
    case SET_TRANSACCIONES_NORMALES_RESULTADO:
      return {
        ...state,
        transacciones_normales_resultado: action.transactions,
      };

    case SET_TRANSACCIONES_PREMIO_RESULTADO:
      return {
        ...state,
        transacciones_premio_resultado: action.transactions,
      };

    case SET_NEW_TRANSACCION_NORMAL_RESULTADO:
      return {
        ...state,
        transacciones_normales_resultado: [
          ...state.transacciones_normales_resultado,
          action.newTransaction,
        ],
      };
    case SET_NEW_TRANSACCION_PREMIO_RESULTADO:
      return {
        ...state,
        transacciones_premio_resultado: [
          ...state.transacciones_premio_resultado,
          action.newTransaction,
        ],
      };

    case SET_UPDATE_COMPLETED:
      return {
        ...state,
        globalUpdateCompleted: action.globalUpdateCompleted,
      };
  }
};

export default SocketReducer;
