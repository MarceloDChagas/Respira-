import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { useUserStore } from '../store/userStore';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmationModal } from '../components/ConfirmationModal';

import { ITEMS_DB } from '../constants/items';

export const ShopScreen = () => {
  const { totalPoints, ownedItems, equippedItems, buyItem, equipItem } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleItemPress = (item: any) => {
    if (ownedItems.includes(item.id)) {
      // Equip
      equipItem(item.id, item.type as 'accessory' | 'bg');
    } else {
      // Open Buy Modal
      setSelectedItem(item);
      setModalVisible(true);
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedItem) return;
    
    const success = buyItem(selectedItem.id, selectedItem.price);
    setModalVisible(false);
    
    setTimeout(() => {
      if (success) {
        if (Platform.OS === 'web') {
          window.alert("Sucesso! Item comprado.");
        } else {
          Alert.alert("Sucesso!", "Item comprado.");
        }
      } else {
        if (Platform.OS === 'web') {
          window.alert("Ops! XP insuficiente.");
        } else {
          Alert.alert("Ops!", "XP insuficiente.");
        }
      }
      setSelectedItem(null);
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-app px-6 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800 font-fredoka">Loja do Zéfiro</Text>
        <View className="bg-teal-100 px-3 py-1 rounded-full flex-row items-center">
          <FontAwesome5 name="leaf" size={12} color="#2c7a7b" style={{ marginRight: 4 }} />
          <Text className="text-teal-700 font-bold font-nunito">{totalPoints}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <GlassCard className="bg-purple-50 border-purple-100 p-4 mb-6 flex-row items-center gap-4">
          <View className="bg-purple-100 p-3 rounded-full">
            <FontAwesome5 name="gift" size={20} color="#9f7aea" />
          </View>
          <View>
            <Text className="font-bold text-gray-800 font-fredoka">Personalize!</Text>
            <Text className="text-xs text-gray-500 font-nunito">Use seu XP para deixar o Zéfiro único.</Text>
          </View>
        </GlassCard>

        {/* Accessories (dynamic) */}
        <Text className="text-gray-700 font-bold mb-3 px-1 text-sm uppercase tracking-wide font-nunito">Acessórios</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {Object.values(ITEMS_DB)
            .filter(item => item.type === 'accessory')
            .sort((a,b) => a.price - b.price)
            .map(item => {
              const isOwned = ownedItems.includes(item.id);
              const isEquipped = equippedItems.accessory === item.id;
              return (
                <GlassCard key={item.id} className={`w-[48%] p-3 items-center mb-4 ${isEquipped ? 'border-teal-400 bg-teal-50' : ''}`}>
                  <View className="h-16 w-full bg-gray-50 rounded-xl mb-3 items-center justify-center">
                    <FontAwesome5 name={item.icon} size={30} className={item.color} />
                  </View>
                  <Text className="font-bold text-sm text-gray-700 font-fredoka">{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleItemPress(item)}
                    className={`w-full py-1.5 rounded-lg mt-2 items-center ${isOwned ? (isEquipped ? 'bg-teal-100' : 'bg-gray-200') : 'bg-teal-500'}`}
                  >
                    <Text className={`text-xs font-bold ${isOwned ? 'text-gray-600' : 'text-white'}`}>
                      {isEquipped ? 'Equipado' : isOwned ? 'Equipar' : `${item.price} XP`}
                    </Text>
                  </TouchableOpacity>
                </GlassCard>
              );
            })}
        </View>

        {/* Backgrounds (dynamic) */}
        <Text className="text-gray-700 font-bold mb-3 px-1 text-sm uppercase tracking-wide font-nunito">Cores de Fundo</Text>
        <View className="flex-row flex-wrap justify-between mb-20">
          {Object.values(ITEMS_DB)
            .filter(item => item.type === 'bg')
            .sort((a,b) => a.price - b.price)
            .map(item => {
              const isOwned = ownedItems.includes(item.id);
              const isEquipped = equippedItems.bg === item.id;
              return (
                <GlassCard key={item.id} className={`w-[48%] p-3 items-center mb-4 ${isEquipped ? 'border-teal-400 bg-teal-50' : ''}`}>
                  <View className="h-16 w-full rounded-xl mb-3 overflow-hidden">
                    <LinearGradient
                      colors={item.gradient || ['#ccc', '#999']}
                      style={{ flex: 1 }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  </View>
                  <Text className="font-bold text-sm text-gray-700 font-fredoka">{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => handleItemPress(item)}
                    className={`w-full py-1.5 rounded-lg mt-2 items-center ${isOwned ? (isEquipped ? 'bg-teal-100' : 'bg-gray-200') : 'bg-teal-500'}`}
                  >
                    <Text className={`text-xs font-bold ${isOwned ? 'text-gray-600' : 'text-white'}`}>
                      {isEquipped ? 'Equipado' : isOwned ? 'Equipar' : `${item.price} XP`}
                    </Text>
                  </TouchableOpacity>
                </GlassCard>
              );
            })}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleConfirmPurchase}
        onCancel={() => setModalVisible(false)}
        title="Comprar Item"
        message={selectedItem ? `Deseja comprar ${selectedItem.name} por ${selectedItem.price} XP?` : ''}
        confirmText="Comprar"
        icon="shopping-cart"
      />
    </SafeAreaView>
  );
};
