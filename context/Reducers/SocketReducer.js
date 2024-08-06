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
const SET_NEW_TRANSACCION_NORMAL_FALLIDA =
  actionTypes.SET_NEW_TRANSACCION_NORMAL_FALLIDA;
const SET_NEW_TRANSACCION_PREMIO_FALLIDA =
  actionTypes.SET_NEW_TRANSACCION_PREMIO_FALLIDA;
const SET_NEW_TRANSACCION_PREMIO_COMPLETADA =
  actionTypes.SET_NEW_TRANSACCION_PREMIO_COMPLETADA;
const SET_NEW_TRANSACCION_NORMAL_COMPLETADA =
  actionTypes.SET_NEW_TRANSACCION_NORMAL_COMPLETADA;
const RESET_SOCKET_STATE = actionTypes.RESET_SOCKET_STATE;
const SET_UPDATE_NORMALES_COMPLETED = actionTypes.SET_UPDATE_NORMALES_COMPLETED;

//const SET_TRANSACCIONES_RESULTADO = actionTypes.SET_TRANSACCIONES_RESULTADO;
//const SET_NEW_TRANSACCION_RESULTADO = actionTypes.SET_NEW_TRANSACCION_RESULTADO;

const SocketReducer = (state = socketInitialState, action) => {
  switch (action.type) {
    case RESET_SOCKET_STATE:
      console.log("socket reset state");
      return {
        ...state,
        transacciones_normales_completadas: [],
        transacciones_normales_fallidas: [],
        transacciones_premio_completadas: [],
        transacciones_premio_fallidas: [],
        // ===
        transacciones_normales_esperadas: [],
        transacciones_premio_esperadas: [],
      };

    case SET_NEW_TRANSACCION_NORMAL_COMPLETADA:
      return {
        ...state,
        transacciones_normales_completadas: [
          ...state.transacciones_normales_completadas,
          action.transaccion,
        ],
      };

    case SET_NEW_TRANSACCION_PREMIO_COMPLETADA:
      return {
        ...state,
        transacciones_premio_completadas: [
          ...state.transacciones_premio_completadas,
          action.transaccion,
        ],
      };

    case SET_NEW_TRANSACCION_NORMAL_FALLIDA:
      return {
        ...state,
        transacciones_normales_fallidas: [
          ...state.transacciones_normales_fallidas,
          action.transaccion,
        ],
      };

    case SET_NEW_TRANSACCION_PREMIO_FALLIDA:
      return {
        ...state,
        transacciones_premio_fallidas: [
          ...state.transacciones_premio_fallidas,
          action.transaccion,
        ],
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
  }
};

export default SocketReducer;
