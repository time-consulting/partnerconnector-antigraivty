import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SearchIcon,
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  PresentationIcon,
  VideoIcon,
  MailIcon,
  PieChartIcon,
  FilterIcon,
  StarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'brochure' | 'flyer' | 'template' | 'guide' | 'video' | 'presentation';
  category: string;
  fileSize: string;
  downloadCount: number;
  rating: number;
  isNew: boolean;
  fileFormat: string;
}

export default function DownloadableResources() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Payment Processing Solutions Brochure',
      description: 'Professional brochure showcasing card machines and payment processing benefits',
      type: 'brochure',
      category: 'sales-materials',
      fileSize: '2.4 MB',
      downloadCount: 1247,
      rating: 4.8,
      isNew: false,
      fileFormat: 'PDF'
    },
    {
      id: '2',
      title: 'Commission Rate Sheet',
      description: 'Detailed breakdown of commission rates for all services and partner levels',
      type: 'guide',
      category: 'commission-info',
      fileSize: '856 KB',
      downloadCount: 2103,
      rating: 4.9,
      isNew: false,
      fileFormat: 'PDF'
    },
    {
      id: '3',
      title: 'Client Proposal Template',
      description: 'Professional proposal template for presenting services to potential clients',
      type: 'template',
      category: 'sales-materials',
      fileSize: '1.2 MB',
      downloadCount: 876,
      rating: 4.7,
      isNew: true,
      fileFormat: 'DOCX'
    },
    {
      id: '4',
      title: 'Email Templates Collection',
      description: 'Pre-written email templates for follow-ups, introductions, and proposals',
      type: 'template',
      category: 'communication',
      fileSize: '324 KB',
      downloadCount: 1534,
      rating: 4.6,
      isNew: false,
      fileFormat: 'DOCX'
    },
    {
      id: '5',
      title: 'Business Funding Overview Flyer',
      description: 'Eye-catching flyer explaining merchant cash advance and funding options',
      type: 'flyer',
      category: 'sales-materials',
      fileSize: '1.8 MB',
      downloadCount: 692,
      rating: 4.5,
      isNew: true,
      fileFormat: 'PDF'
    },
    {
      id: '6',
      title: 'Partner Success Stories',
      description: 'Case studies and testimonials from successful partners',
      type: 'guide',
      category: 'marketing',
      fileSize: '3.1 MB',
      downloadCount: 567,
      rating: 4.8,
      isNew: false,
      fileFormat: 'PDF'
    },
    {
      id: '7',
      title: 'Sales Presentation Template',
      description: 'PowerPoint template for client presentations with editable slides',
      type: 'presentation',
      category: 'sales-materials',
      fileSize: '4.2 MB',
      downloadCount: 423,
      rating: 4.4,
      isNew: true,
      fileFormat: 'PPTX'
    },
    {
      id: '8',
      title: 'Objection Handling Guide',
      description: 'Comprehensive guide to handling common client objections effectively',
      type: 'guide',
      category: 'training',
      fileSize: '1.5 MB',
      downloadCount: 1289,
      rating: 4.9,
      isNew: false,
      fileFormat: 'PDF'
    },
    {
      id: '9',
      title: 'Product Comparison Chart',
      description: 'Visual comparison of all services and their benefits',
      type: 'guide',
      category: 'sales-materials',
      fileSize: '756 KB',
      downloadCount: 834,
      rating: 4.6,
      isNew: false,
      fileFormat: 'PDF'
    },
    {
      id: '10',
      title: 'Social Media Post Templates',
      description: 'Ready-to-use social media templates for LinkedIn, Facebook, and Twitter',
      type: 'template',
      category: 'marketing',
      fileSize: '892 KB',
      downloadCount: 612,
      rating: 4.3,
      isNew: true,
      fileFormat: 'ZIP'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', count: resources.length },
    { id: 'sales-materials', name: 'Sales Materials', count: resources.filter(r => r.category === 'sales-materials').length },
    { id: 'commission-info', name: 'Commission Info', count: resources.filter(r => r.category === 'commission-info').length },
    { id: 'communication', name: 'Communication', count: resources.filter(r => r.category === 'communication').length },
    { id: 'marketing', name: 'Marketing', count: resources.filter(r => r.category === 'marketing').length },
    { id: 'training', name: 'Training', count: resources.filter(r => r.category === 'training').length }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'brochure': return <FileTextIcon className="w-5 h-5 text-blue-600" />;
      case 'flyer': return <ImageIcon className="w-5 h-5 text-green-600" />;
      case 'template': return <FileTextIcon className="w-5 h-5 text-purple-600" />;
      case 'guide': return <FileTextIcon className="w-5 h-5 text-orange-600" />;
      case 'video': return <VideoIcon className="w-5 h-5 text-red-600" />;
      case 'presentation': return <PresentationIcon className="w-5 h-5 text-indigo-600" />;
      default: return <FileTextIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleDownload = (resource: Resource) => {
    // In a real app, this would trigger an actual file download
    toast({
      title: "Download Started",
      description: `${resource.title} is being downloaded to your device.`,
    });
    console.log('Downloading:', resource.title);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Resource Library</h2>
        <p className="text-muted-foreground text-lg">
          Download sales materials, templates, and guides to help you succeed
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
            data-testid="input-search-resources"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
                data-testid={`button-filter-${category.id}`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(resource.type)}
                      <div>
                        <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                        {resource.isNew && (
                          <Badge className="mt-1 bg-green-600">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span>{resource.fileFormat}</span>
                      <span>{resource.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(resource.rating)}
                      <span className="ml-1">({resource.downloadCount})</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleDownload(resource)}
                    className="w-full"
                    data-testid={`button-download-${resource.id}`}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getTypeIcon(resource.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{resource.title}</h3>
                        {resource.isNew && (
                          <Badge className="bg-green-600">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{resource.fileFormat} • {resource.fileSize}</span>
                        <div className="flex items-center gap-1">
                          {renderStars(resource.rating)}
                          <span>({resource.downloadCount} downloads)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(resource)}
                    variant="outline"
                    data-testid={`button-download-list-${resource.id}`}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileTextIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No resources found</h3>
          <p className="text-muted-foreground">
            Try different search terms or select a different category
          </p>
        </div>
      )}

      {/* Quick Access */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            Quick Access Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <MailIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Email Templates</h4>
              <p className="text-sm text-muted-foreground">Ready-to-send email templates</p>
            </div>
            <div className="text-center">
              <FileTextIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Commission Sheets</h4>
              <p className="text-sm text-muted-foreground">Latest commission rates</p>
            </div>
            <div className="text-center">
              <PresentationIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Presentation Templates</h4>
              <p className="text-sm text-muted-foreground">Professional client presentations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}