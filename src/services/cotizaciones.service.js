import http, { cb } from "../http-common";

const route = "cotizaciones"

class CotizacionesService {
    list(limit, offset, aprobado) {
        return http().get(`/${route}/${limit}&${offset}${aprobado ? `&${aprobado}`: ''}`).then(cb);
    }
    search(limit, offset, field, value, aprobado) {
        return http().get(`/${route}/${limit}&${offset}&${field}&${value}${aprobado ? `&${aprobado}`: ''}`).then(cb);
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

export default new CotizacionesService();