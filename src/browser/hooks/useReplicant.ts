import { useCallback, useEffect, useState } from 'react';
import type { ReplicantMap } from '../../nodecg/replicants';

export const useReplicant = <T extends keyof ReplicantMap>(
  name: T
): [ReplicantMap[T] | undefined, (newValue: ReplicantMap[T]) => void] => {
  const [rep] = useState(() => nodecg.Replicant(name));
  const [value, setValue] = useState<ReplicantMap[T] | undefined>(undefined);
  useEffect(() => {
    const handleChange = (newValue: ReplicantMap[T]) => setValue(newValue);
    rep.on('change', handleChange);
    return () => {
      rep.removeListener('change', handleChange);
    };
  }, [rep]);
  return [value, useCallback((newValue) => (rep.value = newValue), [rep])];
};
