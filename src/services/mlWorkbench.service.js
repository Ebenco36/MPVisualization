import axios from 'axios'
import globalFigs from "../config/constants"
import AxiosCall from "../config/AxiosConf";

class MLWorkbenchService {
  assetUrl(path) {
    return `${import.meta.env.VITE_MPV_APP_URL}${path}`
  }

  summary() {
    return AxiosCall({
      method: 'GET',
      path: 'ml-workbench'
    }, 'Bearer')
  }

  downloadTemplate() {
    return AxiosCall({
      method: 'GET',
      path: 'ml-workbench/template',
      responseType: 'blob'
    }, 'Bearer')
  }

  predict(formData) {
    return this._multipartRequest('ml-workbench/predict', formData)
  }

  downloadRealSample(formData) {
    return this._multipartRequest('ml-get-sample-real-data', formData)
  }

  async _multipartRequest(path, formData) {
    const token = await localStorage.getItem(globalFigs.token)
    return axios({
      url: `${import.meta.env.VITE_MPV_APP_URL}${path}`,
      method: 'POST',
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'blob'
    })
  }
}

export default new MLWorkbenchService();
