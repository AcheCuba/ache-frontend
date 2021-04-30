import { actionTypes } from "../Actions/types";
import nuevaRecargaInitialState from "../initialStates/nuevaRecargaInitialState";

const TOOGLE_ADD_CONTACT_AVAIABLE = actionTypes.TOOGLE_ADD_CONTACT_AVAIABLE;
const SELECT_CONTACT = actionTypes.SELECT_CONTACT;

const NuevaRecargaReducer = (state = nuevaRecargaInitialState, action) => {
  switch (action.type) {
    case TOOGLE_ADD_CONTACT_AVAIABLE:
      return { ...state, addContactAvaiable: action.payload };
    case SELECT_CONTACT:
      return { ...state, contactSelected: action.payload };
    default:
      return state;
  }
};

export default NuevaRecargaReducer;
