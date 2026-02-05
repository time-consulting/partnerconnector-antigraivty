import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, FileIcon, CheckIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BillUploadProps {
  dealId: string;
  onComplete?: () => void;
  isOptional?: boolean;
}

export default function BillUpload({ dealId, onComplete, isOptional = false }: BillUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/deals/${dealId}/upload-bill`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Files Uploaded Successfully",
        description: "Your payment processing bills have been uploaded and will help us create a competitive quote.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      setUploadedFiles([]);
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not supported. Please upload PDF, JPEG, or PNG files.`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Maximum file size is 10MB.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (uploadedFiles.length === 0) return;

    const formData = new FormData();
    formData.append('dealId', dealId);
    uploadedFiles.forEach((file) => {
      formData.append('bills', file);
    });

    uploadMutation.mutate(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadIcon className="w-5 h-5 text-primary" />
          Upload Current Payment Processing Bills
          {isOptional && (
            <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload your current payment processing statements to help us create a more accurate competitive quote. 
          This helps ensure better savings for your client.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          data-testid="file-drop-zone"
        >
          <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: PDF, JPEG, PNG (Max 10MB each)
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="file-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            data-testid="button-select-files"
          >
            Select Files
          </Button>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Files:</Label>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  data-testid={`uploaded-file-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    data-testid={`button-remove-file-${index}`}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || uploadMutation.isPending}
            className="flex items-center gap-2"
            data-testid="button-upload-bills"
          >
            {uploadMutation.isPending ? (
              <>Processing...</>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Upload Bills ({uploadedFiles.length})
              </>
            )}
          </Button>
          
          {isOptional && (
            <Button
              type="button"
              variant="outline"
              onClick={onComplete}
              data-testid="button-skip-upload"
            >
              Skip for Now
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
          <strong>Why upload bills?</strong> Your current payment processing statements help us:
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Calculate exact savings potential</li>
            <li>Create more competitive quotes</li>
            <li>Identify hidden fees in current setup</li>
            <li>Ensure accurate commission calculations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}