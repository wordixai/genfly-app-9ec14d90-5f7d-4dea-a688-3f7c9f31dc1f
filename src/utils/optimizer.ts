import { CargoItem, Container, LoadingPlan, PlacedItem, OptimizationResult } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Simple 3D bin packing algorithm (First Fit Decreasing Height)
export function optimizeLoading(
  items: CargoItem[],
  containers: Container[]
): OptimizationResult {
  // Sort containers by volume (smallest to largest)
  const sortedContainers = [...containers].sort((a, b) => {
    const volumeA = a.length * a.width * a.height;
    const volumeB = b.length * b.width * b.height;
    return volumeA - volumeB;
  });

  // Expand items based on quantity
  let expandedItems: CargoItem[] = [];
  items.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      expandedItems.push({
        ...item,
        id: `${item.id}-${i}`,
        quantity: 1
      });
    }
  });

  // Sort items by volume (largest to smallest)
  expandedItems = expandedItems.sort((a, b) => {
    const volumeA = a.length * a.width * a.height;
    const volumeB = b.length * b.width * b.height;
    return volumeB - volumeA;
  });

  const plans: LoadingPlan[] = [];
  let unplacedItems = [...expandedItems];
  let currentContainerIndex = 0;

  while (unplacedItems.length > 0 && currentContainerIndex < sortedContainers.length) {
    const container = sortedContainers[currentContainerIndex];
    const plan = createLoadingPlan(container, unplacedItems);
    
    if (plan.items.length > 0) {
      plans.push(plan);
      
      // Remove placed items from unplaced items
      const placedItemIds = new Set(plan.items.map(item => item.cargoId));
      unplacedItems = unplacedItems.filter(item => !placedItemIds.has(item.id));
    } else {
      // If no items could be placed in this container, try the next container type
      currentContainerIndex++;
    }
  }

  // Calculate total utilization
  let totalVolume = 0;
  let totalUsedVolume = 0;
  
  plans.forEach(plan => {
    const container = sortedContainers.find(c => c.id === plan.containerId);
    if (container) {
      const containerVolume = container.length * container.width * container.height;
      totalVolume += containerVolume;
      totalUsedVolume += containerVolume - plan.remainingVolume;
    }
  });

  const totalUtilization = totalVolume > 0 ? (totalUsedVolume / totalVolume) * 100 : 0;

  return {
    plans,
    unplacedItems,
    totalContainers: plans.length,
    totalUtilization
  };
}

function createLoadingPlan(container: Container, items: CargoItem[]): LoadingPlan {
  const containerVolume = container.length * container.width * container.height;
  const placedItems: PlacedItem[] = [];
  let remainingVolume = containerVolume;
  let remainingWeight = container.maxWeight;

  // Simple space representation (this is a very basic approach)
  // In a real application, you'd use a more sophisticated 3D packing algorithm
  const spaces: Array<{
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
  }> = [
    {
      x: 0,
      y: 0,
      z: 0,
      length: container.length,
      width: container.width,
      height: container.height
    }
  ];

  for (const item of items) {
    if (item.weight > remainingWeight) {
      continue; // Skip if too heavy
    }

    // Try to find a space for this item
    let placed = false;
    
    for (let i = 0; i < spaces.length; i++) {
      const space = spaces[i];
      
      // Try both orientations (length-width and width-length)
      const orientations = [
        { length: item.length, width: item.width, height: item.height, type: "length-width" as const },
        { length: item.width, width: item.length, height: item.height, type: "width-length" as const }
      ];
      
      for (const orientation of orientations) {
        if (
          orientation.length <= space.length &&
          orientation.width <= space.width &&
          orientation.height <= space.height
        ) {
          // Place the item
          placedItems.push({
            id: uuidv4(),
            cargoId: item.id,
            name: item.name,
            length: orientation.length,
            width: orientation.width,
            height: orientation.height,
            weight: item.weight,
            position: {
              x: space.x,
              y: space.y,
              z: space.z
            },
            rotation: orientation.type
          });
          
          // Update remaining volume and weight
          const itemVolume = orientation.length * orientation.width * orientation.height;
          remainingVolume -= itemVolume;
          remainingWeight -= item.weight;
          
          // Split the space (very simplified approach)
          // Remove the current space
          spaces.splice(i, 1);
          
          // Add new spaces (right, front, top)
          if (orientation.length < space.length) {
            spaces.push({
              x: space.x + orientation.length,
              y: space.y,
              z: space.z,
              length: space.length - orientation.length,
              width: space.width,
              height: space.height
            });
          }
          
          if (orientation.width < space.width) {
            spaces.push({
              x: space.x,
              y: space.y + orientation.width,
              z: space.z,
              length: orientation.length,
              width: space.width - orientation.width,
              height: space.height
            });
          }
          
          if (orientation.height < space.height) {
            spaces.push({
              x: space.x,
              y: space.y,
              z: space.z + orientation.height,
              length: orientation.length,
              width: orientation.width,
              height: space.height - orientation.height
            });
          }
          
          placed = true;
          break;
        }
      }
      
      if (placed) break;
    }
  }

  return {
    containerId: container.id,
    containerType: container.type,
    items: placedItems,
    utilizationVolume: ((containerVolume - remainingVolume) / containerVolume) * 100,
    utilizationWeight: ((container.maxWeight - remainingWeight) / container.maxWeight) * 100,
    remainingVolume,
    remainingWeight
  };
}