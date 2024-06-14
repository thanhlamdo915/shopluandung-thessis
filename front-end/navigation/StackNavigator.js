import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ShoppingScreen from '../screens/HomeScreen';
import LoyaltyScreen from '../screens/LoyaltyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {Entypo} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {Octicons} from '@expo/vector-icons';
import ProductInfoScreen from '../screens/ProductInfoScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import AddressScreen from '../screens/AddressScreen';
import CartScreen from '../screens/CartScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import OrderScreen from '../screens/OrderScreen';
import LandingScreen from '../screens/ShoppingScreen';
import AdminPanel from '../screens/AdminPanel';
import ViewOrderHistory from '../screens/ViewOrderHistory';
import SearchPage from '../screens/SearchPage';
import CategoryProduct from '../screens/CategoryProduct';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={ShoppingScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarLabelStyle: {color: '#822DE2'},
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Shopping"
          component={LandingScreen}
          options={{
            tabBarLabel: 'Shopping',
            tabBarLabelStyle: {color: '#822DE2'},
            headerShown: false,

            tabBarIcon: ({focused}) =>
              focused ? (
                <Entypo name="shopping-cart" size={24} color="black" />
              ) : (
                <AntDesign name="shoppingcart" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Loyalty"
          component={LoyaltyScreen}
          options={{
            tabBarLabel: 'Reward',
            tabBarLabelStyle: {color: '#822DE2'},
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Entypo name="retweet" size={24} color="black" />
              ) : (
                <AntDesign name="retweet" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarLabelStyle: {color: '#822DE2'},
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Octicons name="feed-person" size={24} color="black" />
              ) : (
                <Octicons name="person" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Info"
          component={ProductInfoScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Address"
          component={AddAddressScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Add"
          component={AddressScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Confirm"
          component={ConfirmationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminPanel"
          component={AdminPanel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ViewOrderHistory"
          component={ViewOrderHistory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SearchPage"
          component={SearchPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CategoryProduct"
          component={CategoryProduct}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
