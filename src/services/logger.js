import AxiosCall from "../config/AxiosConf";
export async function logEvent(eventName, eventData) {
    try {
      const logData = {
        event: eventName,
        data: eventData
      };
      console.log(logData)
      AxiosCall({
        method: 'POST',
        path: "record-click",
        data: logData,
        contentType: "application/json"
      }, "Bearer")
  
      console.log(`Event "${eventName}" logged successfully.`);
    } catch (error) {
      console.error('Error logging event:', error);
    }
}