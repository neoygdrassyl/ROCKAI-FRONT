import http from "../http-common";

const route = "system"

class SystemService {
  app_login(data) {
    return http().post(`/${route}/app_login`, data);
  }
  
}

export default new SystemService();