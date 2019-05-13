import request from "./request";
import { FOOD_INFO_URL, FOOD_TYPES_URL, RESTAURANT_URL } from "../configs/env";

export function getFood(id = null, headers = null) {
  let params = {};
  if (id != null) {
    params = {
      id
    };
  }
  return request({
    url: FOOD_INFO_URL,
    method: "GET",
    params,
    headers
  });
}

export function getAllCuisineTypes(headers = null) {
  return request({
    url: FOOD_TYPES_URL,
    method: "GET",
    headers
  });
}
