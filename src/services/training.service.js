import AxiosCall from "../config/AxiosConf";

class TrainingService {
  loadTrainingData(type) {
    return AxiosCall({
      method: 'GET',
      path: 'admin/categories?type=' + type,
    }, 'Bearer')
  }

  postTraing(userData) {
    return AxiosCall({
      method: 'POST',
      path: 'save-user-answer',
      data: userData
    }, 'Bearer')
  }

  loadTrainingCharts(userData) {
    return AxiosCall({
      method: 'POST',
      path: 'chart/questions',
      data: userData
    }, 'Bearer')
  }
}

export default new TrainingService();