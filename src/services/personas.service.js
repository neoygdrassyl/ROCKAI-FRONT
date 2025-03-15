import http, { cb } from "../http-common";

const route = "personas"

class PersonasService {
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

    create(data) {
        return http().post(`/${route}/`, data).then(cb);
    }
    
    update(data, id) {
        return http().put(`/${route}/${id}`, data).then(cb);
    }

    delete(id) {
        return http().delete(`/${route}/${id}`).then(cb);
    }

}

export default new PersonasService();