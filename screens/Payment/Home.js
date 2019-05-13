/* eslint-disable react/forbid-prop-types */
import React, { Component } from "react";
import debounce from "lodash/debounce";
import styled from "styled-components";
import Stripe from "react-native-stripe-api";
import { CreditCardInput } from "react-native-credit-card-input";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from "react-native";

import RoundButton from "../../base_components/RoundButton";
import AppBase from "../../base_components/AppBase";
import BR from "../../base_components/BR";
import Colors from "../../constants/colors";
import PrimaryText from "../../base_components/PrimaryText";
import { deleteOrder } from "../../api/orders";

const windowWidth = Dimensions.get("window").width - 18;

const Heading = styled.Text`
  font-size: 14px;
  color: #9da8ba;
  text-align: center;
  margin-bottom: 10px;
`;

const SubHeading = styled.Text`
  font-size: 16px;
  color: #213052;
  text-align: center;
`;

const Section = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px 20px;
  background: #fff;
`;
const SectionItem = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

class PaymentHome extends Component {
  static navigationOptions = {
    // title: <PrimaryText style={{ flex: 1 }}> Make Payment</PrimaryText>,
    headerStyle: {
      backgroundColor: "#f5f5f5",
      borderBottomWidth: 1,
      borderStyle: "solid",
      borderColor: "#fcfcfc"
    },
    headerTintColor: "#000",
    headerTitleStyle: {
      fontWeight: "bold"
    },
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.state = {
      cardData: {},
      validData: false,
      loadingPayment: false
    };
  }

  _onChange = form => {
    this.setState((s, p) => ({
      cardData: form,
      validData: form.valid
    }));
  };

  doPayment = async (orderId, authToken, totalAmount) => {
    this.setState({
      loadingPayment: true
    });

    const {
      cardData: { values: cardValue }
    } = this.state;

    const apiKey = "pk_test_rM2enW1rNROwx4ukBXGaIzhr";
    const client = new Stripe(apiKey);
    const expMonth = cardValue.expiry.split("/")[0];
    const expYear = cardValue.expiry.split("/")[1];
    // Create a Stripe token with new card infos
    const token = await client.createToken({
      number: cardValue.number.replace(" ", ""),
      exp_month: expMonth,
      exp_year: expYear,
      cvc: cardValue.cvc,
      address_zip: cardValue.postalCode
    });

    if (token) {
      this.props.navigation.navigate("PaymentSuccess", { totalAmount });
    } else {
      await handleCancelOrder(orderId, authToken);
      this.props.navigation.navigate("PaymentFailed", { totalAmount });
    }
  };

  handleCancelOrder = async (orderId, token) => {
    const response = await deleteOrder(orderId, {
      Authorization: `Bearer ${token}`
    });
    if (response.status === 200) {
      this.props.navigation.navigate("Home");
    }
  };

  render() {
    const totalAmount = this.props.navigation.getParam("totalAmount", 0);
    const orderId = this.props.navigation.getParam("orderId", "");
    const token = this.props.navigation.getParam("token", "");
    return (
      <AppBase>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
          <ScrollView bounces={false}>
            <BR size={10} />
            <Section>
              <SectionItem>
                <Heading>{"Order Id".toUpperCase()}</Heading>
                <SubHeading>{orderId}</SubHeading>
              </SectionItem>
            </Section>

            <Section>
              <SectionItem>
                <Heading>SELLER</Heading>
                <SubHeading>Restaurant App</SubHeading>
              </SectionItem>
              <SectionItem>
                <Heading>PRICE</Heading>
                <SubHeading>₹ {totalAmount}</SubHeading>
              </SectionItem>
            </Section>

            <Section
              style={{
                elevation: 2,
                borderBottomWidth: 2,
                borderBottomColor: "#eee"
              }}
            >
              <SectionItem>
                <Heading>Date</Heading>
                <SubHeading>{new Date().toDateString()}</SubHeading>
              </SectionItem>
            </Section>

            <View
              style={{
                marginTop: 20
              }}
            >
              <CreditCardInput
                requiresCVC
                cardScale={1}
                inputContainerStyle={{
                  backgroundColor: "#FFF",
                  paddingTop: 15,
                  paddingBottom: 5,
                  flexDirection: "column",
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderWidth: 1,
                  borderColor: "#eee",
                  minWidth: 150,
                  borderRadius: 6
                }}
                onChange={debounce(this._onChange, 500)}
              />
            </View>

            <RoundButton
              loading={this.state.loadingPayment}
              title="Make Payment"
              buttonColor={Colors.green}
              onPress={() => this.doPayment(orderId, token, totalAmount)}
              disabled={!this.state.validData}
              baseStyle={{
                marginTop: 30,
                marginBottom: Platform.OS === "ios" ? 100 : 20
              }}
            />

            <RoundButton
              title="Cancel Order"
              onPress={() => this.handleCancelOrder(orderId, token)}
              baseStyle={{
                marginTop: 30,
                marginBottom: Platform.OS === "ios" ? 100 : 20
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </AppBase>
    );
  }
}

export default PaymentHome;
