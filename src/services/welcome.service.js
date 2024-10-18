import AxiosCall from "../config/AxiosConf";
import globalFigs from "../config/constants";

class WelcomeService {
  /* Dashboard service */
  welcomePageContent() {
    return AxiosCall({
      method: 'GET',
      path: 'welcome-page'
    }, 'Bearer')
  }

}

export default new WelcomeService();