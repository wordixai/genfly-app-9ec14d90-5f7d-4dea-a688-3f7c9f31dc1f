import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CargoItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Trash2 } from "lucide-react";

interface CargoFormProps {
  onAddCargo: (cargo: CargoItem) => void;
  onRemoveCargo: (id: string) => void;
  cargoItems: CargoItem[];
}

export function CargoForm({ onAddCargo, onRemoveCargo, cargoItems }: CargoFormProps) {
  const [name, setName] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [stackable, setStackable] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCargo: CargoItem = {
      id: uuidv4(),
      name,
      length: parseFloat(length),
      width: parseFloat(width),
      height: parseFloat(height),
      weight: parseFloat(weight),
      quantity: parseInt(quantity, 10),
      stackable
    };
    
    onAddCargo(newCargo);
    
    // Reset form
    setName("");
    setLength("");
    setWidth("");
    setHeight("");
    setWeight("");
    setQuantity("1");
    setStackable(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>添加货物</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">货物名称</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">数量</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="length">长度 (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  min="1"
                  step="0.1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="width">宽度 (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">高度 (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">重量 (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="stackable"
                  checked={stackable}
                  onCheckedChange={setStackable}
                />
                <Label htmlFor="stackable">可堆叠</Label>
              </div>
            </div>
            
            <Button type="submit" className="w-full">添加货物</Button>
          </form>
        </CardContent>
      </Card>
      
      {cargoItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>货物清单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">名称</th>
                    <th className="text-left p-2">尺寸 (cm)</th>
                    <th className="text-left p-2">重量 (kg)</th>
                    <th className="text-left p-2">数量</th>
                    <th className="text-left p-2">可堆叠</th>
                    <th className="text-left p-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cargoItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{`${item.length} × ${item.width} × ${item.height}`}</td>
                      <td className="p-2">{item.weight}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">{item.stackable ? "是" : "否"}</td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveCargo(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}