import request from "./request";
import { ORDER_URL } from "../configs/env";

export function getOrders(userId, headers) {
  const params = {
    userId
  };
  return request({
    url: ORDER_URL,
    method: "GET",
    params,
    headers
  });
}

export function createOrder(
  userId,
  cartItems,
  totalAmount,
  restaurantId,
  headers
) {
  const data = {
    userId,
    restaurantId,
    items: cartItems,
    totalCost: totalAmount
  };
  return request({
    url: ORDER_URL,
    method: "POST",
    data,
    headers
  });
}

export function deleteOrder(orderId, headers) {
  return request({ url: `${ORDER_URL}/${orderId}`, method: "DELETE", headers });
}

export function getOrderByRestaurant(restaurantId, completed = false, headers) {
  const data = { restaurantId, completed };
  return request({
    url: `${ORDER_URL}/getOrderByRestaurant`,
    method: "POST",
    data,
    headers
  });
}

export function completeOrder(orderId, headers) {
  return request({
    url: `${ORDER_URL}/completeOrder/${orderId}`,
    method: "PUT",
    headers
  });
}

// export default {
//   getOrders,
//   createOrder
// };
