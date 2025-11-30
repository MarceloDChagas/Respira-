import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { useUserStore } from '../store/userStore';

export const MissionsScreen = ({ navigation }: any) => {
  const { totalPoints, missions, activeMission, acceptMission, incrementMission, completeMission } = useUserStore();

  const handleAccept = (id: string, title: string) => {
    acceptMission(id);
    Alert.alert('Missão aceita', `Você iniciou: ${title}`);
  };

  const handleProgress = (id: string, missionTitle: string) => {
    incrementMission(id, 1);
    const m = missions.find(m => m.id === id);
    if (m && m.progress + 1 >= m.target) {
      Alert.alert('Quase lá', 'Progresso completo, clique em Concluir.');
    } else {
      Alert.alert('Progresso', `Avanço registrado em: ${missionTitle}`);
    }
  };

  const handleComplete = (id: string) => {
    completeMission(id);
    const m = missions.find(m => m.id === id);
    Alert.alert('Concluída 🎉', `Você ganhou +${m?.points || 0} pts`);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-app px-6 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800 font-fredoka">Missões</Text>
        <View className="bg-yellow-100 px-3 py-1 rounded-full">
          <Text className="text-yellow-600 text-xs font-bold font-nunito">XP: {totalPoints}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="space-y-4 pb-10">
        {missions.map((mission) => {
          const isLocked = mission.locked;
          const isActive = mission.accepted && !mission.completed;
          const isCompleted = mission.completed;
          
          // Color mapping
          let bgBadge = 'bg-green-100';
          let textBadge = 'text-green-600';
          let iconColor = '#319795'; // teal-500
          let iconBg = 'bg-teal-100';

          if (mission.difficulty === 'MÉDIO') {
            bgBadge = 'bg-orange-100';
            textBadge = 'text-orange-600';
            iconColor = '#dd6b20'; // orange-500
            iconBg = 'bg-orange-100';
          } else if (mission.difficulty === 'DIFÍCIL') {
            bgBadge = 'bg-red-100';
            textBadge = 'text-red-600';
            iconColor = '#e53e3e'; // red-500
            iconBg = 'bg-red-100';
          }

          return (
            <GlassCard key={mission.id} className={`p-4 overflow-hidden relative mb-4 ${isActive ? 'border-2 border-teal-500' : ''}`}>
              <View className={`absolute top-0 right-0 ${bgBadge} px-2 py-1 rounded-bl-lg`}>
                <Text className={`${textBadge} text-[10px] font-bold`}>{mission.difficulty}</Text>
              </View>
              
              <View className="flex-row gap-4">
                <View className={`w-12 h-12 rounded-2xl ${iconBg} items-center justify-center`}>
                  <FontAwesome5 name={mission.icon as any} size={20} color={iconColor} />
                </View>
                
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 font-fredoka text-lg">{mission.title}</Text>
                  <Text className="text-xs text-gray-500 mb-3 font-nunito">{mission.description}</Text>
                  
                  {mission.duration && (
                     <Text className="text-[10px] text-gray-400 font-bold mb-2">⏱ {mission.duration}</Text>
                  )}

                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs font-bold text-teal-600">+{mission.points} pts</Text>
                    {isLocked && !isCompleted && (
                      <View className="bg-gray-200 px-3 py-1.5 rounded-lg">
                        <Text className="text-gray-500 text-xs font-bold">Bloqueada</Text>
                      </View>
                    )}
                    {!isLocked && !isActive && !isCompleted && (
                      <TouchableOpacity
                        onPress={() => handleAccept(mission.id, mission.title)}
                        className="bg-teal-500 px-3 py-1.5 rounded-lg shadow-sm active:scale-95"
                      >
                        <Text className="text-white text-xs font-bold">Aceitar</Text>
                      </TouchableOpacity>
                    )}
                    {isActive && !isCompleted && (
                      mission.progress >= mission.target ? (
                        <TouchableOpacity
                          onPress={() => handleComplete(mission.id)}
                          className="bg-green-500 px-3 py-1.5 rounded-lg shadow-sm active:scale-95"
                        >
                          <Text className="text-white text-xs font-bold">Concluir</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handleProgress(mission.id, mission.title)}
                          className="bg-teal-500 px-3 py-1.5 rounded-lg shadow-sm active:scale-95"
                        >
                          <Text className="text-white text-xs font-bold">+1 Passo</Text>
                        </TouchableOpacity>
                      )
                    )}
                    {isCompleted && (
                      <View className="bg-green-100 px-3 py-1.5 rounded-lg">
                        <Text className="text-green-600 text-xs font-bold">Concluída</Text>
                      </View>
                    )}
                  </View>
                  {isActive && (
                    <View className="mt-2">
                      <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                        <View
                          className="bg-teal-500 h-full"
                          style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                        />
                      </View>
                      <Text className="text-[10px] text-gray-500 mt-1 font-bold">Progresso: {mission.progress}/{mission.target}</Text>
                    </View>
                  )}
                </View>
              </View>
            </GlassCard>
          );
        })}
        <View className="h-10" /> 
      </ScrollView>
    </SafeAreaView>
  );
};
