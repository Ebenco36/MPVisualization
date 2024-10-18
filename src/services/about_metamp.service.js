import AxiosCall from "../config/AxiosConf";
import globalFigs from "../config/constants";

class AboutService {
  /* Dashboard service */
  aboutServiceContent() {
    return AxiosCall({
      method: 'GET',
      path: 'about-metamp'
    }, 'Bearer')
  }

}

export default new AboutService();