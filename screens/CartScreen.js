/* eslint-disable react/forbid-prop-types */
import React, { Component } from "react";
import { FlatList, ScrollView, AsyncStorage } from "react-native";
import styled from "styled-components";
import _ from "lodash";

import Item from "../components/Checkout/Item";
import AppBase from "../base_components/AppBase";
import BillReceipt from "../components/Checkout/BillReceipt";
import BR from "../base_components/BR";
import ViewRow from "../base_components/ViewRow";
import PrimaryText from "../base_components/PrimaryText";
import { createOrder } from "../api/orders";

const FooterContainer = styled.View`
  height: 10%;
  width: 100%;
  background-color: white;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const AmountContainer = styled.View`
  flex: 0.5;
  align-items: center;
  height: 100%;
  background-color: #d9d9d9;
  justify-content: center;
`;

const PayButton = styled.TouchableOpacity`
  height: 100%;
  background-color: green;
  flex: 0.5;
  justify-content: center;
  align-items: center;
`;

const FooterText = styled(PrimaryText)`
  font-weight: bold;
  color: #eee;
  font-size: 16px;
`;

class CartScreen extends Component {
  state = {
    cartItems: [],
    user: {},
    token: ""
  };

  async componentDidMount() {
    const user = await AsyncStorage.getItem("user");
    const userObj = JSON.parse(user);
    const cartItemsInStorage = await AsyncStorage.getItem("cartValue");
    const cartItems = JSON.parse(cartItemsInStorage);
    const token = await AsyncStorage.getItem("authToken");
    this.setState({ cartItems, user: userObj, token });
  }

  async componentWillUnmount() {
    const cartItems = this.state.cartItems;
    await AsyncStorage.setItem("cartValue", JSON.stringify(cartItems));
  }

  cartChanges = (item, qty = undefined) => {
    const currentCart = this.state.cartItems;
    if (!qty) {
      let updateCart = currentCart.filter(obj => obj._id !== item._id);
      this.setState({ cartItems: updateCart });
    } else {
      let updateCart = currentCart.map(obj => {
        if (obj._id === item._id) {
          const newObj = obj;
          newObj.qty = qty;
          return newObj;
        }
        return obj;
      });
      this.setState({ cartItems: updateCart });
    }
  };

  handlePayment = async totalAmount => {
    const cartData = this.state.cartItems;

    if (cartData.length > 0) {
      const postData = cartData.map(item => ({
        id: item.food._id,
        quantity: item.qty,
        price: item.price
      }));

      const order = await createOrder(
        this.state.user._id,
        postData,
        totalAmount,
        cartData[0].restaurantId,
        {
          Authorization: `Bearer ${this.state.token}`
        }
      );

      if (order) {
        this.props.navigation.navigate("Payment", {
          orderId: order.data.order._id,
          totalAmount: totalAmount,
          token: this.state.token
        });
      }
      // this.props.createOrder(postData, totalAmount);
    }
  };

  _renderItem = ({ item }) => (
    <Item
      key={item._id}
      name={item.food.name}
      price={`₹${item.price * item.qty}`}
      qty={item.qty}
      onChange={qty => this.cartChanges(item, qty)}
    />
  );

  renderCartItems = cartData => {
    if (cartData.length > 0) {
      return (
        <FlatList
          style={{
            elevation: 2,
            borderWidth: 1,
            borderColor: "#fcfcfc"
          }}
          data={cartData}
          renderItem={this._renderItem}
          keyExtractor={item => item._id}
        />
      );
    }

    return (
      <ViewRow>
        <PrimaryText>Your Cart is empty.</PrimaryText>
      </ViewRow>
    );
  };

  renderBillReceipt = billInfo => {
    const cartData = this.state.cartItems;

    if (cartData.length > 0) {
      return (
        <BillReceipt
          style={{
            borderTopWidth: 4,
            borderTopColor: "#eee"
          }}
          billInfo={billInfo}
        />
      );
    }
    return null;
  };

  renderFooter = totalAmount => {
    const cartData = this.state.cartItems;

    if (cartData.length > 0) {
      return (
        <FooterContainer>
          <AmountContainer>
            <PrimaryText>₹ {totalAmount}</PrimaryText>
          </AmountContainer>
          <PayButton onPress={() => this.handlePayment(totalAmount)}>
            <FooterText>Proceed To Pay</FooterText>
          </PayButton>
        </FooterContainer>
      );
    }
    return null;
  };

  render() {
    const cartData = this.state.cartItems;
    let totalBill = parseFloat(
      cartData.reduce((total, item) => total + item.price * item.qty, 0)
    );
    const taxPercent = 8;

    const tax = +(totalBill * (taxPercent / 100)).toFixed(2);

    const billInfo = [
      {
        name: "Items Total",
        total: totalBill
      },
      {
        name: "Offer Discount",
        total: -18
      },
      {
        name: `Taxes (${taxPercent}%)`,
        total: tax
      }
    ];

    totalBill += tax - 18;

    return (
      <AppBase
        style={{
          alignItems: "stretch"
        }}
      >
        <ScrollView>
          <BR size={10} />
          {this.renderCartItems(cartData)}
          <BR />
          {this.renderBillReceipt(billInfo)}
          <BR />
        </ScrollView>
        {this.renderFooter(totalBill)}
      </AppBase>
    );
  }
}

export default CartScreen;
