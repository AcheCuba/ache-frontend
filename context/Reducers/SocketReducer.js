import { actionTypes } from "../Actions/types";
import socketInitialState from "../initialStates/socketInitialState";

const OPEN_SOCKET = actionTypes.OPEN_SOCKET;
const CLOSE_SOCKET = actionTypes.CLOSE_SOCKET;
const SET_SOCKET_ID = actionTypes.SET_SOCKET_ID;
const SET_TRANSACCIONES_ESPERADAS = actionTypes.SET_TRANSACCIONES_ESPERADAS;
const SET_UPDATE_COMPLETED = actionTypes.SET_UPDATE_COMPLETED;
const SET_TRANSACCIONES_RESULTADO = actionTypes.SET_TRANSACCIONES_RESULTADO;

const SocketReducer = (state = socketInitialState, action) => {
  switch (action.type) {
    case OPEN_SOCKET:
      return {
        ...state,
        socketOpen: true,
      };
    case CLOSE_SOCKET:
      return {
        ...state,
        socketOpen: false,
      };
    case SET_SOCKET_ID:
      return {
        ...state,
        socketId: action.socketId,
      };
    case SET_TRANSACCIONES_ESPERADAS:
      return {
        ...state,
        transacciones_esperadas: action.transactions,
      };
    case SET_UPDATE_COMPLETED:
      return {
        ...state,
        updateCompleted: action.updateCompleted,
      };
    case SET_TRANSACCIONES_RESULTADO:
      return {
        ...state,
        transacciones_resultado: action.transactions,
      };
  }
};

export default SocketReducer;
