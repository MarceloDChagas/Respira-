import { create } from 'zustand';
import { Mission, MISSIONS } from '../constants/missions';

interface MissionState extends Mission {
  accepted: boolean;
  completed: boolean;
  progress: number; // 0..target
  target: number; // passos necessários para completar
  locked: boolean;
}

interface UserState {
  transportEmission: number;
  energyEmission: number;
  foodEmission: number;
  totalPoints: number;
  level: number; // índice do nível atual
  levels: { name: string; threshold: number }[]; // definição de níveis
  totalReducedCO2: number; // kg de CO2 reduzidos por missões concluídas
  missions: MissionState[];
  activeMission: MissionState | null;
  ownedItems: string[];
  equippedItems: {
    accessory: string | null;
    bg: string;
  };
  name: string | null;
  // actions
  addEmission: (category: 'transport' | 'energy' | 'food', amount: number) => void;
  addPoints: (amount: number) => void;
  buyItem: (itemId: string, price: number) => boolean;
  equipItem: (itemId: string, type: 'accessory' | 'bg') => void;
  setName: (name: string) => void;
  acceptMission: (id: string) => void;
  incrementMission: (id: string, steps?: number) => void;
  completeMission: (id: string) => void;
  computeLevel: () => void;
}

// Define alvos (target) opcionais para multi-passos; padrão =1
const missionTargets: Record<string, number> = {
  limpeza_digital: 50, // apagar 50 emails
};

// Estimativas simples de redução de CO2 por missão (kg)
const missionCO2Reduction: Record<string, number> = {
  banho_flash: 1.5,            // reduzir tempo de banho
  luz_apagada: 0.5,            // iluminação consciente
  adeus_vampiros: 0.2,         // stand-by
  limpeza_digital: 0.1,        // dados em nuvem
  zero_plastico: 0.8,          // evitar descartáveis
  compre_local: 1.2,           // logística menor
  sobra_zero: 0.6,             // evitar desperdício
  sacola_retornavel: 0.3,      // plástico
  desafio_carona: 2.0,         // menos carros
  moda_circular: 1.0,          // produção têxtil
  dia_vegano: 2.5,             // dieta
  plantio_amigo: 10.0          // longo prazo/árvore
};

// Inicializa missões com bloqueio por dificuldade
function seedMissions(): MissionState[] {
  return MISSIONS.map(m => ({
    ...m,
    accepted: false,
    completed: false,
    progress: 0,
    target: missionTargets[m.id] || 1,
    locked: m.difficulty === 'MÉDIO' || m.difficulty === 'DIFÍCIL', // FÁCIL destravadas inicialmente
  }));
}

function updateLocks(missions: MissionState[]): MissionState[] {
  const easyCompleted = missions.filter(m => m.difficulty === 'FÁCIL' && m.completed).length;
  const mediumCompleted = missions.filter(m => m.difficulty === 'MÉDIO' && m.completed).length;
  return missions.map(m => {
    if (m.difficulty === 'MÉDIO') {
      return { ...m, locked: easyCompleted < 2 && !m.completed };
    }
    if (m.difficulty === 'DIFÍCIL') {
      return { ...m, locked: mediumCompleted < 2 && !m.completed };
    }
    return m;
  });
}

export const useUserStore = create<UserState>((set, get) => ({
  transportEmission: 0,
  energyEmission: 0,
  foodEmission: 0,
  totalPoints: 1250,
  level: 0,
  levels: [
    { name: 'Iniciante', threshold: 0 },
    { name: 'Explorador', threshold: 500 },
    { name: 'Guardião', threshold: 1200 },
    { name: 'Embaixador', threshold: 2500 },
    { name: 'Lenda Verde', threshold: 5000 },
  ],
  totalReducedCO2: 0,
  missions: seedMissions(),
  activeMission: null,
  ownedItems: ['bg_default'],
  equippedItems: {
    accessory: null,
    bg: 'bg_default',
  },
  name: null,
  addEmission: (category, amount) => set((state) => {
    const key = `${category}Emission` as keyof UserState;
    return { ...state, [key]: (state[key] as number) + amount };
  }),
  addPoints: (amount) => set((state) => {
    const newPoints = state.totalPoints + amount;
    // atualizar nível conforme pontos
    let newLevel = state.level;
    for (let i = state.levels.length - 1; i >= 0; i--) {
      if (newPoints >= state.levels[i].threshold) { newLevel = i; break; }
    }
    return { totalPoints: newPoints, level: newLevel };
  }),
  buyItem: (itemId, price) => {
    const { totalPoints, ownedItems } = get();
    if (ownedItems.includes(itemId)) return true;
    if (totalPoints >= price) {
      // debita pontos e reavalia nível
      const newPoints = totalPoints - price;
      let newLevel = get().level;
      const levels = get().levels;
      for (let i = levels.length - 1; i >= 0; i--) {
        if (newPoints >= levels[i].threshold) { newLevel = i; break; }
      }
      set({ totalPoints: newPoints, ownedItems: [...ownedItems, itemId], level: newLevel });
      return true;
    }
    return false;
  },
  equipItem: (itemId, type) => set((state) => ({
    equippedItems: {
      ...state.equippedItems,
      [type]: itemId === state.equippedItems[type] ? null : itemId,
    }
  })),
  setName: (name) => set({ name }),
  acceptMission: (id) => set((state) => {
    const missions = state.missions.map(m => m.id === id && !m.completed ? { ...m, accepted: true } : m);
    const active = missions.find(m => m.id === id) || null;
    return { missions, activeMission: active };
  }),
  incrementMission: (id, steps = 1) => set((state) => {
    const missions = state.missions.map(m => {
      if (m.id !== id || !m.accepted || m.completed) return m;
      const newProgress = Math.min(m.progress + steps, m.target);
      return { ...m, progress: newProgress };
    });
    return { missions, activeMission: missions.find(m => m.accepted && !m.completed) || null };
  }),
  completeMission: (id) => set((state) => {
    let gained = 0;
    let reduced = 0;
    let missions = state.missions.map(m => {
      if (m.id !== id || !m.accepted || m.completed) return m;
      if (m.progress < m.target) return m; // ainda não pronto
      gained += m.points;
      reduced += missionCO2Reduction[m.id] || 0;
      return { ...m, completed: true, accepted: false };
    });
    missions = updateLocks(missions);
    const active = missions.find(m => m.accepted && !m.completed) || null;
    // atualiza pontos e nível
    const newPoints = state.totalPoints + gained;
    let newLevel = state.level;
    for (let i = state.levels.length - 1; i >= 0; i--) {
      if (newPoints >= state.levels[i].threshold) { newLevel = i; break; }
    }
    return { missions, activeMission: active, totalPoints: newPoints, level: newLevel, totalReducedCO2: state.totalReducedCO2 + reduced };
  }),
  computeLevel: () => {
    const { totalPoints, levels } = get();
    let newLevel = 0;
    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalPoints >= levels[i].threshold) { newLevel = i; break; }
    }
    set({ level: newLevel });
  }
}));
