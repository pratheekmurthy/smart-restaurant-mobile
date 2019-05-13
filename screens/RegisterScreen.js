import React from "react";
import { StyleSheet, View, ScrollView, AsyncStorage } from "react-native";
import { Input, Text, Button, Overlay } from "react-native-elements";
import { register } from "../api/auth";

import AppBase from "../base_components/AppBase";
import PrimaryText from "../base_components/PrimaryText";
import BR from "../base_components/BR";
import TextInput from "../base_components/TextInput";
import RoundButton from "../base_components/RoundButton";

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signupError: false,
      signupErrorResponse: "",
      emailError: false,
      emailErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
      repeatPasswordError: false,
      repeatPasswordErrorMessage: "",
      email: "",
      password: "",
      repeatPassword: "",
      loading: false,
      disabled: true
    };
  }

  validateEmail = email => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
  };

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
        disabled:
          this.state.passwordError ||
          this.state.repeatPasswordError ||
          false ||
          !!!this.state.password ||
          !!!this.state.repeatPassword
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
        disabled:
          this.state.emailError ||
          this.state.repeatPasswordError ||
          false ||
          !!!this.state.email ||
          !!!this.state.repeatPassword
      });
    }
  };

  onChangeRepeatPassword = repeatPassword => {
    if (repeatPassword.length < 6) {
      this.setState({
        repeatPassword,
        repeatPasswordError: true,
        repeatPasswordErrorMessage:
          "repeatPassword should be 6 or more characters",
        disabled: true
      });
    } else if (repeatPassword !== this.state.password) {
      this.setState({
        repeatPassword,
        repeatPasswordError: true,
        repeatPasswordErrorMessage: "Passwords do not match",
        disabled: true
      });
    } else {
      this.setState({
        repeatPassword,
        repeatPasswordError: false,
        repeatPasswordErrorMessage: "",
        disabled:
          this.state.emailError ||
          this.state.passwordError ||
          false ||
          !!!this.state.email ||
          !!!this.state.password
      });
    }
  };

  onSubmit = async () => {
    try {
      const email = this.state.email;
      const password = this.state.password;
      const response = await register({ email, password });
      if (response.success) {
        try {
          this.props.navigation.navigate("Login");
        } catch (error) {
          this.setState({
            disabled: false,
            loading: false,
            loginError: true,
            loginErrorResponse: error.message
          });
        }
      } else if (response.error) {
        //TODO: handle the error array
        throw new Error("Something went wrong");
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
      <ScrollView>
        <AppBase
          style={{
            justifyContent: "flex-start"
          }}
        >
          <Overlay
            windowBackgroundColor="rgba(255, 255, 255, .5)"
            overlayBackgroundColor="red"
            width="auto"
            height="auto"
            isVisible={this.state.signupError}
            onBackdropPress={() =>
              this.setState({ signupError: false, signupErrorResponse: "" })
            }
          >
            <PrimaryText>{this.state.signupErrorResponse}</PrimaryText>
          </Overlay>
          <PrimaryText bold size={26}>
            Sign Up
          </PrimaryText>
          <BR size={20} />
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
          <BR />
          <TextInput
            secureTextEntry={true}
            autoComplete={false}
            autoCorrect={false}
            onChangeText={this.onChangeRepeatPassword}
            value={this.state.repeatPassword}
            placeholder="re-enter password"
            label="re-enter Password"
            shake={true}
            errorStyle={styles.errorStyle}
            errorMessage={this.state.repeatPasswordErrorMessage}
          />
          <BR />
          <RoundButton
            title="Submit"
            type="outline"
            onPress={this.onSubmit}
            disabled={this.state.disabled}
            loading={this.state.loading}
          />
        </AppBase>
      </ScrollView>
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
