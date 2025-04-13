export interface CargoItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  stackable: boolean;
}

export interface Container {
  id: string;
  type: ContainerType;
  length: number;
  width: number;
  height: number;
  maxWeight: number;
}

export enum ContainerType {
  GP20 = "20GP",
  HQ20 = "20HQ",
  GP40 = "40GP",
  HQ40 = "40HQ"
}

export interface LoadingPlan {
  containerId: string;
  containerType: ContainerType;
  items: PlacedItem[];
  utilizationVolume: number;
  utilizationWeight: number;
  remainingVolume: number;
  remainingWeight: number;
}

export interface PlacedItem {
  id: string;
  cargoId: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: "length-width" | "width-length";
}

export interface OptimizationResult {
  plans: LoadingPlan[];
  unplacedItems: CargoItem[];
  totalContainers: number;
  totalUtilization: number;
}