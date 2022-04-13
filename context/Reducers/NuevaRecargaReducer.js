import { actionTypes } from "../Actions/types";
import nuevaRecargaInitialState from "../initialStates/nuevaRecargaInitialState";

const TOOGLE_ADD_CONTACT_AVAIABLE = actionTypes.TOOGLE_ADD_CONTACT_AVAIABLE;
const SELECT_CONTACT = actionTypes.SELECT_CONTACT;
const DELETE_CONTACT = actionTypes.DELETE_CONTACT;
const UPDATE_PRIZE_FOR_CONTACT = actionTypes.UPDATE_PRIZE_FOR_CONTACT;
const SET_PRIZE = actionTypes.SET_PRIZE;
const DELETE_PRIZE = actionTypes.DELETE_PRIZE;
const DELETE_PRIZE_BY_FIELD_ID = actionTypes.DELETE_PRIZE_BY_FIELD_ID;
const UPDATE_PRIZE = actionTypes.UPDATE_PRIZE;
const SET_FIELDS = actionTypes.SET_FIELDS;
const TOGGLE_VALIDATE_IN_PROCESS = actionTypes.TOGGLE_VALIDATE_IN_PROCESS;
const RESET_NUEVA_RECARGA_STATE = actionTypes.RESET_NUEVA_RECARGA_STATE;
const RESTORE_NUEVA_RECARGA_INITIAL_STATE =
  actionTypes.RESTORE_NUEVA_RECARGA_INITIAL_STATE;
const DELETE_FIELD = actionTypes.DELETE_FIELD;
const DELETE_ALL_VALIDATED_PRIZES = actionTypes.DELETE_ALL_VALIDATED_PRIZES;

//socket
const SET_TRANSACCIONES_NORMALES_CONFIRMADAS =
  actionTypes.SET_TRANSACCIONES_NORMALES_CONFIRMADAS;
const SET_TRANSACCIONES_PREMIO_CONFIRMADAS =
  actionTypes.SET_TRANSACCIONES_PREMIO_CONFIRMADAS;

const DELETE_ALL_TRANSACCIONES_NORMALES =
  actionTypes.DELETE_ALL_TRANSACCIONES_NORMALES;
const DELETE_ALL_TRANSACCIONES_PREMIO =
  actionTypes.DELETE_ALL_TRANSACCIONES_PREMIO;

const NuevaRecargaReducer = (state = nuevaRecargaInitialState, action) => {
  switch (action.type) {
    // condiciones iniciales
    case RESTORE_NUEVA_RECARGA_INITIAL_STATE:
      return nuevaRecargaInitialState;

    // preservar premio y primer field.
    case RESET_NUEVA_RECARGA_STATE:
      return {
        ...state,
        addContactAvaiable: false,
        contactosSeleccionados: [],
        validated_prizes: [],
        /* validated_prizes:
          state.validated_prizes.length !== 0
            ? [state.validated_prizes[0]]
            : [], */
        // fields: [state.fields[0]],
        fields: [],
        validatetInProcess: false,
      };

    // contacts
    case TOOGLE_ADD_CONTACT_AVAIABLE:
      return { ...state, addContactAvaiable: action.payload };

    case TOGGLE_VALIDATE_IN_PROCESS:
      return { ...state, validatetInProcess: action.inProcess };

    case SELECT_CONTACT:
      return {
        ...state,
        contactosSeleccionados: [
          ...state.contactosSeleccionados,
          action.payload,
        ],
      };
    case UPDATE_PRIZE_FOR_CONTACT:
      let newContactsArr = state.contactosSeleccionados.map((c) => {
        if (c.fieldInputId === action.fieldInputId) {
          return {
            ...c,
            prize: action.prize,
          };
        } else {
          return {
            ...c,
          };
        }
      });
      return { ...state, contactosSeleccionados: [...newContactsArr] };

    case DELETE_CONTACT:
      return {
        ...state,
        contactosSeleccionados: state.contactosSeleccionados.filter(
          (contact) => action.payload !== contact.fieldInputId
        ),
      };

    case DELETE_FIELD:
      return {
        ...state,
        contactosSeleccionados: state.contactosSeleccionados.filter(
          (contact) => contact.fieldInputId !== action.payload
        ),
        validated_prizes: state.validated_prizes.filter(
          (prize) => prize.fieldId !== action.payload
        ),
        fields: state.fields.filter(
          (field) => field.fieldId !== action.payload
        ),
      };

    // prizes
    case SET_PRIZE:
      return {
        ...state,
        validated_prizes: [...state.validated_prizes, action.payload],
      };

    case UPDATE_PRIZE:
      return {
        ...state,
        validated_prizes: state.validated_prizes.map((prize) => {
          if (action.uuid === prize.uuid) {
            return action.prizeUpdated;
          } else {
            return prize;
          }
        }),
      };

    case DELETE_PRIZE:
      const uuid = action.payload.uuid;
      return {
        ...state,
        validated_prizes: state.validated_prizes.filter(
          (prize) => uuid !== prize.uuid
        ),
      };

    case DELETE_PRIZE_BY_FIELD_ID:
      return {
        ...state,
        validated_prizes: state.validated_prizes.filter(
          (prize) => action.fieldId !== prize.fieldId
        ),
      };

    case DELETE_ALL_VALIDATED_PRIZES:
      return {
        ...state,
        validated_prizes: [],
      };

    // fields
    case SET_FIELDS:
      return {
        ...state,
        fields: [
          ...state.fields,
          { isFirstField: action.isFirstField, fieldId: action.fieldId },
        ],
      };

    // resultados de las transacciones por socket

    case SET_TRANSACCIONES_NORMALES_CONFIRMADAS:
      return {
        ...state,
        transacciones_normales_confirmadas: action.transaccionesNormales,
      };

    case SET_TRANSACCIONES_PREMIO_CONFIRMADAS:
      return {
        ...state,
        //premiosConfirmadosSocket: action.premiosConfirmados,
        transacciones_premio_confirmadas: action.transaccionesPremio,
      };

    case DELETE_ALL_TRANSACCIONES_NORMALES:
      return {
        ...state,
        //premiosConfirmadosSocket: action.premiosConfirmados,
        transacciones_normales_confirmadas: [],
      };

    case DELETE_ALL_TRANSACCIONES_PREMIO:
      return {
        ...state,
        //premiosConfirmadosSocket: action.premiosConfirmados,
        transacciones_premio_confirmadas: [],
      };

    default:
      return state;
  }
};

export default NuevaRecargaReducer;
