
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const WalletScreen = () => {
  return (
    <StyledView className="flex-1 justify-center items-center">
      <StyledText>Wallet Screen</StyledText>
    </StyledView>
  );
};

export default WalletScreen;
