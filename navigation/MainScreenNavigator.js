import React from "react";
import HomeScreen from "../screens/HomeScreen";
import RestaurantInfoScreen from "../screens/RestaurantInfoScreen";
import ScannerScreen from "../screens/ScannerScreen";
import CuisineRestaurantsScreen from "../screens/CuisineRestaurantsScreen";
import { createStackNavigator } from "react-navigation";
import CartScreen from "../screens/CartScreen";
import PaymentHome from "../screens/Payment/Home";
import PaymentComplete from "../screens/Payment/Complete";
import PaymentFailed from "../screens/Payment/Failed";

export default createStackNavigator({
  Home: HomeScreen,
  RestaurantInfo: RestaurantInfoScreen,
  Scan: ScannerScreen,
  CuisineRestaurants: CuisineRestaurantsScreen,
  CartScreen: CartScreen,
  Payment: PaymentHome,
  PaymentSuccess: PaymentComplete,
  PaymentFailed: PaymentFailed
});
