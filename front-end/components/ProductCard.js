import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
// import {fonts} from '../utils/fonts';
import {AntDesign} from '@expo/vector-icons';

const ProductCard = ({item, handleProductClick}) => {
  console.log('item', item);
  return (
    <View style={{width: '50%', height: 'auto'}}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          handleProductClick(item);
        }}
      >
        <View>
          {/* <Image source={{uri: item.image}} style={styles.coverImage} /> */}
          <Image source={{uri: item.image[0]}} style={styles.coverImage} />

          <View style={styles.bottomIcon}>
            <View>
              <Text style={{fontSize: 8, fontWeight: '600'}}>Free</Text>
              <Text style={{fontSize: 7, fontWeight: '600'}}>Shipping</Text>
            </View>
          </View>
          <View style={styles.bottom2Icon}>
            <View>
              <Text style={{fontSize: 8, fontWeight: '600'}}>COD payment</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>
            {Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'VND',
            }).format(item.price)}
          </Text>
        </View>
        <View style={styles.rewardIcon}>
          <View>
            <Text style={{fontSize: 13}}> {item.rewardPercentage}%</Text>
            <Text style={{fontSize: 8}}>Reward</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  coverImage: {
    height: 256,
    width: '100%',
    borderRadius: 20,
    position: 'relative',
    objectFit: 'contain',
    border: '1px solid rgba(146, 146, 146, .1882352941)',
    borderRadius: 4,
    backgroundColor: 'white',
    boxShadow: '1px 1px 5px rgba(146,146,146,.1882352941)',
    margin: 0,
    padding: 0,
    height: 'auto',
    maxWidth: '100%',
    aspectRatio: '1/1',
  },
  contentContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444444',
  },
  price: {
    fontSize: 18,
  },
  rewardIcon: {
    position: 'absolute',
    padding: 5,
    backgroundColor: '#DAC0F7',
    height: 35,
    width: 40,
    // borderRadius: 40 / 2,
    // right: 10,
    // top: 10,
  },
  bottomIcon: {
    position: 'absolute',
    padding: 5,
    backgroundColor: '#26AB99',
    height: 30,
    width: 45,
    // borderRadius: 40 / 2,
    // right: 10,
    bottom: 0,
  },
  bottom2Icon: {
    position: 'absolute',
    padding: 5,
    backgroundColor: '#FEFF05',
    height: 30,
    width: 45,
    // borderRadius: 40 / 2,
    left: 45,
    bottom: 0,
  },
  faviorate: {
    height: 20,
    width: 20,
  },
});
