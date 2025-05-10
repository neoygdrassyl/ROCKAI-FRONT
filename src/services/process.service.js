import http, { cb } from "../http-common";

const route = "prs"

class ProcessService {
  get_sales() {
    return http().get(`/${route}/sales`).then(cb);
  }

  get_income() {
    return http().get(`/${route}/income`).then(cb);
  }
  
}

export default new ProcessService();