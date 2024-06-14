import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import {Entypo} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {BottomModal, SlideAnimation, ModalContent} from 'react-native-modals';
import {UserType} from '../UserContext';
import ProductCard from '../components/ProductCard';
import {FontAwesome} from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import CategoryItem from '../components/CategoryItem';

const ShoppingScreen = (props) => {
  // const categories = ['Popular', 'Newest', 'Bicycle', 'Scooter'];
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const {userId, setUserId} = useContext(UserType);
  const [selectedAddress, setSelectedAdress] = useState('');
  const [search, setSearch] = useState('');
  const searchRef = useRef();
  const [oldProducts, setOldProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');

  console.log('searchQuery', searchQuery);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories');
        result = response.data;
        setCategory(result);
        // console.log('Categories:', response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products'); // Replace with your API endpoint for fetching all products
        setProducts(response.data);
        setOldProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/addresses/${userId}`
      );
      const {addresses} = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {});
  const handleProductDetails = (item) => {
    navigation.navigate('Info', {
      id: item.productId,
      category: item.category,
      name: item.name,
      price: item?.price,
      image: item.image,
      variation: item?.variation,
      rewardPercentage: item?.rewardPercentage,
      description: item?.description,
      quantity: item?.quantity,
      rewardPercentage: item?.rewardPercentage,
      item: item,
    });
  };
  const handleCategoryPage = (item) => {
    props.navigation.navigate('CategoryProduct', {
      categoryQuery: item._id,
    });
  };

  // const handleLoadMore = () => {
  //   setItemsPerPage(itemsPerPage + 4);
  // };
  const handleLoadMore = () => {
    setItemsPerPage((prevItemsPerPage) => prevItemsPerPage + 4);
  };
  const displayedProducts = products.slice(0, itemsPerPage);
  const hasMoreProducts = products.length > itemsPerPage;
  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === 'android' ? 40 : 0,
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        {/*Header*/}
        <View>
          {/*Search bar*/}
          <View
            style={{
              backgroundColor: '#822DE2',
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 7,
                gap: 10,
                backgroundColor: 'white',
                borderRadius: 3,
                height: 38,
                flex: 1,
                paddingLeft: 10,
              }}
            >
              <TextInput
                placeholder="Search you want to buy for baby"
                value={searchQuery}
                onChangeText={(txt) => setSearchQuery(txt)}
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: 'black',
                }}
              />
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 7,
                  gap: 10,
                  backgroundColor: 'white',
                  borderRadius: 3,
                  height: 38,
                }}
                onPress={() => {
                  if (searchQuery) {
                    props.navigation.navigate('SearchPage', {
                      searchQuery,
                    });
                  }
                }}
              >
                <AntDesign
                  style={{paddingRight: 10}}
                  name="search1"
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {/*Cart*/}
            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Cart');
              }}
            >
              <FontAwesome name="shopping-bag" size={24} color="white" />
            </Pressable>
            <View
              style={{
                backgroundColor: 'white',
                width: 20,
                height: 20,
                borderRadius: 20 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Text style={{}}>{cart.length}</Text>
            </View>
          </View>
          {/*Add address*/}
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
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
          {/*Category*/}
          <View>
            <FlatList
              horizontal={true}
              data={category}
              renderItem={({item}) => (
                <CategoryItem
                  item={item}
                  handleCategoryClick={handleCategoryPage}
                />
              )}
              style={{marginLeft: 10}}
            ></FlatList>
          </View>
          {/*Category*/}
        </View>
        {/*Product display*/}
        <ScrollView>
          <View>
            <FlatList
              data={displayedProducts}
              numColumns={2}
              // keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <ProductCard
                  item={item}
                  handleProductClick={handleProductDetails}
                  // toggleFavorite={toggleFavorite}
                />
              )}
              showsVerticalScrollIndicator={false}
            ></FlatList>
          </View>
          {/*Load more button*/}
          <View
            style={{
              // height: 60,
              width: '100%',
              // backgroundColor: '#F5F5F5',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 10,
            }}
          >
            <Pressable
              style={{
                backgroundColor: '#DAC0F7',
                color: '#FFFFFF',
                padding: 10,
                margin: 10,
                borderRadius: 5,
                height: 50,
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleLoadMore}
            >
              <Text
                style={{
                  color: 'black',
                  alignItems: 'center',
                  fontSize: 13,
                  fontWeight: 'bold',
                }}
              >
                Load more
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={['up', 'down']}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: 'bottom',
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{width: '100%', height: 400}}>
          <View style={{marginBottom: 8}}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              Choose your Location
            </Text>

            <Text style={{marginTop: 5, fontSize: 16, color: 'gray'}}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* already added addresses */}
            {addresses?.map((item, index) => (
              <Pressable
                key={`address-${index}`}
                onPress={() => setSelectedAdress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor:
                    selectedAddress === item ? '#FBCEB1' : 'white',
                }}
              >
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 3}}
                >
                  <Text style={{fontSize: 13, fontWeight: 'bold'}}>
                    {item?.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{width: 130, fontSize: 13, textAlign: 'center'}}
                >
                  {item?.houseNo},{item?.landmark}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{width: 130, fontSize: 13, textAlign: 'center'}}
                >
                  {item?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{width: 130, fontSize: 13, textAlign: 'center'}}
                >
                  Hanoi, Vietnam
                </Text>
              </Pressable>
            ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Address');
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: '#D0D0D0',
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: '#0066b2',
                  fontWeight: '500',
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{flexDirection: 'column', gap: 7, marginBottom: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{color: '#0066b2', fontWeight: '400'}}>
                Enter an Vietnam postcode
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{color: '#0066b2', fontWeight: '400'}}>
                Use My Currect location
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{color: '#0066b2', fontWeight: '400'}}>
                Deliver outside Vietnam
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default ShoppingScreen;

const styles = StyleSheet.create({});
