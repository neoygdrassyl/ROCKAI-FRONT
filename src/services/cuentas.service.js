import http, { cb } from "../http-common";

const route = "cuentas"

class CuentasService {
    list(limit, offset, es_propia) {
        return http().get(`/${route}/${limit}&${offset}${es_propia ? `&${es_propia}` : ''}`).then(cb);
    }
    search(limit, offset, field, value, es_propia) {
        return http().get(`/${route}/${limit}&${offset}&${field}&${value}${es_propia ? `&${es_propia}` : ''}`).then(cb);
    }
    get(id) {
        return http().get(`/${route}/${id}`).then(cb);
    }
    getAll() {
        return http().get(`/${route}/`).then(cb);
    }
    getPersonas(search) {
        return http().get(`/${route}/personas/${search}`).then(cb);
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

export default new CuentasService();