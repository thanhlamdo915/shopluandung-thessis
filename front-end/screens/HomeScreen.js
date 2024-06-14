// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Platform,
//   ScrollView,
//   Pressable,
//   TextInput,
//   Image,
//   FlatList,
//   Button,
//   Touchable,
//   TouchableOpacity,
// } from 'react-native';
// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useContext,
//   useRef,
// } from 'react';
// import {Ionicons} from '@expo/vector-icons';
// import {MaterialIcons} from '@expo/vector-icons';
// import {Entypo} from '@expo/vector-icons';
// import {AntDesign} from '@expo/vector-icons';
// import axios from 'axios';
// import {useNavigation} from '@react-navigation/native';
// import {useSelector} from 'react-redux';
// import {BottomModal, SlideAnimation, ModalContent} from 'react-native-modals';
// import {UserType} from '../UserContext';
// import Category from '../components/Category';
// import ProductCard from '../components/ProductCard';
// import {FontAwesome} from '@expo/vector-icons';
// import RNPickerSelect from 'react-native-picker-select';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome} from '@expo/vector-icons';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {FontAwesome5} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {useContext, useEffect, useState} from 'react';
import {UserType} from '../UserContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const HomeScreen = () => {
  const {userId, setUserId} = useContext(UserType);
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPrices, setTotalPrices] = useState([]);
  const [totalRewardPoints, setTotalRewardPoints] = useState([]);
  const [usedRewardPoints, setUsedRewardPoints] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchUserProfile();
    getAllTotalRewardPoints();
  }, [userId, modalVisible]);
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
  };
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching profile for user ID:', userId); // Log userId for debugging
      if (!userId) {
        console.log('No user ID provided');
        return;
      }
      const response = await axios.get(
        `http://localhost:8000/profile/${userId}`
      );
      const {user} = response.data;
      setUser(user);
    } catch (error) {
      console.log('error error', error);
    }
  };
  const getAllTotalRewardPoints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/${userId}`
      ); // Fetch all orders
      const {orders} = response.data;
      const totalPrices = orders.map((order) => order.totalPrice);
      setTotalPrices(totalPrices);
      // console.log(totalPrices);
      const totalRewardPoints = orders.map((order) => order.totalRewardPoints);
      setTotalRewardPoints(totalRewardPoints);
      // console.log(totalRewardPoints);
      const usedRewardPoints = orders.map((order) => order.usedRewardPoints);
      setUsedRewardPoints(usedRewardPoints);
      // console.log(usedRewardPoints);
    } catch (error) {
      // console.error('Error fetching orders 123:', error);
    }
  };

  const sumArray = (arr) => {
    return arr.reduce((acc, currentValue) => acc + currentValue, 0);
  };

  // Ví dụ sử dụng

  const sumTotalPrices = sumArray(totalPrices);
  // console.log(sumTotalPrices);
  const sumTotalRewardPoints = sumArray(totalRewardPoints);
  // console.log(sumTotalRewardPoints);
  const sumUsedRewardPoints = sumArray(usedRewardPoints);
  // console.log(sumUsedRewardPoints);
  const numberOfOrders = totalPrices.length;

  // console.log(numberOfOrders);
  var member = [0, 0, 'Member'];
  const silver = [1, 100000, 'Silver'];
  const gold = [5, 1000000, ' Gold'];
  const diamond = [10, 5000000, 'Diamond'];
  if (numberOfOrders > 0 && sumTotalPrices > 0) {
    member = silver;
  } else if (numberOfOrders > 5 && sumTotalPrices > 1000000) {
    member = gold;
  } else if (numberOfOrders > 10 && sumTotalPrices > 5000000) {
    member = diamond;
  }

  return (
    <>
      <SafeAreaView>
        <View>
          <View style={{}}>
            {/*Header*/}
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                height: 110,
                justifyContent: 'space-between',
                paddingTop: 50,
                backgroundColor: '#822DE3',
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >
                Hi, {user?.name}
              </Text>
              <FontAwesome name="bell" size={24} color="white" />
            </View>
            <View
              style={{
                backgroundColor: 'white',
                opacity: 0.7,
                padding: 10,
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="medal"
                  size={24}
                  color="#D69301"
                />
                <Text
                  style={{
                    marginLeft: 10,
                    marginRight: 30,
                    color: '#D69301',
                  }}
                >
                  {member[2]}
                </Text>
                {/* <AntDesign name="right" size={18} color="#D69301" /> */}
              </Pressable>
              <View
                style={{height: '100%', width: 2, backgroundColor: '#909090'}}
              ></View>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <FontAwesome5 name="coins" size={24} color="#D69301" />
                <Text
                  style={{
                    marginLeft: 10,
                    marginRight: 30,
                    color: '#D69301',
                  }}
                >
                  {Intl.NumberFormat({
                    style: 'currency',
                    currency: 'VND',
                  }).format(user?.rewardPoints)}{' '}
                  Points
                  {/* {user?.rewardPoints} Points */}
                </Text>
                {/* <AntDesign name="right" size={18} color="#D69301" /> */}
              </Pressable>
            </View>
            {/*Body*/}
            <View
              style={{
                alignItems: 'center',
                borderRadius: 16,
                // backgroundColor:
                // 'linear-gradient(90deg, rgba(195,137,4,0.8141850490196079) 53%, rgba(241,197,22,1) 92%, rgba(251,209,26,0.9458377100840336) 100%)',
                backgroundColor: '#F2F2F2',
              }}
            >
              <View
                style={{
                  paddingTop: 20,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    alignItems: 'center',

                    width: '90%',
                    height: 50,

                    // backgroundColor: '#FAEAB2',
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      alignItems: 'center',
                      fontSize: '30',
                      fontWeight: 'bold',
                    }}
                  >
                    Membership Level : {member[2]}
                  </Text>
                </View>

                <View style={{flexDirection: 'column', paddingTop: 40}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // height: 100,
                      width: '91%',
                      alignItems: 'center',
                      backgroundColor: '#FEC827',
                      borderColor: '#F68501',
                      borderWidth: 0.5,
                      borderRadius: 10,
                      justifyContent: 'space-between',
                      padding: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        width: '50%',

                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        alignItems: 'center',
                      }}
                    >
                      Orders Total
                    </Text>
                    <Text
                      style={{
                        width: '50%',

                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {numberOfOrders}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // height: 100,
                      width: '91%',
                      alignItems: 'center',
                      backgroundColor: '#FEC827',
                      borderColor: '#F68501',
                      borderWidth: 4,
                      borderRadius: 10,
                      justifyContent: 'space-between',
                      padding: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        width: '50%',

                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        alignItems: 'center',
                      }}
                    >
                      Spending
                    </Text>
                    <Text
                      style={{
                        width: '50%',

                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Intl.NumberFormat('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(sumTotalPrices)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      // height: 100,
                      width: '91%',
                      alignItems: 'center',
                      backgroundColor: '#FEC827',
                      borderColor: '#F68501',
                      borderWidth: 4,
                      borderRadius: 10,
                      justifyContent: 'space-between',
                      padding: 20,
                      marginBottom: 20,
                    }}
                  >
                    <Text
                      style={{
                        width: '50%',

                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        alignItems: 'center',
                      }}
                    >
                      Savings
                    </Text>
                    <Text
                      style={{
                        width: '50%',

                        color: 'white',
                        fontSize: 18,
                        fontWeight: '600',
                        alignItems: 'center',
                      }}
                    >
                      {Intl.NumberFormat('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(sumUsedRewardPoints)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/*Rank info*/}
            <View styles={{justifyContent: 'center'}}>
              <View
                style={{
                  marginTop: 30,
                  flexDirection: 'column',
                  // width: '90%',
                  padding: 20,
                  height: 50,
                  backgroundColor: '#FFFFFF',
                  height: '100%',
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: '16',
                    fontWeight: 'bold',
                    paddingBottom: 20,
                  }}
                >
                  How to ranked me ?
                </Text>
                <Text style={{fontSize: 16, fontWeight: '400'}}>
                  Member : Register an account
                </Text>
                <Text style={{fontSize: 16, fontWeight: '400'}}>
                  Silver : {silver[0]} order over{' '}
                  {Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(silver[1])}
                  {' (more 1% offer)'}
                </Text>
                <Text style={{fontSize: 16, fontWeight: '400'}}>
                  Gold : {gold[0]} order over{' '}
                  {Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(gold[1])}
                  {' (2% offer)'}
                </Text>
                <Text style={{fontSize: 16, fontWeight: '400'}}>
                  Diamond : {diamond[0]} order over{' '}
                  {Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(diamond[1])}
                  {' (3% offer)'}
                </Text>
                <Text
                  style={{
                    color: 'red',
                    fontSize: 15,
                    paddingTop: 10,
                    fontWeight: '600',
                  }}
                >
                  Offer by membership level is calculated on the price used
                  reward points
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({});
