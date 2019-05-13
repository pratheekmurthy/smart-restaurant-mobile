/* eslint-disable react/forbid-prop-types */
import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { withNavigation } from "react-navigation";

import ViewRow from "../base_components/ViewRow";
import RippleIcon from "../base_components/RippleIcon";
import PrimaryText from "../base_components/PrimaryText";
class RightHeaderButtons extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      cartValue: navigation.getParam("cartValue", [])
    };
  }

  // async componentDidMount() {
  //   let cartValue = await AsyncStorage.getItem("cartValue");
  //   cartValue = JSON.parse(cartValue);
  //   this.setState({ cartValue: cartValue });
  // }

  render() {
    return (
      <ViewRow jc="flex-end" ai="center">
        <RippleIcon
          name="ios-cart"
          dark
          size={20}
          onPress={() => this.props.navigation.navigate("CartScreen")}
        >
          <View
            style={{
              position: "absolute",
              right: 25,
              top: 0,
              width: 25,
              height: 25,
              justifyContent: "center",
              borderRadius: 100,
              backgroundColor: "#888"
            }}
          >
            <PrimaryText
              style={{
                color: "#fff",
                fontSize: 14
              }}
            >
              {this.state.cartValue.length === 0
                ? 0
                : this.state.cartValue.length}
            </PrimaryText>
          </View>
        </RippleIcon>
      </ViewRow>
    );
  }
}

export default withNavigation(RightHeaderButtons);
