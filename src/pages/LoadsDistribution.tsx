import { useEffect, useState } from "react";
import { LoadsDistributionVM } from "../view-models/pages/LoadsDistributionVM";
import { LoadsDistribution } from "../components/loads-distribution/LoadsDistribution";

export const LoadsDistributionPage = () => {
  const [vm, setVm] = useState<LoadsDistributionVM | null>(null);
  useEffect(() => {
    async function init() {
      setVm(new LoadsDistributionVM());
    }
    init();
  }, []);
  if (vm === null) {
    return null; //todo loader
  }
  return <LoadsDistribution vm={vm} />;
};
