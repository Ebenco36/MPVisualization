import AxiosCall from "../config/AxiosConf";

class FeedbackService {
  loadFeedbackData() {
    return AxiosCall({
      method: 'GET',
      path: 'admin/feedback-questions',
    }, 'Bearer')
  }

  postFeedback(userData) {
    return AxiosCall({
      method: 'POST',
      path: 'feedback',
      data: userData
    }, 'Bearer')
  }
}

export default new FeedbackService();