import http, { cb } from "../http-common";

const route = "facturas"

class FacturasService {
  
    get(id) {
        return http().get(`/${route}/${id}`).then(cb);
    }

    create(data) {
        return http().post(`/${route}/`, data).then(cb);
    }

    update(data, id) {
        return http().put(`/${route}/${id}`, data).then(cb);
    }

}

export default new FacturasService();