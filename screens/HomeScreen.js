// import React from 'react';
// import {
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { WebBrowser } from 'expo';

// import { MonoText } from '../components/StyledText';

// export default class HomeScreen extends React.Component {
//   static navigationOptions = {
//     header: null,
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//           <View style={styles.welcomeContainer}>
//             <Image
//               source={
//                 __DEV__
//                   ? require('../assets/images/robot-dev.png')
//                   : require('../assets/images/robot-prod.png')
//               }
//               style={styles.welcomeImage}
//             />
//           </View>

//           <View style={styles.getStartedContainer}>
//             {this._maybeRenderDevelopmentModeWarning()}

//             <Text style={styles.getStartedText}>Get started by opening</Text>

//             <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
//               <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
//             </View>

//             <Text style={styles.getStartedText}>
//               Change this text and your app will automatically reload.
//             </Text>
//           </View>

//           <View style={styles.helpContainer}>
//             <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
//               <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>

//         <View style={styles.tabBarInfoContainer}>
//           <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

//           <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
//             <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   _maybeRenderDevelopmentModeWarning() {
//     if (__DEV__) {
//       const learnMoreButton = (
//         <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
//           Learn more
//         </Text>
//       );

//       return (
//         <Text style={styles.developmentModeText}>
//           Development mode is enabled, your app will be slower but you can use useful development
//           tools. {learnMoreButton}
//         </Text>
//       );
//     } else {
//       return (
//         <Text style={styles.developmentModeText}>
//           You are not in development mode, your app will run at full speed.
//         </Text>
//       );
//     }
//   }

//   _handleLearnMorePress = () => {
//     WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
//   };

//   _handleHelpPress = () => {
//     WebBrowser.openBrowserAsync(
//       'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
//     );
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });

import React, { Component } from "react";
import { Text, ScrollView, AsyncStorage, StyleSheet, View } from "react-native";
import startCase from "lodash/startCase";

import ViewRow from "../base_components/ViewRow";
import RippleIcon from "../base_components/RippleIcon";

import AppBase from "../base_components/AppBase";
import CuisineGrid from "../components/CuisineGrid";
import PrimaryText from "../base_components/PrimaryText";

import RestaurantList from "../components/RestaurantList";
import RightButtons from "../components/RightHeaderButtons";
import FilterRadioModal from "../components/FilterRadioModal";
import { getRestaurant, getRestaurantByType } from "../api/restaurants";
import { getAllCuisineTypes } from "../api/food";

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerLeft: (
        <ViewRow jc="flex-end" ai="center">
          <RippleIcon
            name="ios-qr-scanner"
            dark
            size={20}
            onPress={() => navigation.navigate("Scan")}
          />
        </ViewRow>
      ),
      headerTitle: <PrimaryText>Restaurant App</PrimaryText>,
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
    this.filterModalRef = React.createRef();
    this.state = {
      token: "",
      restaurantList: [],
      cuisineTypes: [],
      cartItems: []
    };
  }

  async componentDidMount() {
    const { restaurantList, cuisineTypes, token, cartItems } = this.state;
    if (!token) {
      const tokenFromStorage = await AsyncStorage.getItem("authToken");
      this.setState({ token: tokenFromStorage });
    }

    if (!cartItems || cartItems.length === 0) {
      const cartItemsInStorage = await AsyncStorage.getItem("cartValue");
      const cartItems = JSON.parse(cartItemsInStorage);
      this.setState({ cartItems });
      this.props.navigation.setParams({
        cartValue: this.state.cartItems.length
      });
    }

    if (!restaurantList || restaurantList.length === 0) {
      const restaurants = await getRestaurant(null, {
        Authorization: `Bearer ${this.state.token}`
      });
      this.setState({ restaurantList: restaurants.data });
    }

    if (!cuisineTypes || cuisineTypes.length === 0) {
      const cuisineTypes = await getAllCuisineTypes({
        Authorization: `Bearer ${this.state.token}`
      });
      this.setState({ cuisineTypes: cuisineTypes.data });
    }
  }

  handleFilter = async type => {
    if (type !== null) {
      const filterRestaurants = await getRestaurantByType(type, {
        Authorization: `Bearer ${this.state.token}`
      });
      this.setState({ restaurantList: filterRestaurants.data });
    } else {
      const restaurants = await getRestaurant(null, {
        Authorization: `Bearer ${this.state.token}`
      });
      this.setState({ restaurantList: restaurants.data });
    }
  };

  openCuisineScreen = value => {
    this.props.navigation.navigate("CuisineRestaurants", {
      token: this.state.token,
      cuisineType: value
    });
  };

  restaurantInfoScreenHandler = restaurant => {
    this.props.navigation.navigate("RestaurantInfo", {
      restaurantObj: restaurant,
      cartValue: this.state.cartItems.length
    });
  };

  render() {
    const filterData = this.state.cuisineTypes.map(type => ({
      value: type,
      label: startCase(type)
    }));
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <AppBase
        style={{
          alignItems: "stretch",
          backgroundColor: "#fff"
        }}
      >
        {filterData.length > 0 && (
          <FilterRadioModal
            heading="Cuisine Type"
            data={filterData}
            // eslint-disable-next-line no-return-assign
            pRef={el => (this.filterModalRef = el)}
            close={() => this.filterModalRef.close()}
            onClose={this.handleFilter}
          />
        )}
        <ScrollView>
          <CuisineGrid
            data={this.state.cuisineTypes}
            onPress={this.openCuisineScreen}
          />
          <RestaurantList
            onFilterIconPress={() => this.filterModalRef.open()}
            restaurantList={this.state.restaurantList}
            restaurantInfoScreenHandler={this.restaurantInfoScreenHandler}
          />
        </ScrollView>
      </AppBase>
    );
  }
}

export default HomeScreen;
