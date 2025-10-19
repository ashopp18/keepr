// lib/bridges/DayRolloverBridge.tsx
import React, { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTreatments } from '@lib/store/useTreatments';

function todayIso() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Rellama a rebuildToday cuando cambia el día (p. ej. a medianoche,
 * o al volver la app al foreground otro día).
 */
export default function DayRolloverBridge() {
  const rebuildToday = useTreatments(s => s.rebuildTodayFromTreatments);

  // ✅ useRef recibe un string inicial, no una función
  const lastDateRef = useRef<string>(todayIso());

  useEffect(() => {
    const check = () => {
      const now = todayIso();
      if (now !== lastDateRef.current) {
        lastDateRef.current = now;
        rebuildToday(); // regeneramos la lista "today"
      }
    };

    // Al cambiar el estado de la app (background/foreground), comprobamos
    const sub = AppState.addEventListener('change', (_state: AppStateStatus) => {
      check();
    });

    // Y además, por si la app permanece activa, chequeo cada minuto
    const id = setInterval(check, 60 * 1000);

    return () => {
      sub.remove();
      clearInterval(id);
    };
  }, [rebuildToday]);

  return null;
}
