import AxiosCall from "../config/AxiosConf";

class TutorialService {
  loadData(endpoint) {
    return AxiosCall({
      method: 'GET',
      path: endpoint,
    }, 'Bearer')
  }

  postData(endpoint, userData) {
    return AxiosCall({
      method: 'POST',
      path: endpoint,
      data: userData
    }, 'Bearer')
  }
}

export default new TutorialService();