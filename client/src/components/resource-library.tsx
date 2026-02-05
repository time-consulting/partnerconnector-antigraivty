import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MessageCircleIcon,
  BookOpenIcon,
  HelpCircleIcon,
  PhoneIcon,
  MailIcon,
  ExternalLinkIcon
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  views: number;
}

interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
}

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Everything you need to know to begin earning commissions',
      icon: <BookOpenIcon className="w-5 h-5" />,
      articleCount: 12
    },
    {
      id: 'commission-structure',
      name: 'Commission Structure',
      description: 'Understanding how commissions are calculated and paid',
      icon: <MessageCircleIcon className="w-5 h-5" />,
      articleCount: 8
    },
    {
      id: 'products-services',
      name: 'Products & Services',
      description: 'Detailed information about all available services',
      icon: <HelpCircleIcon className="w-5 h-5" />,
      articleCount: 15
    },
    {
      id: 'sales-process',
      name: 'Sales Process',
      description: 'Best practices for converting leads to clients',
      icon: <PhoneIcon className="w-5 h-5" />,
      articleCount: 10
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I get started as a partner?',
      answer: 'Getting started is easy! First, complete the onboarding process which includes setting up your profile and completing basic training modules. Once approved, you can immediately start referring clients and earning commissions. We provide all the tools and resources you need to succeed.',
      category: 'getting-started',
      tags: ['onboarding', 'registration', 'setup'],
      helpful: 45,
      views: 234
    },
    {
      id: '2',
      question: 'When do I receive commission payments?',
      answer: 'Commission payments are processed within 30 days of successful client onboarding. You must have a minimum balance of £50 to receive payment. Payments are made via bank transfer to your registered account. For team building, ongoing commissions are paid monthly.',
      category: 'commission-structure',
      tags: ['payments', 'commission', 'schedule'],
      helpful: 38,
      views: 189
    },
    {
      id: '3',
      question: 'What commission rates do you offer?',
      answer: 'Our commission structure is tiered based on performance. Level 1 partners earn upfront commissions on successful deals, Level 2 partners earn 20% ongoing commission from their team\'s success, and Extended network partners earn 10% ongoing commission from their extended network. Commission amounts vary by service type, with payment processing starting at £300 per successful deals.',
      category: 'commission-structure',
      tags: ['rates', 'commission', 'tiers'],
      helpful: 52,
      views: 312
    },
    {
      id: '4',
      question: 'What services can I refer clients for?',
      answer: 'You can refer clients for card payment processing, business funding & merchant cash advances, business insurance, utility supply (gas & electric), and equipment financing. Each service has different commission structures and requirements.',
      category: 'products-services',
      tags: ['services', 'products', 'deals'],
      helpful: 41,
      views: 267
    },
    {
      id: '5',
      question: 'How do I track my deals?',
      answer: 'Use your partner dashboard to track all deals in real-time. You can see the status of each deals, expected commission amounts, and payment history. You\'ll also receive email notifications when deals statuses change.',
      category: 'sales-process',
      tags: ['tracking', 'dashboard', 'status'],
      helpful: 33,
      views: 156
    },
    {
      id: '6',
      question: 'What support is available to partners?',
      answer: 'We provide comprehensive support including dedicated account managers, training resources, marketing materials, and 24/7 technical support. You also have access to our partner community forum and regular webinars.',
      category: 'getting-started',
      tags: ['support', 'training', 'resources'],
      helpful: 29,
      views: 198
    },
    {
      id: '7',
      question: 'Can I refer businesses outside the UK?',
      answer: 'Currently, we only accept deals for UK-based businesses. The business must be registered in the UK and have a UK bank account to qualify for our services. We\'re working on expanding to other markets in the future.',
      category: 'products-services',
      tags: ['eligibility', 'uk-only', 'requirements'],
      helpful: 22,
      views: 143
    },
    {
      id: '8',
      question: 'How long does it take for a deals to convert?',
      answer: 'The conversion process typically takes 2-4 weeks from initial deals to commission payment. This includes quote generation, client approval, documentation, and service setup. Complex cases may take longer.',
      category: 'sales-process',
      tags: ['timeline', 'conversion', 'process'],
      helpful: 36,
      views: 201
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Knowledge Base</h2>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions and get the help you need
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search for answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 py-3 text-lg"
          data-testid="input-search-knowledge"
        />
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? "default" : "outline"}
              onClick={() => setSelectedCategory('all')}
              data-testid="button-category-all"
            >
              All Questions
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
                data-testid={`button-category-${category.id}`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFAQs.map((item) => (
              <Card key={item.id}>
                <Collapsible
                  open={openItems.includes(item.id)}
                  onOpenChange={() => toggleItem(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-left text-lg font-medium">
                          {item.question}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {categories.find(c => c.id === item.category)?.name}
                          </Badge>
                          {openItems.includes(item.id) ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {item.answer}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex gap-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{item.helpful} found helpful</span>
                          <span>{item.views} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircleIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try different search terms or browse by category
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground font-normal">
                        {category.articleCount} articles
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      // Switch to FAQ tab
                    }}
                    data-testid={`button-browse-${category.id}`}
                  >
                    Browse Articles
                    <ExternalLinkIcon className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Need More Help?</h3>
              <p className="text-muted-foreground">
                Can't find what you're looking for? Our support team is here to help
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircleIcon className="w-5 h-5 text-blue-600" />
                    Live Chat Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Get instant help from our support team during business hours
                  </p>
                  <Button className="w-full" data-testid="button-start-chat">
                    Start Live Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MailIcon className="w-5 h-5 text-green-600" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Send us a detailed message and we'll respond within 24 hours
                  </p>
                  <Button variant="outline" className="w-full" data-testid="button-email-support">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-orange-600" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Speak directly with a support representative
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">UK: 0800 123 4567</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday, 9AM - 6PM GMT
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}