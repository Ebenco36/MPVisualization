import AxiosCall from "../config/AxiosConf";

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
