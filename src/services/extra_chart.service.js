import AxiosCall from "../config/AxiosConf";

class ExtraService {
  loadExtraData(param) {
    const chart_type = param.chart_type
    const chart_width = param.chart_width
    const chart_height = param.chart_height
    return AxiosCall({
      method: 'GET',
      path: 'group-sub-group-resource?chart_type=' + chart_type + '&chart_width=' + chart_width + '&chart_height=' + chart_height,
    }, 'Bearer')
  }
}

export default new ExtraService();