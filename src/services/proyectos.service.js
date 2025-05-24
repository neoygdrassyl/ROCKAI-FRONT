import http, { cb } from "../http-common";

const route = "proyectos"

class ProyectoService {
    list(limit, offset) {
        return http().get(`/${route}/${limit}&${offset}`).then(cb);
    }
    search(limit, offset, field, value) {
        return http().get(`/${route}/${limit}&${offset}&${field}&${value}`).then(cb);
    }
    get(id) {
        return http().get(`/${route}/${id}`).then(cb);
    }
    getAll() {
        return http().get(`/${route}/`).then(cb);
    }
    view(id) {
        return http().get(`/${route}/view/${id}`).then(cb);
    }
    getLastID() {
        return http().get(`/${route}/codigo/get`).then(cb);
    }

    create(data) {
        return http().post(`/${route}/`, data).then(cb);
    }

    update(data, id) {
        return http().put(`/${route}/${id}`, data).then(cb);
    }

    delete(id) {
        return http().delete(`/${route}/${id}`).then(cb);
    }

    getWorkers(search) {
        return http().get(`/${route}/workers/${search}`).then(cb);
    }

}

export default new ProyectoService();