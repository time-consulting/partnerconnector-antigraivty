import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadIcon, FileTextIcon, CheckCircleIcon } from "lucide-react";

export default function UploadBills() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedReferral, setSelectedReferral] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: deals } = useQuery({
    queryKey: ["/api/deals"],
    enabled: isAuthenticated,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedReferral || !uploadedFile) {
      toast({
        title: "Missing Information",
        description: "Please select a deal and upload a bill file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('bills', uploadedFile);

    try {
      const response = await fetch(`/api/deals/${selectedReferral}/upload-bill`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Bill Uploaded",
        description: "Your bill has been uploaded successfully and will be analyzed for comparison.",
      });
      
      setSelectedReferral("");
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Upload Bills for Comparison</CardTitle>
            <p className="text-xl text-muted-foreground text-center">
              Upload current payment processing bills to get competitive quotes
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="deal-select" className="text-base font-medium">
                  Select Referral
                </Label>
                <Select value={selectedReferral} onValueChange={setSelectedReferral}>
                  <SelectTrigger data-testid="select-deal">
                    <SelectValue placeholder="Choose a deal to upload bills for" />
                  </SelectTrigger>
                  <SelectContent>
                    {(deals as any[])?.map((deal: any) => (
                      <SelectItem key={deal?.id} value={deal?.id}>
                        {deal?.businessName} - {deal?.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bill-upload" className="text-base font-medium">
                  Upload Payment Processing Bill
                </Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="bill-upload" 
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                      data-testid="label-file-upload"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadedFile ? (
                          <>
                            <CheckCircleIcon className="w-12 h-12 text-green-600 mb-4" />
                            <p className="text-sm text-foreground font-semibold" data-testid="text-uploaded-file">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </>
                        ) : (
                          <>
                            <UploadIcon className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 10MB)</p>
                          </>
                        )}
                      </div>
                      <Input
                        id="bill-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        data-testid="input-file-upload"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={!selectedReferral || !uploadedFile}
                data-testid="button-upload-bill"
              >
                Upload Bill for Analysis
              </Button>
            </form>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileTextIcon className="w-5 h-5 mr-2 text-primary" />
                    What We Analyze
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Current processing rates and fees
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Monthly transaction volumes
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Additional service charges
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Potential savings opportunities
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <i className="fas fa-lock text-green-500 mr-2"></i>
                      Bank-grade encryption
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                      GDPR compliant processing
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-trash text-green-500 mr-2"></i>
                      Files deleted after analysis
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-eye-slash text-green-500 mr-2"></i>
                      Confidential client data protection
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
