import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateExcelTemplate, parseExcelData } from "@/utils/excelUtils";
import { CargoItem } from "@/types";
import { Download, Upload } from "lucide-react";

interface FileUploadProps {
  onCargoItemsLoaded: (items: CargoItem[]) => void;
}

export function FileUpload({ onCargoItemsLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadTemplate = () => {
    try {
      // 生成模板
      const blob = generateExcelTemplate();
      
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cargo_template.csv";
      
      // 触发下载
      document.body.appendChild(a);
      a.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("模板下载失败:", err);
      setError("模板下载失败，请稍后再试");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const items = await parseExcelData(file);
      onCargoItemsLoaded(items);
    } catch (err) {
      setError("文件解析失败，请确保使用正确的模板格式");
      console.error(err);
    } finally {
      setIsLoading(false);
      // 重置输入
      e.target.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>导入货物清单</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDownloadTemplate}
        >
          <Download className="mr-2 h-4 w-4" />
          下载模板
        </Button>
        
        <div className="grid w-full items-center gap-1.5">
          <label
            htmlFor="file-upload"
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-input bg-background px-4 py-5 text-center"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="mt-2 text-sm text-muted-foreground">
              点击或拖拽文件到此处上传
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              支持 CSV 格式
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </label>
        </div>
        
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
      </CardContent>
    </Card>
  );
}