import axios from "axios";
import { baseUrl } from "../configs/env";

const client = axios.create({
  baseURL: baseUrl
});

/**
 * Request Wrapper with default success/error actions
 */
const request = options => {
  const onSuccess = response => {
    console.debug("Request Successful!", JSON.stringify(response));
    return response;
  };

  const onError = error => {
    console.log("Request Failed:", JSON.stringify(error.config));
    if (error.response) {
      console.log("Status:", JSON.stringify(error.response.status));
      console.log("Data:", JSON.stringify(error.response.data));
      console.log("Headers:", JSON.stringify(error.response.headers));
    } else {
      console.log("Error Message:", JSON.stringify(error.message));
    }
    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
