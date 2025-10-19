// lib/store/useTasks.ts
import { create } from 'zustand';

export type Task = {
  id: string;
  title: string;
  time?: string;           // "08:00"
  schedule?: 'daily';      // por ahora todo diario
  streak?: number;         // racha simple
  lastDone?: string;       // ISO date "YYYY-MM-DD"
};

type State = {
  tasks: Task[];
  toggleDone: (id: string) => void;
  skipToday: (id: string) => void; // placeholder (puedes implementarlo luego)
};

// util: fecha de hoy en ISO (solo día)
const todayIso = (): string => new Date().toISOString().slice(0, 10);
const isToday = (iso?: string) => !!iso && iso === todayIso();

export const useTasks = create<State>((set) => ({
  // Datos iniciales de ejemplo para que la Home no quede vacía:
  tasks: [
    { id: 't1', title: 'Minoxidil',  time: '08:00', schedule: 'daily', streak: 3, lastDone: undefined },
    { id: 't2', title: 'Finasteride', time: '21:00', schedule: 'daily', streak: 1, lastDone: undefined },
  ],

  toggleDone: (id) =>
    set((state) => {
      const next = state.tasks.map((t) => {
        if (t.id !== id) return t;
        // si ya está marcado hoy -> desmarcar; si no, marcar hoy y sumar racha
        if (isToday(t.lastDone)) {
          return { ...t, lastDone: undefined };
        }
        return { ...t, lastDone: todayIso(), streak: (t.streak ?? 0) + 1 };
      });
      return { tasks: next };
    }),

  skipToday: (_id) => {
    // lo implementaremos más adelante (p. ej. marcar como saltado sin sumar racha)
  },
}));

// helpers exportables si te sirven
export const isDoneToday = (task: Task) => isToday(task.lastDone);
