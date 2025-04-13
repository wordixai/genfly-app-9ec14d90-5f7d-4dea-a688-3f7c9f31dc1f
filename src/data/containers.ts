import { Container, ContainerType } from "@/types";

export const CONTAINER_SPECS: Container[] = [
  {
    id: "20gp",
    type: ContainerType.GP20,
    length: 590, // cm
    width: 235, // cm
    height: 239, // cm
    maxWeight: 28000 // kg
  },
  {
    id: "20hq",
    type: ContainerType.HQ20,
    length: 590, // cm
    width: 235, // cm
    height: 269, // cm
    maxWeight: 28000 // kg
  },
  {
    id: "40gp",
    type: ContainerType.GP40,
    length: 1203, // cm
    width: 235, // cm
    height: 239, // cm
    maxWeight: 26000 // kg
  },
  {
    id: "40hq",
    type: ContainerType.HQ40,
    length: 1203, // cm
    width: 235, // cm
    height: 269, // cm
    maxWeight: 26000 // kg
  }
];

export const getContainerById = (id: string): Container | undefined => {
  return CONTAINER_SPECS.find(container => container.id === id);
};

export const getContainerByType = (type: ContainerType): Container | undefined => {
  return CONTAINER_SPECS.find(container => container.type === type);
};