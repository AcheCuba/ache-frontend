import axios from "axios";
import { BASE_URL } from "../constants/domain";

export const getPrizeForUser = (user) => {
  const user_token = user.token;
  const userId = user.id;
  //const prize_id = user.prize?.uuid;
  //const url = `${BASE_URL}/prize/status/${prize_id}`;
  const url = `${BASE_URL}/users/${userId}`;

  let config = {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
  };

  return axios(config);
};
