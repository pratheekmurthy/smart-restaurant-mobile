import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation";
import LoginScreen from "../screens/LoginScreen";

export default createStackNavigator({ Login: LoginScreen });