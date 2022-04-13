import { actionTypes } from "./types";

// ================================= ACTIONS FOR USER STATE ===========================
export const signup = (user) => {
  return {
    type: actionTypes.SIGNUP,
    user,
  };
};

export const restore_user = (user) => {
  return {
    type: actionTypes.RESTORE_USER,
    user,
  };
};

export const setPrizeForUser = (prize) => {
  return {
    type: actionTypes.SET_PRIZE_FOR_USER,
    prize,
  };
};

export const setIdioma = (idioma) => {
  return {
    type: actionTypes.SET_IDIOMA,
    idioma,
  };
};

// ================================= ACTIONS FOR NUEVA RECARGA STATE ===========================

export const resetNuevaRecargaState = () => {
  return {
    type: actionTypes.RESET_NUEVA_RECARGA_STATE,
  };
};

export const restoreNuevaRecargaInitialState = () => {
  return {
    type: actionTypes.RESTORE_NUEVA_RECARGA_INITIAL_STATE,
  };
};

export const toggleValidateInProcess = (inProcess) => {
  //inProcess: boolean
  return {
    type: actionTypes.TOGGLE_VALIDATE_IN_PROCESS,
    inProcess,
  };
};

export const toogleAddContactAvaiable = (avaible) => {
  //avaiable: boolean
  return {
    type: actionTypes.TOOGLE_ADD_CONTACT_AVAIABLE,
    payload: avaible,
  };
};

export const selectContact = (contact) => {
  return {
    type: "SELECT_CONTACT",
    payload: contact,
  };
};

export const updatePrizeForContact = (fieldInputId, prize) => {
  return {
    type: actionTypes.UPDATE_PRIZE_FOR_CONTACT,
    fieldInputId,
    prize,
  };
};

export const deleteContact = (contactId) => {
  return {
    type: "DELETE_CONTACT",
    payload: contactId,
  };
};

// delete contact and prize
export const deleteField = (fieldId) => {
  return {
    type: actionTypes.DELETE_FIELD,
    payload: fieldId,
  };
};

// prizes
export const setPrize = (prize) => {
  return {
    type: actionTypes.SET_PRIZE,
    payload: prize,
  };
};

export const updatePrize = (uuid, prizeUpdated) => {
  // uuid for last prize update
  return {
    type: actionTypes.UPDATE_PRIZE,
    uuid,
    prizeUpdated,
  };
};

export const deletePrize = (uuid) => {
  // uuid for prize
  return {
    type: actionTypes.DELETE_PRIZE,
    payload: uuid,
  };
};

export const deletePrizeByFieldId = (fieldId) => {
  // fieldId for prize
  return {
    type: actionTypes.DELETE_PRIZE_BY_FIELD_ID,
    fieldId,
  };
};

export const deleteAllValidatedPrizes = () => {
  return {
    type: actionTypes.DELETE_ALL_VALIDATED_PRIZES,
  };
};

export const setFields = (isFirstField, fieldId) => {
  return {
    type: actionTypes.SET_FIELDS,
    fieldId,
    isFirstField,
  };
};

export const setTransaccionesNormalesConfirmadas = (transaccionesNormales) => {
  return {
    type: actionTypes.SET_TRANSACCIONES_NORMALES_CONFIRMADAS,
    transaccionesNormales,
  };
};

export const setTransaccionesPremioConfirmadas = (transaccionesPremio) => {
  return {
    type: actionTypes.SET_TRANSACCIONES_PREMIO_CONFIRMADAS,
    transaccionesPremio,
  };
};

export const deleteAllTransaccionesNormales = () => {
  return {
    type: actionTypes.DELETE_ALL_TRANSACCIONES_NORMALES,
  };
};

export const deleteAllTransaccionesPremio = () => {
  return {
    type: actionTypes.DELETE_ALL_TRANSACCIONES_PREMIO,
  };
};

// ================================= ACTIONS for socket STATE ===========================

export const openSocket = () => {
  return {
    type: actionTypes.OPEN_SOCKET,
  };
};

export const closeSocket = () => {
  return {
    type: actionTypes.CLOSE_SOCKET,
  };
};
export const setSocketId = (socketId) => {
  return {
    type: actionTypes.SET_SOCKET_ID,
    socketId,
  };
};

export const setTransaccionesNormalesEsperadas = (transactions) => {
  return {
    type: actionTypes.SET_TRANSACCIONES_NORMALES_ESPERADAS,
    transactions,
  };
};

export const setTransaccionesPremioEsperadas = (transactions) => {
  return {
    type: actionTypes.SET_TRANSACCIONES_PREMIO_ESPERADAS,
    transactions,
  };
};

export const setTransaccionesNormalesResultado = (transactions) => {
  return {
    type: actionTypes.SET_TRANSACCIONES_NORMALES_RESULTADO,
    transactions,
  };
};

export const setTransaccionesPremioResultado = (transactions) => {
  return {
    type: actionTypes.SET_TRANSACCIONES_PREMIO_RESULTADO,
    transactions,
  };
};

export const setNewTransaccionNormalResultado = (newTransaction) => {
  return {
    type: actionTypes.SET_NEW_TRANSACCION_NORMAL_RESULTADO,
    newTransaction,
  };
};

export const setNewTransaccionPremioResultado = (newTransaction) => {
  return {
    type: actionTypes.SET_NEW_TRANSACCION_PREMIO_RESULTADO,
    newTransaction,
  };
};

/* export const SetUpdateCompleted = (completed) => {
  //espera boolean
  return {
    type: actionTypes.SET_UPDATE_COMPLETED,
    completed,
  };
};
 */
