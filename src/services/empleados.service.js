import http from "../http-common";

const route = "empleados"

class EmpleadosService {
    list(limit, offset) {
        return http().get(`/${route}/${limit}&${offset}`);
    }
    /*
    search(limit, offset, field, value) {
        return http.get(`/${route}/search/${limit}&${offset}&${field}&${value}`);
    }
    */
    get(id) {
        return http().get(`/${route}/get/${id}/get`);
    }

    create(data) {
        return http().post(`/${route}/`, data);
    }
    
    update(data, id) {
        return http().put(`/${route}/${id}`, data);
    }

    delete(id) {
        return http().delete(`/${route}/${id}`);
    }

}

export default new EmpleadosService();