/* eslint-disable react/forbid-prop-types */
import React, { Component } from "react";
import { ScrollView } from "react-native";

import AppBase from "../base_components/AppBase";
import RestaurantList from "../components/RestaurantList";
import PrimaryText from "../base_components/PrimaryText";
import RightButtons from "../components/RightHeaderButtons";

import { getRestaurantByType } from "../api/restaurants";

class CuisineRestaurantScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <PrimaryText>Restaurant App</PrimaryText>,
    headerRight: <RightButtons />
  });

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      token: navigation.getParam("token", ""),
      cuisineType: navigation.getParam("cuisineType", ""),
      restaurantList: []
    };
  }

  async componentDidMount() {
    // this.props.fetchRestaurantByType(this.props.cuisineType, true);
    const restaurants = await getRestaurantByType(this.state.cuisineType, {
      Authorization: `Bearer ${this.state.token}`
    });
    this.setState({ restaurantList: restaurants.data });
  }

  handleFilter = type => {};

  render() {
    return (
      <AppBase
        style={{
          alignItems: "stretch",
          backgroundColor: "#fff"
        }}
      >
        <ScrollView>
          <RestaurantList
            hideFilter
            restaurantList={this.state.restaurantList}
            // handleFilter={this.handleFilter}
          />
        </ScrollView>
      </AppBase>
    );
  }
}

export default CuisineRestaurantScreen;
