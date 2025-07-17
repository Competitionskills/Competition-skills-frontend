import api from "../helpers/axios";
export const fetchUserProfile = async () => {
  const response = await api.get("/users/user");
  return response.data;
};

export const buyPrestigeTicket = async () => {
  const response = await api.post("/tickets/buy-prestige-ticket");
  return response.data;
};