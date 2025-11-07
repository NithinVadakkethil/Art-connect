
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

const ProductItem = ({ image, name, price }) => (
  <StyledView className="mr-4">
    {/* TODO: Replace with local asset */}
    <StyledImage source={{ uri: image }} className="w-40 h-40 rounded-lg mb-2" />
    <StyledText className="font-bold">{name}</StyledText>
    <StyledText className="text-gray-500">{price}</StyledText>
  </StyledView>
);

const NewCollections = () => {
  const products = [
    { name: 'Diamond Bracelet', price: '₹ 18,000', image: 'https://i.imgur.com/ODi88pN.png' },
    { name: 'Diamond Bangle', price: '₹ 18,000', image: 'https://i.imgur.com/ODi88pN.png' },
    { name: 'Diamond Ring', price: '₹ 18,000', image: 'https://i.imgur.com/ODi88pN.png' },
  ];

  return (
    <StyledView className="mb-6">
      <StyledText className="text-lg font-bold mb-4">New Collections</StyledText>
      <StyledScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product, index) => (
          <ProductItem key={index} {...product} />
        ))}
      </StyledScrollView>
    </StyledView>
  );
};

export default NewCollections;
