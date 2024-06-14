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
import {AntDesign} from '@expo/vector-icons';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {UserType} from '../UserContext';
import ProductCard from '../components/ProductCard';
import {FontAwesome} from '@expo/vector-icons';
import Feather from 'react-native-vector-icons/Feather';
import {useRoute} from '@react-navigation/native';
import Modal from 'react-native-modals';

const CategoryProduct = () => {
  const route = useRoute();
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [oldProducts, setOldProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [searchResults, setSearchResults] = useState([]);
  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);
  //   const [searchFilter, setSearchFilter] = useState(false);
  //   const [activeFilter, setActiveFilter] = useState(null); // New state for active filter

  const [categoryQuery, setCategoryQuery] = useState(
    route.params?.categoryQuery || ''
  );

  useEffect(() => {
    if (route.params?.categoryQuery) {
      fetchSearchResults(route.params.categoryQuery);
    }
  }, [route.params?.categoryQuery]);

  const handleSearch = () => {
    fetchSearchResults(categoryQuery);
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
  //   const toggleFavorite = (item) => {
  //     setProducts(
  //       products.map((prod) => {
  //         if (prod._id === item._id) {
  //           console.log('prod: ', prod);
  //           return {
  //             ...prod,
  //             isFavorite: !prod.isFavorite,
  //           };
  //         }
  //         return prod;
  //       })
  //     );
  //   };
  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/category/${categoryQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for products:', error);
    }
  };

  const handleLoadMore = () => {
    setItemsPerPage(itemsPerPage + 4);
  };
  const displayedProducts = searchResults.slice(0, itemsPerPage);
  //   const applyFilter = async (filter) => {
  //     try {
  //       let endpoint;
  //       switch (filter) {
  //         case 'name':
  //           endpoint = `filterByName/${categoryQuery}`;
  //           break;
  //         case 'priceLowToHigh':
  //           endpoint = `filterByPriceLowToHigh/${searchQuery}`;
  //           break;
  //         case 'priceHighToLow':
  //           endpoint = `filterByPriceHighToLow/${searchQuery}`;
  //           break;
  //         default:
  //           setSearchResults(products); // Reset to original search results if no filter
  //           return;
  //       }

  //       const response = await axios.get(
  //         `http://localhost:8000/products/${endpoint}`
  //       );
  //       setSearchResults(response.data);
  //       setActiveFilter(filter);
  //     } catch (error) {
  //       console.error(`Error filtering products by ${filter}:`, error);
  //     }
  //   };

  //   const handleFilterByName = () => {
  //     applyFilter('name');
  //   };

  //   const handleFilterByPriceLowToHigh = () => {
  //     applyFilter('priceLowToHigh');
  //   };

  //   const handleFilterByPriceHighToLow = () => {
  //     applyFilter('priceHighToLow');
  //   };
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
            {/*Back button*/}
            <View>
              <Pressable style={{}} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left-circle" size={30} color="#DAC0F7" />
              </Pressable>
            </View>
            {/*Search bar*/}
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
                justifyContent: 'center',
              }}
            >
              <Text>Easier to buy by category</Text>
            </View>

            {/*Cart*/}
            <Pressable
              onPress={() => {
                // setModalVisible(false);
                navigation.navigate('Cart');
              }}
            >
              <FontAwesome name="shopping-bag" size={24} color="white" />
            </Pressable>
            {/*Cart count*/}
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
            {/*Filter*/}
            {/* <TouchableOpacity
              style={{}}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Feather name="filter" size={24} color="white" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/*Product display*/}
        <ScrollView>
          <View>
            <FlatList
              data={displayedProducts}
              numColumns={2}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <ProductCard
                  item={item}
                  handleProductClick={handleProductDetails}
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
      {/* Modal */}
      {/* <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filter by:</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                handleFilterByName();
              }}
            >
              <Text>Name</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                handleFilterByPriceLowToHigh();
              }}
            >
              <Text>Price (low to high)</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                handleFilterByPriceHighToLow();
              }}
            >
              <Text>Price (high to low)</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </>
  );
};

export default CategoryProduct;

const styles = StyleSheet.create({
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    width: '100%',
    alignItems: 'center',
  },
});
