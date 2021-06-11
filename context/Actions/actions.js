import { actionTypes } from "./types";

// user actions
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

export const set_prize = (prize) => {
  return {
    type: actionTypes.SET_PRIZE,
    prize
  };
};

// nueva recarga
export const toogleAddContactAvaiable = (avaible) => {
  //avaiable: boolean
  return {
    type: actionTypes.TOOGLE_ADD_CONTACT_AVAIABLE,
    payload: avaible
  };
};

export const selectContact = (contact) => {
  //console.log(contact);
  return {
    type: "SELECT_CONTACT",
    payload: contact
  };
};

export const deleteContact = (contactId) => {
  //console.log(contact);
  return {
    type: "DELETE_CONTACT",
    payload: contactId
  };
};
