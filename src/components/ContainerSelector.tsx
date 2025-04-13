import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CONTAINER_SPECS } from "@/data/containers";
import { Container } from "@/types";

interface ContainerSelectorProps {
  selectedContainers: Container[];
  onContainerSelectionChange: (containers: Container[]) => void;
}

export function ContainerSelector({
  selectedContainers,
  onContainerSelectionChange
}: ContainerSelectorProps) {
  const handleContainerToggle = (containerId: string) => {
    const container = CONTAINER_SPECS.find(c => c.id === containerId);
    if (!container) return;
    
    const isSelected = selectedContainers.some(c => c.id === containerId);
    
    if (isSelected) {
      onContainerSelectionChange(selectedContainers.filter(c => c.id !== containerId));
    } else {
      onContainerSelectionChange([...selectedContainers, container]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>选择集装箱类型</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTAINER_SPECS.map((container) => (
            <div key={container.id} className="flex items-center space-x-2">
              <Checkbox
                id={`container-${container.id}`}
                checked={selectedContainers.some(c => c.id === container.id)}
                onCheckedChange={() => handleContainerToggle(container.id)}
              />
              <Label htmlFor={`container-${container.id}`} className="flex-1">
                <div className="font-medium">{container.type}</div>
                <div className="text-sm text-muted-foreground">
                  {`${container.length} × ${container.width} × ${container.height} cm`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {`最大载重: ${container.maxWeight} kg`}
                </div>
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}