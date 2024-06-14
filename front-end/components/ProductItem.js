import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {addToCart} from '../redux/CartReducer';

const ProductItem = ({item}) => {
  console.log('item image', item.image);
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };

  const [addedToCart, setAddedToCart] = useState(false);
  // const getImageUrl = (image) => {
  //   if (Array.isArray(image) && image.length > 0) {
  //     return image[0]; // Return the first image URL if it's an array
  //   } else {
  //     return image; // Return the image URL directly if it's not an array
  //   }
  // };
  return (
    <Pressable style={{marginHorizontal: 20, marginVertical: 25}}>
      <Image style={{width: 150, height: 150}} source={{uri: item?.image}} />
      <Image
        style={{width: 150, height: 150}}
        // source={{uri: getImageUrl(item?.image)}}
      />

      <Text numberOfLines={1} style={{width: 150, marginTop: 10}}>
        {item?.title}
      </Text>
      <View
        style={{
          marginTop: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{fontSize: 15, fontWeight: 'bold'}}>₹{item?.price}</Text>
        <Text style={{color: '#FFC72C', fontWeight: 'bold'}}>
          {item?.rating?.rate} ratings
        </Text>
      </View>
      <Pressable
        onPress={() => addItemToCart(item)}
        style={{
          backgroundColor: '#FFC72C',
          padding: 10,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
        {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
