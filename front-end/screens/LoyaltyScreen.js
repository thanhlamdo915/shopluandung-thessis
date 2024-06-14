import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useState, useContext, useType, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {UserType} from '../UserContext';
import axios from 'axios';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const LoyaltyScreen = () => {
  const {userId, setUserId} = useContext(UserType);
  const [user, setUser] = useState();
  const [order, setOrder] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPrices, setTotalPrices] = useState([]);
  const [totalRewardPoints, setTotalRewardPoints] = useState([]);
  const [usedRewardPoints, setUsedRewardPoints] = useState([]);
  const [dateReward, setDateReward] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.log('error', error);
      }
    };
    fetchUserProfile();
  }, [userId, modalVisible]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/orders/${userId}`
        );
        const {orders} = response.data;
        setOrder(order);
        // console.log('orders all of you', orders);
      } catch (error) {
        // console.log('error', error);
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    const getAllTotalRewardPoints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/orders/${userId}`
        ); // Fetch all orders
        const {orders} = response.data;
        const totalPrices = orders.map((order) => order.totalPrice);
        setTotalPrices(totalPrices);
        // console.log(totalPrices);
        const totalRewardPoints = orders.map(
          (order) => order.totalRewardPoints
        );
        setTotalRewardPoints(totalRewardPoints);
        // console.log(totalRewardPoints);
        const usedRewardPoints = orders.map((order) => order.usedRewardPoints);
        setUsedRewardPoints(usedRewardPoints);
        // console.log(usedRewardPoints);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    getAllTotalRewardPoints();
  }, []);
  // useEffect(() => {
  //   const fetchUsedRewardPoints = async () => {
  //     try {
  //       const response = await axios.get(
  //         'http://localhost:8000/usedRewardPoints'
  //       );
  //       const dateUsedReward = response.data;
  //       setDateReward(dateUsedReward);
  //       setLoading(false);
  //       console.dir(setDateReward);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsedRewardPoints();
  // }, []);

  return (
    <SafeAreaView>
      {/* <View
        style={{
          height: 50,
          width: '100%',
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            alignItems: 'center',
            fontSize: 16,
            fontWeight: '600',
            padding: 16,
          }}
        >
          Earn Points / Use Points
        </Text>
        <Text
          style={{
            alignItems: 'center',
            fontSize: 16,
            fontWeight: '600',
            padding: 16,
            paddingRight: 100,
          }}
        >
          Order
        </Text>
      </View> */}
      <ScrollView style={{width: '100%', height: '100%'}}>
        <View
          style={{
            width: '100%',
            height: 60,
            backgroundColor: '#DAC0F7',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 20,
          }}
        >
          <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
            Reward Points :
          </Text>
          <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
            {Intl.NumberFormat({
              style: 'currency',
              currency: 'VND',
            }).format(user?.rewardPoints)}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: 60,
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
            History reward in 01 Months ago
          </Text>
        </View>

        {/* <View style={{}}>
          <LineChart
            data={{
              labels: Array.from({length: 30}, (_, i) => (i + 1).toString()),
              datasets: [
                {
                  data: setDateReward,
                },
              ],
            }}
            width={Dimensions.get('window').width} // from react-native
            height={220}
            yAxisLabel={'$'}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                // borderRadius: 16,
              },
            }}
            bezier
            style={
              {
                // marginVertical: 8,
                // margin: 10,
                // borderRadius: 16,
              }
            }
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoyaltyScreen;

const styles = StyleSheet.create({});
