import AxiosCall from "../config/AxiosConf";

class ContactService {
  loadContactData() {
    return AxiosCall({
      method: 'GET',
      path: 'contacts',
    }, 'Bearer')
  }

  postContact(userData) {
    return AxiosCall({
      method: 'POST',
      path: 'contacts',
      data: userData
    }, 'Bearer')
  }
}

export default new ContactService();