import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import Login from "./components/login";
import Dashboard from "./components/dashboard";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedSignIn: false,
      token: "",
      auth: false,
      error: false,
      errorMessage: ""
    };
  }

  async checkAuthToken() {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!!token) {
        this.setState({ auth: true, token, checkedSignIn: true });
      } else {
        this.setState({ auth: false, token, checkedSignIn: true });
      }
    } catch (error) {
      const errorMessage = error.message;
      this.setState({ error: true, errorMessage });
    }
  }

  componentDidMount() {
    this.checkAuthToken();
  }

  render() {
    return this.state.auth ? (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    ) : (
      <Login />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
