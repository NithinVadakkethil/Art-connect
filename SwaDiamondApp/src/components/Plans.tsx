
import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

const PlanItem = ({ months, percentage }) => (
  <StyledView className="mb-2">
    <StyledText className="font-bold">{months} Months Plan</StyledText>
    <StyledText className="text-gray-500">{percentage}% of one installment amount</StyledText>
  </StyledView>
);

const Plans = () => {
  return (
    <StyledView className="bg-white p-4 rounded-lg shadow-md mb-6">
      <StyledText className="text-lg font-bold mb-4">See what you pay for and what swa diamonds contribution return to you</StyledText>
      <PlanItem months="10" percentage="100" />
      <PlanItem months="9" percentage="90" />
      <PlanItem months="8" percentage="80" />
      <PlanItem months="7" percentage="70" />
      <PlanItem months="6" percentage="60" />
      <PlanItem months="5" percentage="50" />
      <PlanItem months="4" percentage="40" />
    </StyledView>
  );
};

export default Plans;
