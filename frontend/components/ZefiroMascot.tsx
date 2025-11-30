import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';

export const ZefiroMascot = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const { equippedItems } = useUserStore();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  return (
    <View className="w-20 h-[70px] relative">
      <Animated.View style={{ transform: [{ translateY: floatAnim }] }} className="w-full h-full relative">
        {/* Sprout */}
        <View className="absolute -top-1 left-1/2 -translate-x-1/2 z-10">
           <FontAwesome5 name="seedling" size={20} color="#48bb78" />
        </View>

        {/* Accessories: Hat */}
        {equippedItems.accessory === 'hat' && (
          <View className="absolute -top-1 left-[18px] z-20 rotate-[-5deg]">
            <View className="w-9 h-5 bg-orange-400 rounded-t-full" />
            <View className="absolute bottom-0 -right-2 w-6 h-1 bg-orange-600 rounded-r-md" />
          </View>
        )}

        {/* Accessories: Scarf */}
        {equippedItems.accessory === 'scarf' && (
          <View className="absolute top-9 left-1/2 -translate-x-1/2 z-20">
            <View className="w-10 h-2 bg-teal-600 rounded-md" />
            <View className="w-3 h-3 bg-teal-700 rounded-b-md ml-6 mt-[-2px]" />
          </View>
        )}

        {/* Accessories: Eco Badge */}
        {equippedItems.accessory === 'eco_badge' && (
          <View className="absolute top-8 left-2 z-20">
            <View className="w-4 h-4 bg-green-600 rounded-full" />
          </View>
        )}

        {/* Accessories: Solar Hat */}
        {equippedItems.accessory === 'solar_hat' && (
          <View className="absolute -top-2 left-[18px] z-20">
            <View className="w-9 h-5 bg-yellow-400 rounded-t-full" />
            <View className="absolute -top-2 left-2">
              <FontAwesome5 name="sun" size={10} color="#d69e2e" />
            </View>
          </View>
        )}

        {/* Clouds */}
        <View className="absolute top-2 left-6 w-9 h-9 bg-white rounded-full shadow-sm z-30" />
        <View className="absolute bottom-0 left-0 w-10 h-10 bg-white rounded-full shadow-sm z-20" />
        <View className="absolute bottom-0 right-0 w-11 h-11 bg-white rounded-full shadow-sm z-20" />

        {/* Face */}
        <View className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
          {/* Accessories: Glasses */}
          {equippedItems.accessory === 'glasses' ? (
            <View className="flex-row items-center mb-0.5">
               <View className="w-3.5 h-2.5 bg-gray-800 rounded-sm" />
               <View className="w-1 h-0.5 bg-gray-800" />
               <View className="w-3.5 h-2.5 bg-gray-800 rounded-sm" />
            </View>
          ) : (
            <View className="flex-row space-x-1">
              <View className="w-1.5 h-2 bg-gray-800 rounded-full" />
              <View className="w-1.5 h-2 bg-gray-800 rounded-full" />
            </View>
          )}
          
          <View className="w-2 h-1 border-b-2 border-gray-800 rounded-b-lg mt-0.5" />
        </View>
      </Animated.View>
    </View>
  );
};
