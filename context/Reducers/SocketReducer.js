import { actionTypes } from "../Actions/types";
import socketInitialState from "../initialStates/socketInitialState";

const SET_SOCKET_ID = actionTypes.SET_SOCKET_ID;
const SET_TRANSACCIONES_NORMALES_ESPERADAS =
  actionTypes.SET_TRANSACCIONES_NORMALES_ESPERADAS;
const SET_TRANSACCIONES_PREMIO_ESPERADAS =
  actionTypes.SET_TRANSACCIONES_PREMIO_ESPERADAS;
const SET_NEW_TRANSACCION_NORMAL_FALLIDA =
  actionTypes.SET_NEW_TRANSACCION_NORMAL_FALLIDA;
const SET_NEW_TRANSACCION_PREMIO_FALLIDA =
  actionTypes.SET_NEW_TRANSACCION_PREMIO_FALLIDA;
const SET_NEW_TRANSACCION_PREMIO_COMPLETADA =
  actionTypes.SET_NEW_TRANSACCION_PREMIO_COMPLETADA;
const SET_NEW_TRANSACCION_NORMAL_COMPLETADA =
  actionTypes.SET_NEW_TRANSACCION_NORMAL_COMPLETADA;
const RESET_SOCKET_STATE = actionTypes.RESET_SOCKET_STATE;
const SET_ACTUAL_TRANSACCION_PREMIO_COMPLETADA =
  actionTypes.SET_ACTUAL_TRANSACCION_PREMIO_COMPLETADA;
const SET_ACTUAL_TRANSACCION_PREMIO_FALLIDA =
  actionTypes.SET_ACTUAL_TRANSACCION_PREMIO_FALLIDA;

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
        actual_transaccion_premio_completada: null,
        actual_transaccion_premio_fallida: null,
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

    case SET_ACTUAL_TRANSACCION_PREMIO_COMPLETADA:
      return {
        ...state,
        actual_transaccion_premio_completada: action.transaccion,
      };
    case SET_ACTUAL_TRANSACCION_PREMIO_FALLIDA:
      return {
        ...state,
        actual_transaccion_premio_fallida: action.transaccion,
      };
  }
};

export default SocketReducer;
