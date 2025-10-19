// lib/store/useProgress.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentAuthKey } from '@lib/store/linkAuth'; // 👈 ruta correcta

export type ProgressPhoto = {
  id: string;
  uri: string;
  date: string; // YYYY-MM-DD
  note?: string;
};

export type WeeklyCheck = {
  id: string;
  weekOf: string; // YYYY-WW
  answers: {
    shedding: boolean;
    itch: boolean;
    redness: boolean;
    dizziness: boolean;
    libidoChanges: boolean;
    otherNote?: string;
  };
};

type ProgressState = {
  photos: ProgressPhoto[];
  checks: WeeklyCheck[];

  addPhoto: (p: Omit<ProgressPhoto, 'id'>) => void;
  removePhoto: (id: string) => void;

  upsertCheck: (c: Omit<WeeklyCheck, 'id'>) => void;

  clearAll: () => void;
};

const userKey = async () => {
  const k = await getCurrentAuthKey();
  return `keepr-progress-${k}`;
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      photos: [],
      checks: [],

      addPhoto: (p) => {
        const id = `p-${Date.now()}`;
        set((s) => ({ photos: [{ id, ...p }, ...s.photos] }));
      },

      removePhoto: (id) => {
        set((s) => ({ photos: s.photos.filter((x) => x.id !== id) }));
      },

      upsertCheck: (c) => {
        const id = `w-${c.weekOf}`;
        set((s) => {
          const idx = s.checks.findIndex((x) => x.weekOf === c.weekOf);
          if (idx >= 0) {
            const next = [...s.checks];
            next[idx] = { ...next[idx], answers: c.answers };
            return { checks: next };
          }
          return { checks: [{ id, ...c }, ...s.checks] };
        });
      },

      clearAll: () => set({ photos: [], checks: [] }),
    }),
    {
      name: 'keepr-progress',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      onRehydrateStorage: () => async () => {
        // Mantiene el mismo patrón de “clave por usuario” que treatments.
        // Si en el futuro quieres cambiar dinámicamente la clave, ya tienes userKey().
        await userKey();
      },
    }
  )
);
