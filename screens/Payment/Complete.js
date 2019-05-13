import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import styled from "styled-components";
import RoundButton from "../../base_components/RoundButton";
import AppBase from "../../base_components/AppBase";
import Assets from "../../constants/assets";
import PrimaryText from "../../base_components/PrimaryText";
import { NavigationActions } from "react-navigation";

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

const SuccessText = styled.Text`
  color: #6ec015;
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

class PaymentComplete extends Component {
  static navigationOptions = {
    // title: <PrimaryText style={{ flex: 1 }}>Payment Complete</PrimaryText>
    // headerLeft: null
  };

  render() {
    const totalAmount = this.props.navigation.getParam("totalAmount", 0);
    let rupee = `${totalAmount}`;
    let paise = "00";
    if (rupee.includes(".")) {
      rupee = `${rupee}`.split(".")[0];
      try {
        paise = `${rupee}`.split(".")[1].padEnd(2, "0") || "00";
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
          <SuccessText>Payment Successful</SuccessText>
          <Image
            style={{
              width: 120,
              height: 120
            }}
            resizeMode="contain"
            source={Assets.Images.paymentComplete}
          />

          <SuccessText>Your payment has been approved!</SuccessText>
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
          baseStyle={{
            alignSelf: "flex-end"
          }}
          title="Back to Home"
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        />
      </AppBase>
    );
  }
}

export default PaymentComplete;
