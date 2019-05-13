import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    // await AsyncStorage.removeItem("authToken");
    const authToken = await AsyncStorage.getItem("authToken");
    const cartValue = await AsyncStorage.getItem("cartValue");
    console.log(authToken);
    console.log(cartValue);
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    //TODO: Change both auth accordingly
    this.props.navigation.navigate(authToken && cartValue ? "Home" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default AuthLoadingScreen;
