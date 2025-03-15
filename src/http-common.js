import axios from "axios";

export default function http() {
  const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "content-type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": token ? `Bearer ${token}` : null
    }
  })
};

export function cb (res) {
  const refreshToken = res.headers["refresh-token"] || null;
  localStorage.setItem(process.env.REACT_APP_TOKEN_KEY, refreshToken);
  return res
}