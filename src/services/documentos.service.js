import { cb } from "../http-common";
import axios from "axios";

const route = "documentos"

function http() {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
    return axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        headers: {
            "content-type": 'multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbT',
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": token ? `Bearer ${token}` : null
        }
    })
}


class DocumentosService {

    request() {
        return http().post(`/${route}/google/auth`, null).then(cb);
    }


    connect() {
        return http().post(`/${route}/google/auth/callback`, null).then(cb);
    }


    get(id, folder) {
        return http().get(`/${route}/google/file/${folder}&${id}/`).then(cb);
    }

    upload(data) {
        return http().post(`/${route}/google/upload`, data).then(cb);
    }

}

export default new DocumentosService();