import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { MissionsScreen } from '../screens/MissionsScreen';
import { TipsScreen } from '../screens/TipsScreen';
import { ShopScreen } from '../screens/ShopScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View className="w-16 h-16 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50 items-center justify-center border-4 border-white">
      {children}
    </View>
  </TouchableOpacity>
);

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.05,
          shadowRadius: 20,
        },
        tabBarActiveTintColor: '#2c7a7b',
        tabBarInactiveTintColor: '#a0aec0',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Calculator" 
        component={CalculatorScreen} 
        options={{
          tabBarLabel: 'Calc',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calculator" size={20} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopScreen} 
        options={{
          tabBarLabel: 'Loja',
          tabBarIcon: ({ color }) => <FontAwesome5 name="store" size={20} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Missions" 
        component={MissionsScreen} 
        options={{
          tabBarLabel: 'Missões',
          tabBarIcon: ({ color }) => <FontAwesome5 name="bullseye" size={20} color={color} />,
        }}
      />
      <Tab.Screen 
        name="Tips" 
        component={TipsScreen} 
        options={{
          tabBarLabel: 'Dicas',
          tabBarIcon: ({ color }) => <FontAwesome5 name="book-open" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
