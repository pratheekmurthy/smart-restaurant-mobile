import * as React from "react";
import { Text, View, StyleSheet, Button, AsyncStorage } from "react-native";
import { Constants, Permissions, BarCodeScanner } from "expo";
import { getRestaurant } from "../api/restaurants";

export default class ScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  handleBarCodeScanned = async ({ type, data }) => {
    const token = await AsyncStorage.getItem("authToken");
    const restaurant = await getRestaurant(data, {
      Authorization: `Bearer ${token}`
    });
    this.props.navigation.navigate("RestaurantInfo", {
      restaurantObj: restaurant.data
    });
    // this.setState({ scanned: true });
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end"
        }}
      >
        <BarCodeScanner
          onBarCodeRead={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {/* {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => this.setState({ scanned: false })}
          />
        )} */}
      </View>
    );
  }
}
