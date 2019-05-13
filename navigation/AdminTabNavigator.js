import React from "react";
import { Platform, Alert, AsyncStorage } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import MainScreenNavigator from "../navigation/MainScreenNavigator";
import TabBarIcon from "../components/TabBarIcon";
// import LinksScreen from "../screens/LinksScreen";
import OrdersListScreen from "../screens/admin/ordersListScreen";
import LogoutScreen from "../screens/LogoutScreen";

const HomeStack = createStackNavigator({
  Home: MainScreenNavigator
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

const LinksStack = createStackNavigator({
  Links: OrdersListScreen
});

LinksStack.navigationOptions = {
  tabBarLabel: "Orders",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

const LogoutStack = createStackNavigator({
  Logout: LogoutScreen
});

LogoutStack.navigationOptions = ({ navigation }) => ({
  tabBarLabel: "Logout",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-exit" : "md-exit"}
    />
  ),
  tabBarOnPress: (scene, jumpToIndex) => {
    return Alert.alert("Confirm", "Do you really want to logout", [
      {
        text: "Accept",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("cartValue");
          navigation.navigate("Auth");
        }
      },
      { text: "Cancel" }
    ]);
  }
});

export default createBottomTabNavigator({
  //   HomeStack,
  LinksStack,
  LogoutStack
});
