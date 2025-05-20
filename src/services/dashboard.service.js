import AxiosCall from "../config/AxiosConf";
import globalFigs from "../config/constants";

class DashboardService {
  /* Dashboard service */
  dashBoardStats(get_header, trend_width) {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard?get_header=' + get_header + '&first_leveled_width=' + trend_width
    }, 'Bearer')
  }

  dashBoardStatsMap () {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-map'
    }, 'Bearer')
  }


  dashBoardInconsistencies (width) {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-inconsistencies?width=' + width
    }, 'Bearer')
  }


  dashBoardStatsOthers () {
    return AxiosCall({
      method: 'GET',
      path: 'dashboard-others'
    }, 'Bearer')
  }

  fetchData(endpoint) {
    return AxiosCall({
      method: 'GET',
      path: endpoint
    }, 'Bearer')
  }

  postData(endpoint, data) {
    return AxiosCall({
      method: 'POST',
      path: endpoint,
      data
    }, 'Bearer')
  }

  summaryStats(search_param, payload) {
    return AxiosCall({
      method: 'GET',
      path: 'get-summary-statistics?' + search_param + "&" + payload
    }, 'Bearer')
  }

expertAnnotation(searchQuery) {
  const path = `records/${searchQuery}`
    return AxiosCall({
      method: 'GET',
      path: path
    }, 'Bearer')
}
  

}

export default new DashboardService();