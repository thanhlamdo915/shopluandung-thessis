import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
// import {fonts} from '../utils/fonts';
import {AntDesign} from '@expo/vector-icons';

const CategoryItem = ({item, handleCategoryClick}) => {
  console.log('item 123', item);
  return (
    <View style={{height: 63, width: 63, paddingTop: 7}}>
      <Pressable
        style={{}}
        onPress={() => {
          console.log('Category ID:', item._id);
          handleCategoryClick(item);
        }}
      >
        <Image
          source={{uri: item?.image}}
          style={{
            height: 40,
            width: 40,
            borderRadius: 40 / 2,
          }}
        />
        <View style={{height: 20, width: 40, flex: 'wrap'}}>
          <Text style={{fontSize: 10}}>{item.name}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({});
