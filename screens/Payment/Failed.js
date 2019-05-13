import React, { Component } from "react";
import { Image, View } from "react-native";
import styled from "styled-components";

import RoundButton from "../../base_components/RoundButton";
import Assets from "../../constants/assets";
import AppBase from "../../base_components/AppBase";
import PrimaryText from "../../base_components/PrimaryText";

const ImageSection = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Divider = styled.View`
  width: 80%;
  margin: 30px auto 10px auto;
  border-bottom-width: 1px;
  border-bottom-color: #e0e2e5;
`;

const ErrorText = styled.Text`
  color: #d32121;
  font-size: 20px;
  text-align: center;
  margin: 20px auto;
`;

const PriceText = styled.Text`
  font-size: 40px;
  color: #213052;
  text-align: center;
`;

const CentText = styled.Text`
  font-size: 25px;
`;

const Currency = styled.Text`
  font-size: 24px;
  margin: 0 5px;
  color: #99aac6;
`;

class PaymentFailed extends Component {
  static navigationOptions = {
    // title: <PrimaryText style={{ flex: 1 }}>Payment Failed</PrimaryText>
    // headerLeft: null
  };

  render() {
    const totalAmount = this.props.navigation.getParam("totalAmount", 0);
    let rupee = `${totalAmount}`;
    let paise = "00";
    if (totalAmount.includes(".")) {
      rupee = `${totalAmount}`.split(".")[0];
      try {
        paise = `${totalAmount}`.split(".")[1].padEnd(2, "0") || "00";
      } catch (e) {
        paise = "00";
      }
    }

    return (
      <AppBase
        style={{
          backgroundColor: "#ffffff",
          justifyContent: "space-evenly"
        }}
      >
        <ImageSection>
          <ErrorText>Payment Failed!</ErrorText>
          <Image
            style={{
              width: 120,
              height: 120
            }}
            resizeMode="contain"
            source={Assets.Images.paymentFailed}
          />

          <ErrorText>Your payment has been approved!</ErrorText>
          <Divider />
        </ImageSection>

        <View
          style={{
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Currency>₹</Currency>
          <PriceText>
            {rupee}
            <CentText>.{paise}</CentText>
          </PriceText>
        </View>

        <RoundButton
          outline
          outlineColor="#777777"
          title="Go to Home."
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        />
      </AppBase>
    );
  }
}

export default PaymentFailed;
