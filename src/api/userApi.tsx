import api from "../helpers/axios";
export const fetchUserProfile = async () => {
  const response = await api.get("/users/user");
  return response.data;
};
