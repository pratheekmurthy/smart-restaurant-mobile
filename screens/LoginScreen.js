import React, { Component } from "react";
import { StyleSheet, View, AsyncStorage } from "react-native";
import { Input, Text, Button, Overlay } from "react-native-elements";

import AppBase from "../base_components/AppBase";
import PrimaryText from "../base_components/PrimaryText";
import BR from "../base_components/BR";
import TextInput from "../base_components/TextInput";
import RoundButton from "../base_components/RoundButton";

import { login } from "../api/auth";

class LoginScreen extends Component {
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
          const userResp = await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.user)
          );
          await AsyncStorage.setItem("cartValue", JSON.stringify([]));
          console.log(response.user);
          if (response.user.role !== "admin") {
            // const setResp = await AsyncStorage.getItem("authToken");
            this.props.navigation.navigate("Main");
          } else {
            this.props.navigation.navigate("Admin");
          }
        } catch (error) {
          this.setState({
            disabled: false,
            loading: false,
            loginError: true,
            loginErrorResponse: error.message
          });
        }
      } else {
        throw new Error("Something went wrong");
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
      <AppBase
        style={{
          justifyContent: "center"
        }}
      >
        <PrimaryText bold size={26}>
          Restaurant App
        </PrimaryText>
        <BR size={50} />
        <Overlay
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="red"
          width="auto"
          height="auto"
          isVisible={this.state.loginError}
          onBackdropPress={() => {
            this.setState({ loginError: false, loginErrorResponse: "" });
          }}
        >
          <PrimaryText>{this.state.loginErrorResponse}</PrimaryText>
        </Overlay>
        <TextInput
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
        <BR />
        <TextInput
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
        <RoundButton
          title="Login"
          type="outline"
          onPress={this.onSubmit}
          disabled={this.state.disabled}
          loading={this.state.loading}
        />
        <RoundButton
          title="Register"
          type="outline"
          onPress={() => this.props.navigation.navigate("Register")}
        />
      </AppBase>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loginContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  errorStyle: {
    color: "red"
  }
});

export default LoginScreen;
