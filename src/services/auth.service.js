import AxiosCall from "../config/AxiosConf";
import globalFigs from "../config/constants";

class AuthService {
  /* Login service */


  loadUser() {
    return AxiosCall({
      method: 'GET',
      path: 'auth/current-user'
    }, 'Bearer')
  }


  login(data) {
    return AxiosCall({
      method: 'POST',
      path: 'auth/login',
      data
    })
  }

  updateUser(user_id, data) {
    return AxiosCall({
      method: 'PUT',
      path: 'admin/user/' + user_id,
      data
    }, 'Bearer')
  }

  /* Logout service */
  /*
  logout() {

    localStorage.removeItem(globalFigs.token);
    localStorage.removeItem(globalFigs.user);

  }
  */

  forgotPassword(data) {
    return AxiosCall({
      method: 'POST',
      path: 'auth/forgot-password',
      data
    })
  }


  /* Register service */
  register(data) {
    return AxiosCall({
      method: 'POST',
      path: 'auth/register',
      data
    })
  }

  /* Logout service */
  logout(data) {
    return AxiosCall({
      method: 'GET',
      path: 'auth/logout',
      data
    }, 'Bearer')
  }
}

export default new AuthService();