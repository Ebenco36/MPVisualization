import AxiosCall from "../config/AxiosConf";

class VennService {
  loadVennData() {
    return AxiosCall({
      method: 'GET',
      path: 'venn-attribute-desc',
    }, 'Bearer')
  }
}

export default new VennService();