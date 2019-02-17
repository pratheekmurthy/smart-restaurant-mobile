import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Input, Text, Button, Overlay } from "react-native-elements";
import { login } from "../api/login";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginErrorResponse: "",
      loginError: false,
      emailError: false,
      emailErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
      email: "",
      password: "",
      loading: false,
      disabled: true
    };
  }

  onChangeEmail = email => {
    if (!this.validateEmail(email)) {
      this.setState({
        emailError: true,
        emailErrorMessage: "Enter valid email",
        email,
        disabled: true
      });
    } else {
      this.setState({
        emailError: false,
        emailErrorMessage: "",
        email,
        disabled: this.state.passwordError || false || !!!this.state.password
      });
    }
  };

  onChangePassword = password => {
    if (password.length < 6) {
      this.setState({
        password,
        passwordError: true,
        passwordErrorMessage: "Password should be 6 or more characters",
        disabled: true
      });
    } else {
      this.setState({
        password,
        passwordError: false,
        passwordErrorMessage: "",
        disabled: this.state.emailError || false || !!!this.state.email
      });
    }
  };

  validateEmail = email => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  };

  onSubmit = async () => {
    try {
      const email = this.state.email;
      const password = this.state.password;
      this.setState({ disabled: true, loading: true });
      const response = await login({ email, password });
      if (response.success) {
        const token = response.token;
        try {
          const resp = await AsyncStorage.setItem("authToken", token);
          const setResp = await AsyncStorage.getItem("authToken");
        } catch (error) {}
      }
    } catch (error) {
      this.setState({
        disabled: false,
        loading: false,
        loginError: true,
        loginErrorResponse: error.message
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Overlay
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="red"
          width="auto"
          height="auto"
          isVisible={this.state.loginError}
          onBackdropPress={() =>
            this.setState({ loginError: false, loginErrorResponse: "" })
          }
        >
          <Text>{this.state.loginErrorResponse}</Text>
        </Overlay>
        <Text h2>Login</Text>
        <Input
          autoComplete={false}
          autoCorrect={false}
          onChangeText={this.onChangeEmail}
          value={this.state.email}
          placeholder="enter e-mail"
          label="Email"
          shake={true}
          errorStyle={styles.errorStyle}
          errorMessage={this.state.emailErrorMessage}
        />
        <Input
          secureTextEntry={true}
          autoComplete={false}
          autoCorrect={false}
          onChangeText={this.onChangePassword}
          value={this.state.password}
          placeholder="enter password"
          label="Password"
          shake={true}
          errorStyle={styles.errorStyle}
          errorMessage={this.state.passwordErrorMessage}
        />
        <Button
          title="Login"
          type="outline"
          onPress={this.onSubmit}
          disabled={this.state.disabled}
          loading={this.state.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  errorStyle: {
    color: "red"
  }
});

export default Login;
