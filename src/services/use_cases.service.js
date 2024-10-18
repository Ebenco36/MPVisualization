import AxiosCall from "../config/AxiosConf";
import globalFigs from "../config/constants";

class UseCasesService {
  /* Dashboard service */
  useCasesContent() {
    return AxiosCall({
      method: 'GET',
      path: 'use-cases'
    }, 'Bearer')
  }

  postCasesContent(data) {
    return AxiosCall({
      method: 'POST',
      path: 'use-cases',
      data: data
    }, 'Bearer')
  }

}

export default new UseCasesService();