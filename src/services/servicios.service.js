import http, { cb } from "../http-common";

const route = "servicios"

class ServiciosService {
   delete(id) {
        return http().delete(`/${route}/${id}`).then(cb);
    }

}

export default new ServiciosService();