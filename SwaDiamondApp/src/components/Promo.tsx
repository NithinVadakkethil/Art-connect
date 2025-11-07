
import React from 'react';
import { View, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledImage = styled(Image);

const Promo = () => {
  return (
    <StyledView className="mb-6">
      {/* TODO: Replace with local asset */}
      <StyledImage
        source={{ uri: 'https://i.imgur.com/G4b311g.png' }}
        className="w-full h-64 rounded-lg"
        resizeMode="cover"
      />
    </StyledView>
  );
};

export default Promo;
