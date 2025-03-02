import axios from "axios";
 
export default function http() {

  const _user = localStorage.getItem(process.env.REACT_APP_STORAGE_KEY);

  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": _user ? `Bearer ${JSON.parse(_user).token}` : null
    }
  }) 
};