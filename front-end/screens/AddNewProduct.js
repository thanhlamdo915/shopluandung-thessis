// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   Pressable,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {AntDesign} from '@expo/vector-icons';
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   list,
// } from 'firebase/storage';
// import {storage} from '../firebase';
// import {v4} from 'uuid';
// // import {launchImageLibrary} from 'react-native-image-picker';
// // import ImagePicker from 'react-native-image-picker';
// // import {useEffect} from 'react';
// // import * as ImagePicker from 'expo-image-picker';
// // import axios from 'axios';

// const AddProductScreen = ({navigation}) => {
//   const [productId, setProductId] = useState('');
//   const [category, setCategory] = useState('');
//   const [name, setName] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [rewardPercentage, setRewardPercentage] = useState('');
//   // const [image, setImage] = useState('');

//   // const [uploading, setUploading] = useState(false);
//   // const pickImage = async () => {
//   //   let result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: ImagePicker.MediaTypeOptions.All,
//   //     allowsEditing: true,
//   //     aspect: [4, 3],
//   //     quality: 1,
//   //   });
//   //   if (!result.cancelled) {
//   //     setImage(result.asset[0].uri);
//   //   }
//   // };
//   // const uploadMedia = async () => {
//   //   setUploading(true);
//   //   {
//   //     try {
//   //       const {uri} = await FileSystem.getInfoAsync(image);
//   //       const blob = await new Promise((resolve, reject) => {
//   //         const xhr = new XMLHttpRequest();
//   //         xhr.onload = function () {
//   //           resolve(xhr.response);
//   //         };
//   //         xhr.onerror = function (e) {
//   //           console.log(e);
//   //           reject(new TypeError('Network request failed'));
//   //         };
//   //         xhr.responseType = 'blob';
//   //         xhr.open('GET', uri, true);
//   //         xhr.send(null);
//   //       });
//   //       const filename = image.substring(image.lastIndexOf('/') + 1);
//   //       const ref = firebase
//   //         .storage()
//   //         .ref()
//   //         .child('images/' + filename);
//   //       await ref.put(blob);
//   //       setUploading(false);
//   //       Alert.alert('Success', 'Image uploaded successfully');
//   //       setImage(null);
//   //     } catch (error) {
//   //       console.error('Error uploading image', error);
//   //       setUploading(false);
//   //     }
//   //   }
//   // };
//   const handleAddProduct = async () => {
//     const newProduct = {
//       productId,
//       category,
//       name,
//       quantity,
//       price,
//       description,
//       rewardPercentage,
//       image,
//     };

//     try {
//       const response = await fetch('http://localhost:8000/add-product', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         Alert.alert('Success', 'Product added successfully');
//         navigation.goBack(); // Go back to the previous screen
//       } else {
//         const errorResult = await response.json();
//         Alert.alert('Error', errorResult.message || 'Error adding product');
//       }
//     } catch (error) {
//       console.error('Error adding product', error);
//       Alert.alert('Error', 'An error occurred while adding the product');
//     }
//   };
//   return (
//     <SafeAreaView style={styles.all}>
//       <ScrollView style={styles.container}>
//         {/* <Text style={styles.label}>Product ID</Text>
//         <TextInput
//           style={styles.input}
//           value={productId}
//           onChangeText={setProductId}
//           placeholder="Product ID"
//         /> */}
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: 10,
//             // marginTop: 120,
//           }}
//         >
//           <Pressable
//             onPress={() => navigation.goBack()}
//             style={{
//               paddingBottom: 20,
//               // backgroundColor: '#DAC0F7',
//               borderRadius: 25,
//               flex: 1,
//               flexDirection: 'row',
//               alignItems: 'center',
//               //   justifyContent: 'center',
//             }}
//           >
//             <AntDesign name="arrowleft" size={24} color="black" />
//             <Text style={{textAlign: 'center', color: 'red'}}> go back</Text>
//           </Pressable>
//         </View>
//         <Text style={styles.label}>Category</Text>
//         <TextInput
//           style={styles.input}
//           value={category}
//           onChangeText={setCategory}
//           placeholder="Category ID"
//         />
//         <Text style={styles.label}>Name</Text>
//         <TextInput
//           style={styles.input}
//           value={name}
//           onChangeText={setName}
//           placeholder="Product Name"
//         />
//         <Text style={styles.label}>Quantity</Text>
//         <TextInput
//           style={styles.input}
//           value={quantity}
//           onChangeText={setQuantity}
//           placeholder="Quantity"
//           keyboardType="numeric"
//         />
//         <Text style={styles.label}>Price</Text>
//         <TextInput
//           style={styles.input}
//           value={price}
//           onChangeText={setPrice}
//           placeholder="Price"
//           keyboardType="numeric"
//         />
//         <Text style={styles.label}>Description</Text>
//         <TextInput
//           style={styles.input}
//           value={description}
//           onChangeText={setDescription}
//           placeholder="Description"
//           multiline
//         />
//         <Text style={styles.label}>Reward Percentage</Text>
//         <TextInput
//           style={styles.input}
//           value={rewardPercentage}
//           onChangeText={setRewardPercentage}
//           placeholder="Reward Percentage"
//           keyboardType="numeric"
//         />
//         <Text style={styles.label}>Image URL</Text>
//         {/* <TextInput
//           type="file"
//           onChange={(event) => {
//             setImageUpload(event.target.files[0]);
//           }}
//         /> */}
//         {/* <Button onClick={pickImage}> Upload Image</Button>
//         <View>
//           {image && (
//             <Image source={{uri: image}} style={{width: 200, height: 200}} />
//           )}
//           <TouchableOpacity onPress={uploadMedia}>
//             {' '}
//             <Text>Upload</Text>{' '}
//           </TouchableOpacity>
//         </View> */}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   all: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//   },
// });

// export default AddProductScreen;
