import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { useUserStore } from '../store/userStore';

import { calculatorApi } from '../services/api';
import { EMISSION_FACTORS, TransportKey, EnergyKey, FoodKey } from '../constants/emissionFactors';

export const CalculatorScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'transport' | 'energy' | 'food'>('transport');
  // Transporte
  const [distanceKm, setDistanceKm] = useState('');
  const [transportType, setTransportType] = useState<TransportKey>('car_gasoline_km');
  // Energia
  const [consumptionVal, setConsumptionVal] = useState('');
  const [energyType, setEnergyType] = useState<EnergyKey>('electricity_kwh');
  // Alimentação
  const [dietType, setDietType] = useState<FoodKey | null>(null);
  const [dietDays, setDietDays] = useState('1');
  
  const [loading, setLoading] = useState(false);
  const addEmission = useUserStore(state => state.addEmission);

  const calculate = async () => {
    setLoading(true);
    try {
      let result;
      if (activeTab === 'transport') {
        const km = parseFloat(distanceKm);
        if (!(km > 0)) { Alert.alert('Validação', 'Informe uma distância em km válida.'); return; }
        result = await calculatorApi.calculateTransport(transportType, km);
      } else if (activeTab === 'energy') {
        const cons = parseFloat(consumptionVal);
        if (!(cons > 0)) { Alert.alert('Validação', 'Informe um consumo válido.'); return; }
        result = await calculatorApi.calculateEnergy(energyType, cons);
      } else if (activeTab === 'food') {
        if (!dietType) { Alert.alert('Validação', 'Selecione um tipo de dieta.'); return; }
        const days = parseInt(dietDays, 10);
        if (!(days > 0)) { Alert.alert('Validação', 'Informe dias (>0).'); return; }
        result = await calculatorApi.calculateFood(dietType, days);
      }
      if (result) {
        addEmission(activeTab, result.emissions_kg);
        Alert.alert('Sucesso', `Adicionado ${result.emissions_kg.toFixed(2)} kg CO2e.`);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('[Calculator] error', error);
      const detail = error?.response?.data?.detail || error.message || 'Erro desconhecido.';
      Alert.alert('Erro ao calcular', detail);
    } finally {
      setLoading(false);
    }
  };

  // Preview dinâmico
  const previewValue = useMemo(() => {
    try {
      if (activeTab === 'transport') {
        const km = parseFloat(distanceKm);
        if (km > 0) return km * EMISSION_FACTORS.transportation[transportType];
      } else if (activeTab === 'energy') {
        const cons = parseFloat(consumptionVal);
        if (cons > 0) return cons * EMISSION_FACTORS.energy[energyType];
      } else if (activeTab === 'food') {
        const days = parseInt(dietDays, 10);
        if (dietType && days > 0) return days * EMISSION_FACTORS.food[dietType];
      }
    } catch { /* ignore preview errors */ }
    return 0;
  }, [activeTab, distanceKm, transportType, consumptionVal, energyType, dietType, dietDays]);

  const transportOptions: { key: TransportKey; label: string; icon: string }[] = [
    { key: 'car_gasoline_km', label: 'Carro Gasolina', icon: 'car' },
    { key: 'car_diesel_km', label: 'Carro Diesel', icon: 'car' },
    { key: 'car_electric_km', label: 'Carro Elétrico', icon: 'car' },
    { key: 'bus_km', label: 'Ônibus', icon: 'bus' },
    { key: 'train_km', label: 'Trem', icon: 'train' },
    { key: 'plane_short_km', label: 'Voo Curto', icon: 'plane' },
    { key: 'plane_long_km', label: 'Voo Longo', icon: 'plane' },
    { key: 'bike_km', label: 'Bicicleta', icon: 'bicycle' },
    { key: 'walk_km', label: 'A Pé', icon: 'walking' },
  ];

  const energyOptions: { key: EnergyKey; label: string; icon: string }[] = [
    { key: 'electricity_kwh', label: 'Eletricidade (kWh)', icon: 'bolt' },
    { key: 'natural_gas_kwh', label: 'Gás Natural (kWh)', icon: 'fire' },
    { key: 'heating_oil_liter', label: 'Óleo Aquecimento (L)', icon: 'burn' },
  ];

  const foodOptions: { key: FoodKey; label: string; tag: string; color: string }[] = [
    { key: 'meat_heavy_day', label: 'Dieta Rica em Carne', tag: 'Alto', color: 'text-red-500' },
    { key: 'meat_medium_day', label: 'Carne Moderada', tag: 'Médio', color: 'text-orange-500' },
    { key: 'meat_low_day', label: 'Pouca Carne', tag: 'Reduzido', color: 'text-amber-500' },
    { key: 'pescatarian_day', label: 'Pescetariana', tag: 'Menor', color: 'text-lime-600' },
    { key: 'vegetarian_day', label: 'Vegetariana', tag: 'Baixo', color: 'text-green-600' },
    { key: 'vegan_day', label: 'Vegana', tag: 'Ótimo', color: 'text-teal-600' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-bg-app px-6 pt-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4 font-fredoka">Calculadora CO2</Text>

      {/* Tabs */}
      <View className="flex-row p-1 bg-gray-100 rounded-xl mb-6">
        {['transport', 'energy', 'food'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 rounded-lg items-center ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-sm font-bold capitalize ${activeTab === tab ? 'text-teal-600' : 'text-gray-500'}`}>
              {tab === 'transport' ? 'Transporte' : tab === 'energy' ? 'Energia' : 'Comida'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'transport' && (
          <View>
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase font-nunito">Meio de Transporte</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 4 }} className="mb-4">
              {transportOptions.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setTransportType(opt.key)}
                  activeOpacity={0.85}
                  style={{ width: 100, marginRight: 10 }}
                >
                  <View className={`p-3 rounded-lg border-2 items-center justify-center bg-white/90 ${transportType === opt.key ? 'border-teal-400 shadow-sm' : 'border-gray-200'}`}>
                    <FontAwesome5 name={opt.icon as any} size={22} color={transportType === opt.key ? '#319795' : '#a0aec0'} />
                    <Text numberOfLines={2} className="font-nunito font-semibold text-[11px] mt-1 text-gray-700 text-center">{opt.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase font-nunito">Distância (km)</Text>
            <View className="bg-white rounded-2xl p-1 border-2 border-gray-200 mb-6 flex-row items-center">
              <FontAwesome5 name="road" size={16} color="#cbd5e0" style={{ marginLeft: 12 }} />
              <TextInput
                className="flex-1 p-3 text-gray-800 font-nunito"
                placeholder="Ex: 15"
                keyboardType="numeric"
                value={distanceKm}
                onChangeText={setDistanceKm}
              />
            </View>
          </View>
        )}

        {activeTab === 'energy' && (
          <View>
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase font-nunito">Tipo de Energia</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 4 }} className="mb-4">
              {energyOptions.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setEnergyType(opt.key)}
                  activeOpacity={0.85}
                  style={{ width: 130, marginRight: 10 }}
                >
                  <View className={`p-3 rounded-lg border-2 items-center justify-center bg-white/90 ${energyType === opt.key ? 'border-teal-400 shadow-sm' : 'border-gray-200'}`}>
                    <FontAwesome5 name={opt.icon as any} size={22} color={energyType === opt.key ? '#319795' : '#a0aec0'} />
                    <Text numberOfLines={2} className="font-nunito font-semibold text-[11px] mt-1 text-gray-700 text-center">{opt.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase font-nunito">Consumo</Text>
            <View className="bg-white rounded-2xl p-1 border-2 border-gray-200 mb-6 flex-row items-center">
              <FontAwesome5 name="tachometer-alt" size={16} color="#cbd5e0" style={{ marginLeft: 12 }} />
              <TextInput
                className="flex-1 p-3 text-gray-800 font-nunito"
                placeholder={energyType === 'heating_oil_liter' ? 'Litros ex: 10' : 'kWh ex: 100'}
                keyboardType="numeric"
                value={consumptionVal}
                onChangeText={setConsumptionVal}
              />
            </View>
          </View>
        )}

        {activeTab === 'food' && (
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, paddingHorizontal: 4 }} className="mb-3">
              {foodOptions.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setDietType(opt.key)}
                  activeOpacity={0.85}
                  style={{ width: 155, marginRight: 12 }}
                >
                  <View className={`p-3 rounded-lg border-2 items-center justify-center bg-white/90 ${dietType === opt.key ? 'border-teal-400 shadow-sm' : 'border-gray-200'}`}>
                    <Text numberOfLines={2} className="font-nunito font-semibold text-[12px] text-gray-700 text-center">{opt.label}</Text>
                    <Text className={`text-[11px] mt-1 font-bold ${opt.color}`}>{opt.tag}</Text>
                    {dietType === opt.key && (
                      <View className="mt-1 w-2.5 h-2.5 rounded-full bg-teal-500" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase font-nunito">Dias</Text>
            <View className="bg-white rounded-2xl p-1 border-2 border-gray-200 mb-2 flex-row items-center">
              <FontAwesome5 name="calendar" size={16} color="#cbd5e0" style={{ marginLeft: 12 }} />
              <TextInput
                className="flex-1 p-3 text-gray-800 font-nunito"
                placeholder="Ex: 3"
                keyboardType="numeric"
                value={dietDays}
                onChangeText={setDietDays}
              />
            </View>
          </View>
        )}

        <GlassCard className="bg-teal-50 p-6 items-center mb-6 border-teal-100">
          <Text className="text-xs text-gray-500 font-bold uppercase mb-1 font-nunito">Impacto Estimado</Text>
          <Text className="text-4xl font-extrabold text-teal-600 mb-1 font-fredoka">{previewValue.toFixed(2)}</Text>
          <Text className="text-sm text-gray-500 font-nunito">kg CO2e</Text>
        </GlassCard>

        <TouchableOpacity
          onPress={calculate}
          disabled={loading}
          className={`bg-teal-500 rounded-2xl p-4 flex-row items-center justify-center shadow-lg shadow-teal-500/40 active:scale-95 ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <Text className="text-white font-bold text-lg font-nunito">Calculando...</Text>
          ) : (
            <>
              <FontAwesome5 name="calculator" size={16} color="white" style={{ marginRight: 8 }} />
              <Text className="text-white font-bold text-lg font-nunito">Calcular e Salvar</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};
