// lib/store/useTreatments.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DoseUnit = 'ml' | 'mg' | 'mcg' | 'drops' | 'pills';
export type Dose = { amount: number; unit: DoseUnit };
export type Treatment = {
  id: string;
  name: string;
  time: string;
  dose?: Dose;
  frequency: 'daily';
  days?: string[];
  reminder?: boolean;
};
export type TodayItem = { id: string; done: boolean; time: string };

type StoreState = {
  treatments: Treatment[];
  today: TodayItem[];
  streakDays: number;
  streakMarkedFor: string | null;

  addTreatment: (t: Omit<Treatment, 'id'>) => void;
  removeTreatment: (id: string) => void;
  toggleToday: (id: string) => void;
  rebuildTodayFromTreatments: () => void;
  clearAll: () => void;
};

const todayIso = () => new Date().toISOString().slice(0, 10);
const buildToday = (ts: Treatment[]): TodayItem[] =>
  ts.map(t => ({ id: t.id, done: false, time: t.time }));

export const doseToString = (d: Dose) => `${d.amount} ${d.unit}`;
const storageKeyFor = (uid: string | null) => `keepr-store-${uid ?? 'guest'}`;

export const useTreatments = create<StoreState>()(
  persist(
    (set, get) => ({
      treatments: [],
      today: [],
      streakDays: 0,
      streakMarkedFor: null,

      addTreatment: (t) => {
        const id = `${t.name || 'custom'}-${t.time}-${Date.now()}`;
        const newT: Treatment = { id, ...t };
        set(s => {
          const treatments = [newT, ...s.treatments];
          return { treatments, today: buildToday(treatments) };
        });
      },

      removeTreatment: (id) => {
        set(s => {
          const treatments = s.treatments.filter(x => x.id !== id);
          return { treatments, today: buildToday(treatments) };
        });
      },

      toggleToday: (id) => {
        set(s => {
          const next = s.today.map(it => (it.id === id ? { ...it, done: !it.done } : it));
          const allDone = next.length > 0 && next.every(it => it.done);
          const iso = todayIso();
          let { streakDays, streakMarkedFor } = s;

          if (allDone && streakMarkedFor !== iso) {
            streakDays += 1;
            streakMarkedFor = iso;
          }
          if (!allDone && streakMarkedFor === iso) {
            streakDays = Math.max(0, streakDays - 1);
            streakMarkedFor = null;
          }
          return { today: next, streakDays, streakMarkedFor };
        });
      },

      rebuildTodayFromTreatments: () => {
        const base = buildToday(get().treatments);
        set({ today: base });
      },

      clearAll: () => set({ treatments: [], today: [], streakDays: 0, streakMarkedFor: null }),
    }),
    {
      name: storageKeyFor(null),
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

export async function rehydrateForUser(uid: string | null) {
  // @ts-ignore
  useTreatments.persist.setOptions({
    name: storageKeyFor(uid),
    storage: createJSONStorage(() => AsyncStorage),
  });
  // @ts-ignore
  await useTreatments.persist.rehydrate();
  useTreatments.getState().rebuildTodayFromTreatments();
}
