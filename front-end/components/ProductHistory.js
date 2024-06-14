import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
// import {fonts} from '../utils/fonts';
import {AntDesign} from '@expo/vector-icons';

const ProductHistory = ({item}) => {
  console.log('item', item);
  return (
    <TouchableOpacity style={{paddingBottom: 10}}>
      <View style={{flexDirection: 'row', width: 'auto'}}>
        <Image
          source={{uri: item.image}}
          style={{width: 60, height: 60, borderRadius: 8, marginRight: 10}}
        />

        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 13, fontWeight: '400', flex: 'wrap'}}>
            {item.name}
          </Text>
          <Text style={{}}>Quantity: {item.quantity}</Text>
          <Text style={{}}>
            {Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'VND',
            }).format(item.price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
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
export default ProductHistory;

const styles = StyleSheet.create({});
