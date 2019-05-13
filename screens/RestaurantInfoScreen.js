/* eslint-disable react/forbid-prop-types */
import React, { Component } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  View,
  AsyncStorage,
  Alert
} from "react-native";

import AppBase from "../base_components/AppBase";
import PrimaryText from "../base_components/PrimaryText";
import SecondaryText from "../base_components/SecondaryText";
import Assets from "../constants/assets";
import FoodItem from "../components/FoodItem";
import BR from "../base_components/BR";
import RightButtons from "../components/RightHeaderButtons";
import ViewRow from "../base_components/ViewRow";
import RippleIcon from "../base_components/RippleIcon";

class RestaurantInfoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <ViewRow jc="flex-end" ai="center">
          <RippleIcon
            name="ios-cart"
            dark
            size={20}
            onPress={() => navigation.navigate("CartScreen")}
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
                {params.cartValue === 0 ? 0 : params.cartValue}
              </PrimaryText>
            </View>
          </RippleIcon>
        </ViewRow>
      )
    };
  };

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      restaurant: navigation.getParam("restaurantObj", {}),
      cartItems: []
    };
  }

  async componentDidMount() {
    const currentCart = await AsyncStorage.getItem("cartValue");
    this.setState({ cartItems: JSON.parse(currentCart) });
    // this.props.navigation.setParams({ cartValue: this.state.cartItems.length });
  }

  showDifferentRestaurantAlert = newValue => {
    Alert.alert(
      "ALERT!!!",
      "You already have items from different restaurant!!",
      [
        { text: "cancel", onPress: () => console.log("do nothing") },
        {
          text: "remove existing items",
          onPress: async () => {
            await AsyncStorage.setItem("cartValue", JSON.stringify(newValue));
          }
        }
      ],
      { cancelable: false }
    );
  };

  renderFoodList = foods => (
    <FlatList
      data={foods}
      bounces={false}
      ListHeaderComponent={this.renderHeader}
      keyExtractor={item => item._id}
      renderItem={this.renderFoodItem}
    />
  );

  renderHeader = () => (
    <ViewRow
      jc="space-between"
      style={{
        backgroundColor: "#fff",
        borderColor: "#eee",
        padding: 20,
        borderBottomWidth: 1,
        marginTop: 2
      }}
    >
      <PrimaryText
        style={{
          flex: 1
        }}
        size={20}
      >
        Menu
      </PrimaryText>
    </ViewRow>
  );

  updateCart = async (item, quantity = 1) => {
    // console.log(this.state.cartItems.every(obj => obj.restaurantId));
    let currentCart = this.state.cartItems;
    let cart = currentCart;
    cart.push({ ...item, qty: quantity });
    if (cart.every(obj => obj.restaurantId === this.state.restaurant._id)) {
      await AsyncStorage.setItem(
        "cartValue",
        JSON.stringify(this.state.cartItems)
      );
      this.setState({ cartItems: cart });
      this.props.navigation.setParams({
        cartValue: this.state.cartItems.length
      });
    } else {
      this.showDifferentRestaurantAlert([{ ...item, qty: quantity }]);
      this.props.navigation.setParams({
        cartValue: this.state.cartItems.length
      });
    }
    // this.props.onPress();
    //TODO: Update the cart
  };

  renderFoodItem = ({ item }) => {
    if (item) {
      return (
        <FoodItem
          food={item}
          // onPress={() => this.props.updateCartItems(item, 1)}
          onPress={() => this.updateCart(item, 1)}
        />
      );
    }
    return null;
  };

  render() {
    const { name: restaurantName, details, foods } = this.state.restaurant;
    return (
      <AppBase
        style={{
          justifyContent: "flex-start",
          alignItems: "stretch"
        }}
      >
        <ScrollView>
          <Image
            source={Assets.Images.placeholderRestaurant}
            style={{
              width: "100%",
              height: 200
            }}
            resizeMode="cover"
          />
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15
            }}
          >
            <PrimaryText align="left" size={24}>
              {restaurantName ? restaurantName : "Loading...."}
            </PrimaryText>
            <BR size={5} />
            <SecondaryText align="left" size={16}>
              {details ? details : "Loading...."}
            </SecondaryText>
          </View>
          {this.renderFoodList(foods)}
        </ScrollView>
      </AppBase>
    );
  }
}

export default RestaurantInfoScreen;
