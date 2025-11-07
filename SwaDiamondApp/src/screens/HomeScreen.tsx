
import React from 'react';
import { ScrollView, View } from 'react-native';
import { styled } from 'nativewind';
import Header from '../components/Header';
import GoldRate from '../components/GoldRate';
import Contribution from '../components/Contribution';
import Promo from '../components/Promo';
import Plans from '../components/Plans';
import NewCollections from '../components/NewCollections';
import FAQ from '../components/FAQ';

const StyledView = styled(View);
const StyledScrollView = styled(ScrollView);

const HomeScreen = () => {
  return (
    <StyledScrollView className="bg-gray-50">
      <Header />
      <StyledView className="p-4">
        <GoldRate />
        <Contribution />
        <Promo />
        <Plans />
        <NewCollections />
        <FAQ />
      </StyledView>
    </StyledScrollView>
  );
};

export default HomeScreen;
