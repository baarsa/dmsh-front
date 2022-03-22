import { useEffect, useState } from "react";
import { LoadsDistributionVM } from "../view-models/pages/LoadsDistributionVM";
import { LoadsDistribution } from "../components/loads-distribution/LoadsDistribution";
import { scheduleRepository } from "../models/schedule/ScheduleRepository";

export const LoadsDistributionPage = () => {
  const [vm, setVm] = useState<LoadsDistributionVM | null>(null);
  useEffect(() => {
    async function init() {
      const schedule = await scheduleRepository.getEntityById(1);
      if (schedule === null) {
        throw new Error(); // todo think about it
      }
      setVm(new LoadsDistributionVM(schedule));
    }
    init();
  }, []);
  if (vm === null) {
    return null; //todo loader
  }
  return <LoadsDistribution vm={vm} />;
};
