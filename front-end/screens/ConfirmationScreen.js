import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {UserType} from '../UserContext';
import {
  FontAwesome5,
  MaterialIcons,
  Feather,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';
import {cleanCart} from '../redux/CartReducer';
import {useNavigation} from '@react-navigation/native';

const ConfirmationScreen = () => {
  const steps = [
    {title: 'Address', content: 'Address Form'},
    {title: 'Delivery', content: 'Delivery Options'},
    {title: 'Payment', content: 'Payment Details'},
    {title: 'Place Order', content: 'Order Summary'},
  ];
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const {userId, setUserId} = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState('');
  const [option, setOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [orders, setOrders] = useState([]);
  const [usedRewardPoints, setUsedRewardPoints] = useState('');

  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.price * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);
  const totalReward = cart
    ?.map((item) => item.price * (item.rewardPercentage / 100) * item.quantity)
    .reduce((curr, prev) => curr + prev, 0);

  useEffect(() => {
    fetchAddresses();
    fetchUsedRewardPoints();
  }, []);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/addresses/${userId}`
      );
      // console.log('responese', response.data);
      const {addresses} = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log('error', error);
    }
  };
  const fetchUsedRewardPoints = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/rewardPoints/${userId}`
      );
      console.log('responese', response.data);
      // usedRewardPoints123 = response.data;
      setUsedRewardPoints(response.data.rewardPoints);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/orders/${userId}`
        );
        const orders = response.data.orders;
        setOrders(orders);
        setLoading(false);

        setUsedRewardPoints(orders?.usedRewardPoints);
      } catch (error) {
        // console.log('error', error);
      }
    };
    fetchOrders();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: userId,
        cartItems: cart,
        totalPrice: total,
        shippingAddress: selectedAddress,
        paymentMethod: selectedOption,
        totalRewardPoints: totalReward,
        usedRewardPoints: usedRewardPoints,
      };

      const response = await axios.post(
        'http://localhost:8000/orders',
        orderData
      );
      console.log('Response', response);
      if (response.status === 200) {
        console.log('order created successfully', response.data);
        navigation.navigate('Order');
        dispatch(cleanCart());
        console.log('order created successfully', response.data);
      } else {
        console.log('error creating order', response.data);
      }
    } catch (error) {
      console.log('error order', error);
    }
  };

  return (
    <ScrollView style={{marginTop: 55}}>
      <View
        style={{
          backgroundColor: '#822DE2',
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{height: 26}}>
          <Pressable
            style={{position: 'absolute', left: 12}}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left-circle" size={30} color="black" />
          </Pressable>
        </View>
      </View>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 40}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            justifyContent: 'space-between',
          }}
        >
          {steps?.map((step, index) => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {index > 0 && (
                <View
                  style={[
                    {flex: 1, height: 2, backgroundColor: 'green'},
                    index <= currentStep && {backgroundColor: 'green'},
                  ]}
                />
              )}
              <View
                style={[
                  {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#ccc',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  index < currentStep && {backgroundColor: 'green'},
                ]}
              >
                {index < currentStep ? (
                  <Text
                    style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}
                  >
                    &#10003;
                  </Text>
                ) : (
                  <Text
                    style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={{textAlign: 'center', marginTop: 8}}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {currentStep == 0 && (
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            Select Delivery Address
          </Text>
          {/*Add address*/}
          <Pressable
            onPress={() => navigation.navigate('Address')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              padding: 10,
              backgroundColor: '#DAC0F7',
            }}
          >
            <Ionicons name="location-outline" size={24} color="black" />

            <Pressable>
              {selectedAddress ? (
                <Text>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{fontSize: 13, fontWeight: '500'}}>
                  Add a Address
                </Text>
              )}
            </Pressable>

            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>

          <Pressable>
            {addresses?.map((item, index) => (
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: '#D0D0D0',
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  paddingBottom: 17,
                  marginVertical: 7,
                  borderRadius: 6,
                }}
              >
                {selectedAddress && selectedAddress._id === item?._id ? (
                  <FontAwesome5 name="dot-circle" size={20} color="#008397" />
                ) : (
                  <Entypo
                    onPress={() => setSelectedAdress(item)}
                    name="circle"
                    size={20}
                    color="gray"
                  />
                )}

                <View style={{marginLeft: 6}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {item?.name}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <Text style={{fontSize: 15, color: '#181818'}}>
                    {item?.houseNo}, {item?.landmark}
                  </Text>

                  <Text style={{fontSize: 15, color: '#181818'}}>
                    {item?.street}
                  </Text>

                  <Text style={{fontSize: 15, color: '#181818'}}>
                    Hanoi, Vietnam
                  </Text>

                  <Text style={{fontSize: 15, color: '#181818'}}>
                    phone No : {item?.mobileNo}
                  </Text>
                  <Text style={{fontSize: 15, color: '#181818'}}>
                    pin code : {item?.postalCode}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 7,
                    }}
                  >
                    <Pressable
                      style={{
                        backgroundColor: '#F5F5F5',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: '#D0D0D0',
                      }}
                    >
                      <Text>Edit</Text>
                    </Pressable>

                    <Pressable
                      style={{
                        backgroundColor: '#F5F5F5',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: '#D0D0D0',
                      }}
                    >
                      <Text>Remove</Text>
                    </Pressable>

                    <Pressable
                      style={{
                        backgroundColor: '#F5F5F5',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 5,
                        borderWidth: 0.9,
                        borderColor: '#D0D0D0',
                      }}
                    >
                      <Text>Set as Default</Text>
                    </Pressable>
                  </View>

                  <View>
                    {selectedAddress && selectedAddress._id === item?._id && (
                      <Pressable
                        onPress={() => setCurrentStep(1)}
                        style={{
                          backgroundColor: '#008397',
                          padding: 10,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 10,
                        }}
                      >
                        <Text style={{textAlign: 'center', color: 'white'}}>
                          Deliver to this Address
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </Pressable>
        </View>
      )}

      {currentStep == 1 && (
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Choose your delivery options
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 8,
              gap: 7,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            {option ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setOption(!option)}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text style={{flex: 1}}>
              <Text style={{color: 'green', fontWeight: '500'}}>
                Tomorrow by 10pm
              </Text>{' '}
              - FREE delivery with your membership
            </Text>
          </View>

          <Pressable
            onPress={() => setCurrentStep(2)}
            style={{
              backgroundColor: '#DAC0F7',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep == 2 && (
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Select your payment Method
          </Text>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => setSelectedOption('cash')}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Cash on Delivery</Text>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 12,
            }}
          >
            {selectedOption === 'card' ? (
              <FontAwesome5 name="dot-circle" size={20} color="#008397" />
            ) : (
              <Entypo
                onPress={() => {
                  setSelectedOption('card');
                }}
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <Text>Credit or debit card</Text>
          </View>
          <Pressable
            onPress={() => setCurrentStep(3)}
            style={{
              backgroundColor: '#DAC0F7',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text>Continue</Text>
          </Pressable>
        </View>
      )}

      {currentStep === 3 && selectedOption === 'cash' && (
        <View style={{marginHorizontal: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Order Now</Text>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>Shipping to {selectedAddress?.name}</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{fontSize: 16, fontWeight: '500', color: 'gray'}}>
                Total Prices
              </Text>

              <Text style={{color: 'gray', fontSize: 16}}>
                {Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                }).format(total)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{fontSize: 16, fontWeight: '500', color: 'gray'}}>
                Reward Points be used :
              </Text>

              <Text style={{color: 'gray', fontSize: 16}}>
                {/* {Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                }).format */}
                {usedRewardPoints}
                {/* } */}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{fontSize: 16, fontWeight: '500', color: 'gray'}}>
                Delivery
              </Text>

              <Text style={{color: 'gray', fontSize: 16}}>VND 0</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Order Total
              </Text>

              <Text
                style={{color: '#C60C30', fontSize: 17, fontWeight: 'bold'}}
              >
                {Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                }).format(total)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
                paddingTop: 20,
              }}
            >
              <Text style={{fontSize: 16, fontWeight: '500', color: 'gray'}}>
                Reward Points for this order
              </Text>

              <Text style={{color: 'gray', fontSize: 16}}>
                {Intl.NumberFormat('it-IT', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalReward)}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              marginTop: 10,
            }}
          >
            <Text style={{fontSize: 16, color: 'gray'}}>Pay With</Text>

            <Text style={{fontSize: 16, fontWeight: '600', marginTop: 7}}>
              Pay on delivery (Cash)
            </Text>
          </View>

          <Pressable
            onPress={handlePlaceOrder}
            style={{
              backgroundColor: '#DAC0F7',
              padding: 10,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text>Place your order</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
