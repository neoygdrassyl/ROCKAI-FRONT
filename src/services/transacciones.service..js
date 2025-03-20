import http, { cb } from "../http-common";

const route = "transacciones"

class TransaccionesoService {
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
    get_cuentas(search, origin) {
        return http().get(`/${route}/cuentas/${search}${origin ? `&${origin}`: ''}`).then(cb);
    }
    get_proyectos(search) {
        return http().get(`/${route}/proyectos/${search}`).then(cb);
    }
    get_balance() {
        return http().get(`/${route}/balance/1`).then(cb);
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

export default new TransaccionesoService();