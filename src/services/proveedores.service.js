import http, { cb } from "../http-common";

const route = "proveedores"

class ProveedoresService {
   delete(id) {
        return http().delete(`/${route}/${id}`).then(cb);
    }

}

export default new ProveedoresService();