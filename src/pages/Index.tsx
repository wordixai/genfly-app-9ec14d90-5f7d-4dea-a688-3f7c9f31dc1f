import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CargoForm } from "@/components/CargoForm";
import { ContainerSelector } from "@/components/ContainerSelector";
import { FileUpload } from "@/components/FileUpload";
import { OptimizationResults } from "@/components/OptimizationResults";
import { CargoItem, Container, OptimizationResult } from "@/types";
import { CONTAINER_SPECS } from "@/data/containers";
import { optimizeLoading } from "@/utils/optimizer";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [selectedContainers, setSelectedContainers] = useState<Container[]>([CONTAINER_SPECS[0], CONTAINER_SPECS[3]]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleAddCargo = (cargo: CargoItem) => {
    setCargoItems([...cargoItems, cargo]);
    toast({
      title: "货物已添加",
      description: `${cargo.name} 已添加到货物清单`,
    });
  };

  const handleRemoveCargo = (id: string) => {
    setCargoItems(cargoItems.filter(item => item.id !== id));
    toast({
      title: "货物已移除",
      description: "货物已从清单中移除",
    });
  };

  const handleCargoItemsLoaded = (items: CargoItem[]) => {
    setCargoItems(items);
    toast({
      title: "货物清单已导入",
      description: `成功导入 ${items.length} 个货物项目`,
    });
  };

  const handleOptimize = () => {
    if (cargoItems.length === 0) {
      toast({
        title: "无法优化",
        description: "请先添加货物",
        variant: "destructive",
      });
      return;
    }

    if (selectedContainers.length === 0) {
      toast({
        title: "无法优化",
        description: "请选择至少一种集装箱类型",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    
    // Use setTimeout to allow UI to update before running the optimization
    setTimeout(() => {
      try {
        const result = optimizeLoading(cargoItems, selectedContainers);
        setOptimizationResult(result);
        
        toast({
          title: "优化完成",
          description: `已生成 ${result.plans.length} 个集装箱装载方案`,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "优化失败",
          description: "计算装载方案时出错",
          variant: "destructive",
        });
      } finally {
        setIsOptimizing(false);
      }
    }, 100);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">海运集装箱智能装载优化系统</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <FileUpload onCargoItemsLoaded={handleCargoItemsLoaded} />
          <ContainerSelector
            selectedContainers={selectedContainers}
            onContainerSelectionChange={setSelectedContainers}
          />
          <Button
            className="w-full"
            size="lg"
            onClick={handleOptimize}
            disabled={isOptimizing || cargoItems.length === 0 || selectedContainers.length === 0}
          >
            {isOptimizing ? "优化中..." : "开始优化装载"}
          </Button>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <CargoForm
            onAddCargo={handleAddCargo}
            onRemoveCargo={handleRemoveCargo}
            cargoItems={cargoItems}
          />
          
          {optimizationResult && (
            <OptimizationResults result={optimizationResult} />
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;