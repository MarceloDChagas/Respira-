import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { ZefiroMascot } from '../components/ZefiroMascot';
import { GlassCard } from '../components/GlassCard';
import { useUserStore } from '../store/userStore';
import { ITEMS_DB } from '../constants/items';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen = ({ navigation }: any) => {
  const { transportEmission, energyEmission, foodEmission, activeMission, equippedItems, name, level, levels, totalReducedCO2 } = useUserStore();
  const kmByCar = (totalReducedCO2 / 0.2).toFixed(0); // ~0.2 kg/km
  const treesDay = (totalReducedCO2 / 0.06).toFixed(0); // ~0.06 kg/dia por árvore
  const [showBubble, setShowBubble] = useState(false);

  const triggerSpeech = () => {
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 3000);
  };

  const currentBg = ITEMS_DB[equippedItems.bg as keyof typeof ITEMS_DB] || ITEMS_DB['bg_default'];

  return (
    <SafeAreaView className="flex-1 bg-bg-app">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl text-teal-800 font-bold font-fredoka">Olá, {name || 'Usuário'}! 👋</Text>
            <Text className="text-sm text-gray-500 font-semibold font-nunito">Vamos salvar o planeta hoje?</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-teal-200 border-2 border-white shadow-md overflow-hidden">
             {/* Placeholder for Avatar */}
             <View className="w-full h-full bg-teal-300" />
          </View>
        </View>

        {/* Mascot Card */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={triggerSpeech}
          className="rounded-3xl shadow-lg relative overflow-hidden mb-6"
        >
          <LinearGradient
            colors={(currentBg as any).gradient || ['#4fd1c5', '#319795']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 flex-row items-center justify-between"
          >
            <View className="z-10 w-2/3">
              <View className="bg-teal-700/30 self-start px-2 py-1 rounded-lg mb-2">
                <Text className="text-white text-xs font-bold">ODS 13</Text>
              </View>
              <Text className="text-white text-xl font-bold font-fredoka mb-1">Seu Nível: {levels[level]?.name}</Text>
              {/* Progressão para próximo nível */}
              <View className="bg-white/30 h-2 rounded-full overflow-hidden mb-2">
                {(() => {
                  const current = levels[level]?.threshold || 0;
                  const next = levels[level + 1]?.threshold ?? current;
                  const points = useUserStore.getState().totalPoints;
                  const pct = next > current ? Math.min(100, Math.round(((points - current) / (next - current)) * 100)) : 100;
                  return <View className="bg-white h-full" style={{ width: `${pct}%` }} />;
                })()}
              </View>
              <Text className="text-teal-100 text-sm font-nunito mb-3">Continue completando missões para subir de nível!</Text>

              {/* Impacto acumulado */}
              <View className="bg-white/20 rounded-lg p-2">
                <Text className="text-white text-xs font-bold">Impacto acumulado</Text>
                <Text className="text-white text-xs">Redução: {totalReducedCO2.toFixed(1)} kg CO2</Text>
                <Text className="text-white text-[11px]">≈ {kmByCar} km de carro evitados • ≈ {treesDay} dias de uma árvore</Text>
              </View>
              
              {showBubble && (
                <View className="bg-white px-3 py-2 rounded-lg rounded-bl-none absolute -bottom-2 left-0 shadow-lg">
                  <Text className="text-teal-800 text-xs font-bold">Ótimo trabalho! 🌱</Text>
                </View>
              )}
            </View>
            
            <ZefiroMascot />
            
            {/* Decorative Circle */}
            <View className="absolute -right-4 -bottom-10 w-32 h-32 bg-white/10 rounded-full" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Grid */}
        <Text className="text-gray-700 font-bold mb-3 px-1 font-fredoka">Sua Pegada (Hoje)</Text>
        <View className="flex-row gap-4 mb-6">
          <GlassCard className="flex-1 p-4 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mb-2">
              <FontAwesome5 name="car" size={18} color="#ed8936" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 font-fredoka">{transportEmission.toFixed(1)}</Text>
            <Text className="text-xs text-gray-400 font-bold">kg CO2 (Transp.)</Text>
          </GlassCard>
          
          <GlassCard className="flex-1 p-4 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mb-2">
              <FontAwesome5 name="bolt" size={18} color="#ecc94b" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 font-fredoka">{energyEmission.toFixed(1)}</Text>
            <Text className="text-xs text-gray-400 font-bold">kg CO2 (Energia)</Text>
          </GlassCard>

          <GlassCard className="flex-1 p-4 items-center justify-center">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-2">
              <FontAwesome5 name="utensils" size={18} color="#38a169" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 font-fredoka">{foodEmission.toFixed(1)}</Text>
            <Text className="text-xs text-gray-400 font-bold">kg CO2 (Alimentação)</Text>
          </GlassCard>
        </View>

        {/* Active Mission */}
        <View className="flex-row justify-between items-end mb-3 px-1">
          <Text className="text-gray-700 font-bold font-fredoka">Missão Ativa</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Missions')}>
            <Text className="text-teal-500 text-xs font-bold">Ver todas</Text>
          </TouchableOpacity>
        </View>
        
        {activeMission && (
          <GlassCard className="p-4 border-l-4 border-l-teal-500 mb-6">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="font-bold text-gray-800 font-fredoka">{activeMission.title}</Text>
                <Text className="text-xs text-gray-500">Alimentação • +50 Pontos</Text>
              </View>
              <FontAwesome5 name="leaf" size={20} color="#38b2ac" />
            </View>
            <View className="bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
              <View className="bg-teal-500 h-full rounded-full" style={{ width: `${activeMission.progress * 100}%` }} />
            </View>
            <Text className="text-xs text-right text-teal-600 font-bold">Quase lá!</Text>
          </GlassCard>
        )}

        {/* Tip */}
        <Text className="text-gray-700 font-bold mb-3 px-1 font-fredoka">Dica do Zéfiro</Text>
        <GlassCard className="p-4 bg-blue-50 border-blue-100 flex-row items-start gap-3 mb-20">
          <FontAwesome5 name="lightbulb" size={18} color="#4299e1" style={{ marginTop: 4 }} />
          <Text className="text-sm text-gray-600 leading-tight flex-1 font-nunito">
            Apague as luzes ao sair de um cômodo. Isso pode reduzir sua conta e sua pegada!
          </Text>
        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
};
