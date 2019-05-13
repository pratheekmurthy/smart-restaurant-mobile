import request from "./request";
import { RESTAURANT_FILTER_URL, RESTAURANT_URL } from "../configs/env";

export function getRestaurant(id = null, headers = null) {
  let params = {};
  if (id != null) {
    params = {
      id
    };
  }
  return request({
    url: RESTAURANT_URL,
    method: "GET",
    params,
    headers
  });
}

export function getRestaurantByType(type, headers = null) {
  return request({
    url: `${RESTAURANT_FILTER_URL}?type=${type}`,
    method: "GET",
    headers
  });
}

// export default {
//   getRestaurant,
//   getRestaurantByType
// };
