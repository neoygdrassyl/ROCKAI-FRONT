import http, { cb } from "../http-common";

const route = "empleados"

class EmpleadosService {
    list(limit, offset) {
        return http().get(`/${route}/${limit}&${offset}`).then(cb);
    }
    /*
    search(limit, offset, field, value) {
        return http.get(`/${route}/search/${limit}&${offset}&${field}&${value}`);
    }
    */
    get(id) {
        return http().get(`/${route}/get/${id}`).then(cb);
    }

    create(data) {
        return http().post(`/${route}/`, data).then(cb);
    }

    update(data, id) {
        return http().put(`/${route}/${id}`, data).then(cb);
    }

    activate(data, id) {
        return http().put(`/${route}/activate/${id}`, data).then(cb);
    }

    delete(id) {
        return http().delete(`/${route}/${id}`).then(cb);
    }

}

export default new EmpleadosService();