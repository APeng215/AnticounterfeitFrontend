export default class LoginHelper {

  static isLoggedIn() {
    const raw = localStorage.getItem('isLoggedIn');
    return raw !== null ? JSON.parse(raw) : false;
  }

  static setLoggedIn(isLoggedIn) {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }

}
