import axios from 'axios';
import globalFigs from "./constants"

const AxiosCall = async (callObj, authType = '') => {
  const token = await localStorage.getItem(globalFigs.token)

  /* 
    callObj: {
      path: String,
      method: String 
      data: Any 
      contentType: String
    }
  */

  const { path, method, data, contentType } = callObj

  const noAuthHeaders = {
    "Content-Type": contentType || "application/json",
  }

  const authHeaders = {
    Authorization: `${authType} ${token}`,
    "Content-Type": contentType || "application/json",
  }



  /* Set header type */
  const headers = authType === '' ? noAuthHeaders : authHeaders;

  const baseUrl = import.meta.env.VITE_MPV_APP_URL
  const urlPath = `${baseUrl}${path}`;
  
  try {
    const response = await axios({
      url: urlPath,
      method,
      data,
      headers,
      responseType: 'json'
    })
    
    return response;

  } catch (error) {
    console.log(error.response.status)
    throw error;
  }

}

export default AxiosCall;