import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingPlan, PlacedItem } from "@/types";
import { getContainerById } from "@/data/containers";

interface ContainerVisualizationProps {
  plan: LoadingPlan;
}

const COLORS = [
  "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6",
  "#1abc9c", "#d35400", "#c0392b", "#16a085", "#8e44ad"
];

export function ContainerVisualization({ plan }: ContainerVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const container = getContainerById(plan.containerId);
    if (!container) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scale factor to fit container in canvas
    const scaleX = canvasWidth / container.length;
    const scaleY = canvasHeight / container.height;
    const scale = Math.min(scaleX, scaleY) * 0.9;
    
    // Calculate container dimensions in canvas
    const containerWidth = container.length * scale;
    const containerHeight = container.height * scale;
    const containerDepth = container.width * scale;
    
    // Calculate offset to center container
    const offsetX = (canvasWidth - containerWidth) / 2;
    const offsetY = (canvasHeight - containerHeight) / 2;
    
    // Draw container outline
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, containerWidth, containerHeight);
    
    // Draw items
    plan.items.forEach((item, index) => {
      const colorIndex = index % COLORS.length;
      ctx.fillStyle = COLORS[colorIndex];
      
      // Calculate item dimensions and position in canvas
      const itemWidth = item.rotation === "length-width" ? item.length * scale : item.width * scale;
      const itemHeight = item.height * scale;
      
      const x = offsetX + item.position.x * scale;
      const y = offsetY + item.position.z * scale;
      
      // Draw item
      ctx.fillRect(x, y, itemWidth, itemHeight);
      
      // Draw item border
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, itemWidth, itemHeight);
      
      // Draw item label if there's enough space
      if (itemWidth > 30 && itemHeight > 20) {
        ctx.fillStyle = "#fff";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.name, x + itemWidth / 2, y + itemHeight / 2);
      }
    });
    
    // Draw utilization info
    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`体积利用率: ${plan.utilizationVolume.toFixed(2)}%`, 10, 10);
    ctx.fillText(`重量利用率: ${plan.utilizationWeight.toFixed(2)}%`, 10, 30);
    
  }, [plan]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${plan.containerType} 装载方案`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-md border">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="h-full w-full"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">体积利用率</h4>
            <p className="text-2xl font-bold">{plan.utilizationVolume.toFixed(2)}%</p>
          </div>
          <div>
            <h4 className="font-medium">重量利用率</h4>
            <p className="text-2xl font-bold">{plan.utilizationWeight.toFixed(2)}%</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">装载货物清单</h4>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">货物名称</th>
                  <th className="text-left p-2">尺寸 (cm)</th>
                  <th className="text-left p-2">重量 (kg)</th>
                  <th className="text-left p-2">位置</th>
                </tr>
              </thead>
              <tbody>
                {plan.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{`${item.length} × ${item.width} × ${item.height}`}</td>
                    <td className="p-2">{item.weight}</td>
                    <td className="p-2">{`(${item.position.x}, ${item.position.y}, ${item.position.z})`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}