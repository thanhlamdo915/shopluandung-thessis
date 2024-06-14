import {StyleSheet, Text, View, FlatList, Pressable, Image} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {UserType} from '../UserContext';
import {useContext} from 'react';
import ProductHistory from '../components/ProductHistory';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

const ViewOrderHistory = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const {userId, setUserId} = useContext(UserType);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/${userId}`
      );
      const orders = response.data.orders;
      // orders = orders.sort(
      //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      // );
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // setOrders(orders);
      // setLoading(false);
      // // console.log('orders', orders);
      // console.log('orders', orders[0].products);
      setOrders(sortedOrders);
      setLoading(false);
      console.log('orders', sortedOrders[0].products);
    } catch (error) {
      console.log('error', error);
    }
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
      console.log('error', error);
    }
  };
  const renderProductItem = ({item}) => (
    <View style={styles.productItem}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderOrderItem = ({item}) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderDate}>
        Date: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.orderTotal}>
        Total:{' '}
        {Intl.NumberFormat('it-IT', {
          style: 'currency',
          currency: 'VND',
        }).format(item.totalPrice)}
      </Text>
      <Text style={styles.reward}>
        Total reward Points:{' '}
        {Intl.NumberFormat('it-IT', {
          style: 'currency',
          currency: 'VND',
        }).format(item.totalRewardPoints)}
      </Text>
      <Text style={styles.reward}>
        Used Reward Points:{' '}
        {Intl.NumberFormat('it-IT', {
          style: 'currency',
          currency: 'VND',
        }).format(item.usedRewardPoints)}
      </Text>
      <Text style={styles.orderItems}>Items: {item.products.length}</Text>
      <FlatList
        data={item.products}
        // renderItem={renderProductItem}
        // keyExtractor={(product) => product._id}
        // horizontal
        renderItem={({item}) => (
          <ProductHistory
            item={item}
            //   handleProductClick={handleProductDetails}
            //   toggleFavorite={toggleFavorite}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text style={{textAlign: 'center', color: 'red'}}> go back</Text>
        </Pressable>
        <Text style={styles.header}>Order History</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
};

export default ViewOrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderDate: {
    fontSize: 16,
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  orderItems: {
    fontSize: 16,
    marginBottom: 8,
  },
  productItem: {
    flexDirection: 'row',
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
});
