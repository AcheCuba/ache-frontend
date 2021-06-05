import { actionTypes } from "./types";

export const signup = () => {
  return {
    type: actionTypes.SIGNUP,
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
  //console.log(contact);
  return {
    type: "SELECT_CONTACT",
    payload: contact,
  };
};

export const deleteContact = (contactId) => {
  //console.log(contact);
  return {
    type: "DELETE_CONTACT",
    payload: contactId,
  };
};
