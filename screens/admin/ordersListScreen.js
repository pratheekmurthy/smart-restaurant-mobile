import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  AsyncStorage,
  Button
} from "react-native";
import PrimaryText from "../../base_components/PrimaryText";

import { getOrderByRestaurant, completeOrder } from "../../api/orders";
import colors from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: "1%",
    margin: "1%",
    elevation: 2,
    backgroundColor: colors.white
  },
  divider: {
    margin: "1%"
  },
  heading: {
    color: colors.primaryColor,
    fontSize: 16
  },
  item: {
    color: colors.blue,
    fontSize: 16
  }
});

class OrdersListScreen extends React.Component {
  static navigationOptions = {
    title: "Orders",
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
  state = {
    token: "",
    user: "",
    ordersList: []
  };

  async componentDidMount() {
    const userInStorage = await AsyncStorage.getItem("user");
    const user = JSON.parse(userInStorage);
    const token = await AsyncStorage.getItem("authToken");
    this.setState({ user, token });
    this.getData();
  }

  getData = async () => {
    const orders = await getOrderByRestaurant(
      this.state.user.restaurantId,
      false,
      {
        Authorization: `Bearer ${this.state.token}`
      }
    );
    this.setState({ ordersList: orders.data });
  };

  markComplete = async orderId => {
    const order = await completeOrder(orderId, {
      Authorization: `Bearer ${this.state.token}`
    });
    this.getData();
  };

  mapItems = items =>
    items.map((item, index) => (
      <View key={index} style={styles.card}>
        <Text>{`ItemId: ${item.id}`}</Text>
        <Text>{`Price: Rs. ${item.price}`}</Text>
      </View>
    ));
  renderItem = ({ item, index }) => (
    <View key={index}>
      {/* <View style={styles.divider}> */}
      <Text style={styles.heading}>Order Id</Text>
      <Text>{item._id}</Text>
      {/* </View> */}
      {/* <View style={styles.divider}> */}
      <Text style={styles.heading}>Total Price:</Text>
      <Text>{`Rs. ${item.totalCost}`}</Text>
      {/* </View> */}
      {/* <View style={styles.divider}> */}
      <Text style={styles.item}>Items ordered</Text>
      {item.items.map(this.mapItems)}
      {/* </View> */}
      <Button
        color="green"
        title="Complete"
        // onPress={() => console.log(item)}
        onPress={() => this.markComplete(item._id)}
      />
    </View>
  );
  render() {
    // console.log("->" + JSON.stringify(this.state.ordersList));
    if (
      !this.state.ordersList.orders ||
      this.state.ordersList.orders.length === 0
    ) {
      return (
        <View>
          <Text>Nothing found</Text>
          <Button title="Refresh" onPress={this.getData} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.ordersList.orders}
          renderItem={this.renderItem}
        />
        <Button title="Refresh" onPress={this.getData} />
      </View>
    );
  }
}

export default OrdersListScreen;
