import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {addToCart} from '../redux/CartReducer';
import {useSelector} from 'react-redux';
import {Feather, MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import {useRef} from 'react';

const screenWidth = Dimensions.get('window').width;
// const ProductImageCarousel = ({images}) => {
//   const carouselRef = useRef(null);

//   const renderItem = ({item}) => {
//     return (
//       <View style={styles.item}>
//         <Image source={{uri: item}} style={styles.image} />
//       </View>
//     );
//   };

//   return (
//     <Carousel
//       ref={carouselRef}
//       data={images}
//       renderItem={renderItem}
//       sliderWidth={screenWidth}
//       itemWidth={screenWidth}
//       layout={'default'}
//       loop={true}
//       autoplay={true}
//       autoplayDelay={1000}
//       autoplayInterval={3000}
//     />
//   );
// };
const ProductInfoScreen = () => {
  const route = useRoute();
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };
  const carouselRef = useRef(null);

  const cart = useSelector((state) => state.cart.cart);

  const images = route.params?.image;

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <Image source={{uri: item}} style={styles.image} />
    </View>
  );
  return (
    <SafeAreaView
      style={{marginTop: 55, flex: 1, backgroundColor: 'white'}}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView>
        <View style={{}}>
          {Array.isArray(images) && images.length > 0 ? (
            <Carousel
              width={screenWidth}
              height={screenWidth}
              autoPlay={true}
              data={images}
              scrollAnimationDuration={1000}
              renderItem={renderItem}
            />
          ) : (
            <Image source={{uri: images}} style={styles.coverImage} />
          )}
          <Pressable
            style={{position: 'absolute', top: 20, left: 12}}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left-circle" size={30} color="#DAC0F7" />
          </Pressable>
        </View>

        <View style={{padding: 10, width: '100%'}}>
          <Text style={{fontSize: 15, fontWeight: '600'}}>
            {route?.params?.name}
          </Text>
        </View>

        <Text style={{height: 1, borderColor: '#D0D0D0', borderWidth: 1}} />
        <View style={{paddingLeft: 10}}>
          <Text style={{fontSize: 24, fontWeight: 'bold', marginVertical: 5}}>
            {Intl.NumberFormat('vi', {
              style: 'currency',
              currency: 'VND',
            }).format(route?.params?.price)}{' '}
          </Text>

          <Text style={{fontSize: 14}}>
            Reward Points : {route?.params?.rewardPercentage} %
          </Text>
        </View>
        <Text style={{height: 1, borderColor: '#D0D0D0', borderWidth: 1}} />
        <View style={{padding: 10, paddingTop: 4}}>
          {/* <View
            style={{
              flexDirection: 'Column',
              marginVertical: 5,
              alignItems: 'center',
              gap: 5,
            }}
          > */}
          <Text style={{fontSize: 15, fontWeight: 'bold', marginVertical: 5}}>
            Description
          </Text>
          <Text style={{fontSize: 13}}>{route.params.description}</Text>
          {/* </View> */}
        </View>
      </ScrollView>
      <View>
        <Pressable
          onPress={() => addItemToCart(route?.params?.item)}
          style={{
            backgroundColor: '#DAC0F7',
            padding: 10,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          {addedToCart ? (
            <View>
              <Text>Added to Cart</Text>
            </View>
          ) : (
            <Text style={{color: '#FFFFFF', fontWeight: '500'}}>
              Add to Cart
            </Text>
          )}
        </Pressable>
        <Pressable
          style={{
            backgroundColor: '#822DE2',
            padding: 10,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>Buy Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ProductInfoScreen;

const styles = StyleSheet.create({
  coverImage: {
    objectFit: 'contain',
    // border: '1px solid rgba(146, 146, 146, 0.1882352941)',
    borderRadius: 4,
    backgroundColor: 'white',
    boxShadow: '1px 1px 5px rgba(146,146,146,.1882352941)',
    margin: 0,
    padding: 0,
    height: 'auto',
    maxWidth: '100%',
    aspectRatio: '1/1',
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: screenWidth,
    padding: 16,
    marginLeft: 25,
    marginRight: 25,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
