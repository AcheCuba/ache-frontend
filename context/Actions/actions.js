import { actionTypes } from "./types";

// ================================= ACTIONS FOR USER STATE ===========================
export const signup = (user) => {
  return {
    type: actionTypes.SIGNUP,
    user
  };
};

export const restore_user = (user) => {
  return {
    type: actionTypes.RESTORE_USER,
    user
  };
};

export const setPrizeForUser = (prize) => {
  return {
    type: actionTypes.SET_PRIZE_FOR_USER,
    prize
  };
};

// ================================= ACTIONS FOR NUEVA RECARGA STATE ===========================

export const resetNuevaRecargaState = () => {
  return {
    type: actionTypes.RESET_NUEVA_RECARGA_STATE
  };
};

export const restoreNuevaRecargaInitialState = () => {
  return {
    type: actionTypes.RESTORE_NUEVA_RECARGA_INITIAL_STATE
  };
};

export const toggleValidateInProcess = (inProcess) => {
  //inProcess: boolean
  return {
    type: actionTypes.TOGGLE_VALIDATE_IN_PROCESS,
    inProcess
  };
};

export const toogleAddContactAvaiable = (avaible) => {
  //avaiable: boolean
  return {
    type: actionTypes.TOOGLE_ADD_CONTACT_AVAIABLE,
    payload: avaible
  };
};

export const selectContact = (contact) => {
  return {
    type: "SELECT_CONTACT",
    payload: contact
  };
};

export const updatePrizeForContact = (fieldInputId, prize) => {
  return {
    type: actionTypes.UPDATE_PRIZE_FOR_CONTACT,
    fieldInputId,
    prize
  };
};

export const deleteContact = (contactId) => {
  return {
    type: "DELETE_CONTACT",
    payload: contactId
  };
};

// delete contact and prize
export const deleteField = (fieldId) => {
  return {
    type: actionTypes.DELETE_FIELD,
    payload: fieldId
  };
};

// prizes
export const setPrize = (prize) => {
  return {
    type: actionTypes.SET_PRIZE,
    payload: prize
  };
};

export const updatePrize = (uuid, prizeUpdated) => {
  // uuid for last prize update
  return {
    type: actionTypes.UPDATE_PRIZE,
    uuid,
    prizeUpdated
  };
};

export const deletePrize = (uuid) => {
  // uuid for prize
  return {
    type: actionTypes.DELETE_PRIZE,
    payload: uuid
  };
};

export const deletePrizeByFieldId = (fieldId) => {
  // fieldId for prize
  return {
    type: actionTypes.DELETE_PRIZE_BY_FIELD_ID,
    fieldId
  };
};

export const setFields = (isFirstField, fieldId) => {
  return {
    type: actionTypes.SET_FIELDS,
    fieldId,
    isFirstField
  };
};
