
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1000);
  }, [navigation]);

  return (
    <StyledView className="flex-1 justify-center items-center bg-teal-500">
      <StyledText className="text-4xl text-white font-bold">Swa Diamond</StyledText>
    </StyledView>
  );
};

export default SplashScreen;
