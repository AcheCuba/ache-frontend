import { actionTypes } from "./types";

// ================================= ACTIONS FOR INTERFACE ===========================

export const setShowExpiredPrize = (isExpired) => {
  return {
    type: actionTypes.SET_SHOW_EXPIRED_PRIZE,
    isExpired,
  };
};

export const setShowInvisibleLoadData = (isNewUser) => {
  return {
    type: actionTypes.SET_SHOW_INVISIBLE_LOAD_DATA,
    isNewUser,
  };
};

export const setIsAppOutdated = (isOutdated) => {
  return {
    type: actionTypes.SET_IS_APP_OUTDATED,
    isOutdated,
  };
};

export const setAndroidLinkUpdate = (androidLink) => {
  return {
    type: actionTypes.SET_ANDROID_LINK_UPDATE,
    androidLink,
  };
};

export const setIosLinkUpdate = (iosLink) => {
  return {
    type: actionTypes.SET_IOS_LINK_UPDATE,
    iosLink,
  };
};

//export const setShowExpiredPrize =

// ================================= ACTIONS FOR USER STATE ===========================
export const signup = (user) => {
  return {
    type: actionTypes.SIGNUP,
    user,
  };
};

export const resetUserState = () => {
  return {
    type: actionTypes.RESET_USER_STATE,
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

export const setCountryForUser = (country) => {
  return {
    type: actionTypes.SET_COUNTRY_FOR_USER,
    country,
  };
};

export const setOperatorForUser = (operator) => {
  return {
    type: actionTypes.SET_OPERATOR_FOR_USER,
    operator,
  };
};

export const setUserRecuperado = (isUserRecuperado) => {
  return {
    type: actionTypes.SET_USER_RECUPERADO,
    isUserRecuperado,
  };
};

// ================================= ACTIONS FOR NUEVA RECARGA STATE ===========================

export const setHayPremioCobradoModal = (hayPremioCobrado) => {
  return {
    type: actionTypes.SET_HAY_PREMIO_COBRADO_MODAL,
    hayPremioCobrado,
  };
};

export const setHayPremioFallidoModal = (hayPremioFallido) => {
  return {
    type: actionTypes.SET_HAY_PREMIO_FALLIDO_MODAL,
    hayPremioFallido,
  };
};

export const setPaymentPriceUsd = (productPriceUsd) => {
  return {
    type: actionTypes.SET_PAYMENT_PRICE_USD,
    productPriceUsd,
  };
};

export const setPaymentIntentId = (paymentIntentId) => {
  return {
    type: actionTypes.SET_PAYMENT_INTENT_ID,
    paymentIntentId,
  };
};

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

export const deleteAllContacts = () => {
  return {
    type: actionTypes.DELETE_ALL_CONTACTS,
  };
};

// delete contact and prize
export const deleteField = (fieldId) => {
  return {
    type: actionTypes.DELETE_FIELD,
    payload: fieldId,
  };
};

export const deleteAllFields = () => {
  return {
    type: actionTypes.DELETE_ALL_FIELDS,
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

export const setTransactionsIdArray = (transactionsIdArray) => {
  return {
    type: actionTypes.SET_TRANSACTIONS_ID_ARRAY,
    transactionsIdArray,
  };
};

// ================================= ACTIONS for socket STATE ===========================

export const setNewTransaccionNormalCompletada = (transaccion) => {
  return {
    type: actionTypes.SET_NEW_TRANSACCION_NORMAL_COMPLETADA,
    transaccion,
  };
};

export const setNewTransaccionPremioCompletada = (transaccion) => {
  return {
    type: actionTypes.SET_NEW_TRANSACCION_PREMIO_COMPLETADA,
    transaccion,
  };
};

export const setNewTransaccionNormalFallida = (transaccion) => {
  return {
    type: actionTypes.SET_NEW_TRANSACCION_NORMAL_FALLIDA,
    transaccion,
  };
};

export const setNewTransaccionPremioFallida = (transaccion) => {
  return {
    type: actionTypes.SET_NEW_TRANSACCION_PREMIO_FALLIDA,
    transaccion,
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

export const resetSocketState = () => {
  return {
    type: actionTypes.RESET_SOCKET_STATE,
  };
};

export const setActualTransaccionPremioCompletada = (transaccion) => {
  return {
    type: actionTypes.SET_ACTUAL_TRANSACCION_PREMIO_COMPLETADA,
    transaccion,
  };
};

export const setActualTransaccionPremioFallida = (transaccion) => {
  return {
    type: actionTypes.SET_ACTUAL_TRANSACCION_PREMIO_FALLIDA,
    transaccion,
  };
};
