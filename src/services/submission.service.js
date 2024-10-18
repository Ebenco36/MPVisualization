import AxiosCall from "../config/AxiosConf";

class SubmissionService {
  loadSubmissionData() {
    return AxiosCall({
      method: 'GET',
      path: 'submission',
    }, 'Bearer')
  }

  postSubmission(userData) {
    return AxiosCall({
      method: 'POST',
      path: 'submission',
      data: userData
    }, 'Bearer')
  }
}

export default new SubmissionService();