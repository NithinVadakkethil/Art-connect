
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SchemeScreen from '../screens/SchemeScreen';
import PlanScreen from '../screens/PlanScreen';
import WalletScreen from '../screens/WalletScreen';
import MoreScreen from '../screens/MoreScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'https://i.imgur.com/2Yy2T2I.png'
              : 'https://i.imgur.com/y3yL2P2.png';
          } else if (route.name === 'Scheme') {
            iconName = focused
              ? 'https://i.imgur.com/R2sytfJ.png'
              : 'https://i.imgur.com/b9hF3v1.png';
          } else if (route.name === 'Plan') {
            iconName = focused
              ? 'https://i.imgur.com/G4b311g.png'
              : 'https://i.imgur.com/G4b311g.png';
          } else if (route.name === 'Wallet') {
            iconName = focused
              ? 'https://i.imgur.com/8f5g2iY.png'
              : 'https://i.imgur.com/8f5g2iY.png';
          } else if (route.name === 'More') {
            iconName = focused
              ? 'https://i.imgur.com/S8W6R2T.png'
              : 'https://i.imgur.com/S8W6R2T.png';
          }

          return <Image source={{ uri: iconName }} style={{ width: 24, height: 24 }} />;
        },
        tabBarActiveTintColor: 'teal',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scheme" component={SchemeScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
