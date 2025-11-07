
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Header = () => {
  return (
    <StyledView className="bg-teal-800 p-6 rounded-b-3xl">
      <StyledView className="flex-row justify-between items-center mb-4">
        {/* TODO: Replace with local asset */}
        <StyledImage source={{ uri: 'https://i.imgur.com/S8W6R2T.png' }} className="w-20 h-10" resizeMode="contain" />
        <StyledTouchableOpacity>
          {/* TODO: Replace with local asset */}
          <StyledImage source={{ uri: 'https://i.imgur.com/8f5g2iY.png' }} className="w-6 h-6" />
        </StyledTouchableOpacity>
      </StyledView>
      <StyledText className="text-white text-3xl font-bold mb-2">Diamond for Everyone who Desire</StyledText>
      <StyledText className="text-white text-sm mb-6">Just like our jewellery, here's something that we have created specially for you.</StyledText>
      <StyledTouchableOpacity className="bg-white px-8 py-3 rounded-full mb-2">
        <StyledText className="text-teal-800 text-center font-bold">Login</StyledText>
      </StyledTouchableOpacity>
      <StyledTouchableOpacity>
        <StyledText className="text-white text-center">Join scheme</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default Header;
