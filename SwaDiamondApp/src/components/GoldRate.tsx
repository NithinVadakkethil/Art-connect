
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const GoldRate = () => {
  return (
    <StyledView className="bg-white p-4 rounded-lg shadow-md mb-6">
      <StyledText className="text-lg font-bold mb-2">Gold Rate</StyledText>
      <StyledView className="flex-row justify-between mb-1">
        <StyledText>8 gram</StyledText>
        <StyledText>₹ 75,040</StyledText>
      </StyledView>
      <StyledView className="flex-row justify-between">
        <StyledText>1 gram</StyledText>
        <StyledText>₹ 9,380</StyledText>
      </StyledView>
    </StyledView>
  );
};

export default GoldRate;
