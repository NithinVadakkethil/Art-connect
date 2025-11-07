
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <StyledView className="flex-1 justify-center items-center bg-white">
      <StyledText className="text-2xl mb-8">Welcome to Swa Diamond</StyledText>
      <StyledTouchableOpacity
        className="bg-teal-500 px-8 py-4 rounded-full"
        onPress={() => navigation.replace('Home')}
      >
        <StyledText className="text-white text-lg font-bold">Let's go</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default OnboardingScreen;
