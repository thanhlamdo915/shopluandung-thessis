import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';

const Category = () => {
  const [selected, setSelected] = useState('Trending Now');
  // const category = ['Trending Now', 'All', 'New', 'Fashion', 'Mens'];
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories');
        setCategory(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategory();
  }, []);
  return (
    <View style={styles.container}>
      <Text></Text>
      <RNPickerSelect
        value={selected}
        onValueChange={(itemValue) => setSelected(itemValue)}
        style={styles.dropdownPicker}
        items={category.map((item) => ({label: item.name, value: item.name}))}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({});
