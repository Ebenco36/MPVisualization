import AxiosCall from "../config/AxiosConf";

class AboutService {
  aboutServiceContent() {
    return AxiosCall({
      method: 'GET',
      path: 'about-metamp'
    }, 'Bearer')
  }

  aboutSummaryContent() {
    return AxiosCall({
      method: 'GET',
      path: 'about-metamp/summary'
    }, 'Bearer')
  }
}

export default new AboutService();
