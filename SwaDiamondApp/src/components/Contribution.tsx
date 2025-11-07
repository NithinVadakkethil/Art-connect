
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Contribution = () => {
  return (
    <StyledView className="mb-6">
      <StyledText className="text-lg mb-2">Enter the amount you would like to keep aside with us for 10 Months and see swa contribution</StyledText>
      <StyledText className="text-sm text-gray-500 mb-4">Customer Usually Prefer</StyledText>
      <StyledView className="flex-row justify-between mb-4">
        <StyledTouchableOpacity className="border border-teal-500 px-4 py-2 rounded-full">
          <StyledText>₹ 2000</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="border border-teal-500 px-4 py-2 rounded-full">
          <StyledText>₹ 3000</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="bg-teal-500 px-4 py-2 rounded-full">
          <StyledText className="text-white">₹ 5000</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="border border-teal-500 px-4 py-2 rounded-full">
          <StyledText>₹ 8000</StyledText>
        </StyledTouchableOpacity>
        <StyledTouchableOpacity className="border border-teal-500 px-4 py-2 rounded-full">
          <StyledText>₹ 9000</StyledText>
        </StyledTouchableOpacity>
      </StyledView>
      <StyledTextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Enter Amount"
        defaultValue="₹ 5000"
      />
      <StyledTouchableOpacity className="bg-teal-800 py-4 rounded-full mb-4">
        <StyledText className="text-white text-center font-bold">Check</StyledText>
      </StyledTouchableOpacity>
      <StyledView className="flex-row justify-between mb-2">
        <StyledText>You pay (10 months)</StyledText>
        <StyledText>₹ 18,000</StyledText>
      </StyledView>
      <StyledView className="flex-row justify-between mb-2">
        <StyledText>SWA Contribution</StyledText>
        <StyledText>₹ 900</StyledText>
      </StyledView>
      <StyledView className="flex-row justify-between">
        <StyledText className="font-bold">Total Amount</StyledText>
        <StyledText className="font-bold">₹ 18,900</StyledText>
      </StyledView>
    </StyledView>
  );
};

export default Contribution;
