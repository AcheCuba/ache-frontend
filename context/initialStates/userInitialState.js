export default {
  token: undefined,
  id: undefined,
  name: undefined,
  email: undefined,
  phone: undefined,
  prize: null
};

// actions que lo modifican:
//- signup
//- setToken -> abrir app
//- setPrize -> cuando adquiere o se elimina algún premio

/* user: {
	token: string, // from async storage
    id: number,
	name: string,
	email: string,
	phone: string,
    prize: null
} // si user es null, y no hay token en async storage, no está registrado */
