import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContainerVisualization } from "@/components/ContainerVisualization";
import { OptimizationResult } from "@/types";

interface OptimizationResultsProps {
  result: OptimizationResult | null;
}

export function OptimizationResults({ result }: OptimizationResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  if (!result) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>优化结果</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="summary" className="flex-1">总览</TabsTrigger>
            {result.plans.map((plan, index) => (
              <TabsTrigger key={plan.containerId} value={`container-${index}`} className="flex-1">
                {`${plan.containerType} #${index + 1}`}
              </TabsTrigger>
            ))}
            {result.unplacedItems.length > 0 && (
              <TabsTrigger value="unplaced" className="flex-1">未装载</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium">集装箱数量</h3>
                  <p className="text-3xl font-bold">{result.totalContainers}</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium">总体积利用率</h3>
                  <p className="text-3xl font-bold">{result.totalUtilization.toFixed(2)}%</p>
                </div>
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-medium">未装载货物</h3>
                  <p className="text-3xl font-bold">{result.unplacedItems.length}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">集装箱使用情况</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">集装箱类型</th>
                      <th className="text-left p-2">数量</th>
                      <th className="text-left p-2">体积利用率</th>
                      <th className="text-left p-2">重量利用率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.plans.map((plan, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{plan.containerType}</td>
                        <td className="p-2">1</td>
                        <td className="p-2">{plan.utilizationVolume.toFixed(2)}%</td>
                        <td className="p-2">{plan.utilizationWeight.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {result.plans.map((plan, index) => (
            <TabsContent key={plan.containerId} value={`container-${index}`}>
              <ContainerVisualization plan={plan} />
            </TabsContent>
          ))}
          
          {result.unplacedItems.length > 0 && (
            <TabsContent value="unplaced">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">未装载货物</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">货物名称</th>
                        <th className="text-left p-2">尺寸 (cm)</th>
                        <th className="text-left p-2">重量 (kg)</th>
                        <th className="text-left p-2">数量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.unplacedItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{`${item.length} × ${item.width} × ${item.height}`}</td>
                          <td className="p-2">{item.weight}</td>
                          <td className="p-2">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}