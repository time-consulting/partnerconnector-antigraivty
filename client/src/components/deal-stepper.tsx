import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDealSchema } from "@shared/schema";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckCircle, ChevronLeft, ChevronRight, AlertCircle, DollarSign, Building, User, CreditCard, TrendingUp, Upload, FileX, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

// Form schema for the complete stepper
const stepperFormSchema = insertDealSchema
  .omit({
    referrerId: true,
  })
  .extend({
    contactName: z.string().min(1, "Contact name is required"),
    gdprConsent: z.boolean().refine(val => val === true, {
      message: "You must have client permission to proceed",
    }),
    selectedProducts: z.array(z.string()).min(1, {
      message: "Please select at least one service",
    }),
  });

type FormData = z.infer<typeof stepperFormSchema>;

interface DealStepperProps {
  businessTypes: any[];
  onSubmit: (data: FormData, files: File[]) => void;
  isSubmitting: boolean;
}

// Step configuration - 4-stage flow
const steps = [
  { id: 1, title: "Client Info", icon: User },
  { id: 2, title: "Services", icon: CreditCard },
  { id: 3, title: "Documents", icon: Upload },
  { id: 4, title: "Review & Submit", icon: TrendingUp },
];

// Product options
const productOptions = [
  { id: 'card-payments', name: 'Card Payments', icon: '💳', description: 'Accept card payments with competitive rates' },
  { id: 'business-funding', name: 'Business Funding', icon: '💰', description: 'Access flexible funding solutions' },
  { id: 'restaurant-bookings', name: 'Restaurant Bookings', icon: '🍽️', description: 'Online table reservation system' },
  { id: 'epos-systems', name: 'EPOS Systems', icon: '📱', description: 'Point of sale technology' },
];

export default function DealStepper({ businessTypes, onSubmit, isSubmitting }: DealStepperProps) {
  const [location] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showNTCDialog, setShowNTCDialog] = useState(false);
  const [isNTC, setIsNTC] = useState(false);
  const [ntcTerminalOption, setNtcTerminalOption] = useState<'once' | 'monthly'>('once');
  const [ntcHardwareCare, setNtcHardwareCare] = useState(false);
  const [ntcSevenDaySettlement, setNtcSevenDaySettlement] = useState(false);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dealId, setDealId] = useState<string | null>(null);

  // Fetch existing deals? for search
  const { data: existingReferrals = [] } = useQuery<any[]>({
    queryKey: ['/api/deals'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(stepperFormSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      businessEmail: "",
      businessPhone: "",
      businessAddress: "",
      businessTypeId: "",
      currentProcessor: "",
      monthlyVolume: "50000",
      currentRate: "",
      cardMachineQuantity: 1,
      cardMachineProvider: "",
      selectedProducts: [],
      notes: "",
      gdprConsent: false,
    },
    mode: "onChange"
  });

  const selectedProducts = form.watch('selectedProducts') || [];
  const [monthlyVolume, setMonthlyVolume] = useState([50000]);

  // Sync initial monthly volume
  useEffect(() => {
    const currentValue = form.getValues('monthlyVolume');
    if (!currentValue || currentValue === "0") {
      form.setValue('monthlyVolume', "50000");
    }
  }, []);

  // Auto-populate from URL parameters (when coming from opportunities pipeline)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const opportunityId = params.get('opportunityId');
    
    if (opportunityId) {
      // Get all parameters from URL
      const dealIdParam = params.get('dealId');
      const businessName = params.get('businessName');
      const contactFirstName = params.get('contactFirstName');
      const contactLastName = params.get('contactLastName');
      const contactEmail = params.get('contactEmail');
      const contactPhone = params.get('contactPhone');
      const businessType = params.get('businessType');
      const currentMonthlyVolume = params.get('currentMonthlyVolume');
      const productInterest = params.get('productInterest');
      const notes = params.get('notes');
      
      // Store Deal ID
      if (dealIdParam) setDealId(dealIdParam);

      // Populate form fields
      if (businessName) form.setValue('businessName', businessName);
      if (contactFirstName && contactLastName) {
        form.setValue('contactName', `${contactFirstName} ${contactLastName}`.trim());
      }
      if (contactEmail) form.setValue('businessEmail', contactEmail);
      if (contactPhone) form.setValue('businessPhone', contactPhone);
      if (notes) form.setValue('notes', notes);
      
      // Find matching business type
      if (businessType && businessTypes.length > 0) {
        const matchingType = businessTypes.find((bt: any) => 
          bt.type?.toLowerCase() === businessType.toLowerCase()
        );
        if (matchingType) {
          form.setValue('businessTypeId', matchingType.id);
        }
      }

      // Set monthly volume
      if (currentMonthlyVolume) {
        const volumeNum = parseInt(currentMonthlyVolume);
        if (!isNaN(volumeNum)) {
          form.setValue('monthlyVolume', currentMonthlyVolume);
          setMonthlyVolume([volumeNum]);
        }
      }

      // Set product interests
      if (productInterest) {
        try {
          const products = JSON.parse(productInterest);
          if (Array.isArray(products)) {
            // Map product categories to product IDs
            const mappedProducts: string[] = [];
            products.forEach((cat: string) => {
              if (cat.toLowerCase().includes('card')) mappedProducts.push('card-payments');
              if (cat.toLowerCase().includes('fund')) mappedProducts.push('business-funding');
              if (cat.toLowerCase().includes('bank')) mappedProducts.push('open-banking');
              if (cat.toLowerCase().includes('pos') || cat.toLowerCase().includes('epos')) mappedProducts.push('epos-systems');
            });
            if (mappedProducts.length > 0) {
              form.setValue('selectedProducts', mappedProducts);
            }
          }
        } catch (e) {
          console.error('Failed to parse product interests:', e);
        }
      }
    }
  }, [businessTypes]);

  // Filter deals? based on search term
  const filteredReferrals = existingReferrals.filter((ref: any) => {
    if (!searchTerm) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      ref.businessName?.toLowerCase().includes(searchLower) ||
      ref.contactName?.toLowerCase().includes(searchLower) ||
      ref.businessEmail?.toLowerCase().includes(searchLower)
    );
  });

  // Auto-populate form with selected deals? data
  const handleSelectReferral = (deals?: any) => {
    form.setValue('businessName', deals?.businessName || '');
    form.setValue('contactName', deals?.contactName || '');
    form.setValue('businessEmail', deals?.businessEmail || '');
    form.setValue('businessPhone', deals?.businessPhone || '');
    form.setValue('businessAddress', deals?.businessAddress || '');
    form.setValue('businessTypeId', deals?.businessTypeId || '');
    form.setValue('currentProcessor', deals?.currentProcessor || '');
    form.setValue('monthlyVolume', deals?.monthlyVolume || '50000');
    form.setValue('currentRate', deals?.currentRate || '');
    form.setValue('cardMachineQuantity', deals?.cardMachineQuantity || 1);
    form.setValue('cardMachineProvider', deals?.cardMachineProvider || '');
    
    // Update monthly volume slider
    if (deals?.monthlyVolume) {
      setMonthlyVolume([parseInt(deals?.monthlyVolume)]);
    }

    // Close search results
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const validateCurrentStep = async () => {
    const values = form.getValues();
    
    switch (currentStep) {
      case 1:
        return !!(values.businessName && values.contactName && values.businessEmail);
      case 2:
        return !!(values.selectedProducts.length > 0 && values.businessTypeId && values.monthlyVolume);
      case 3:
        return true; // Documents are optional
      case 4:
        return values.gdprConsent;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      form.trigger();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      // Include dealId if it was passed from the opportunity pipeline
      const submissionData = dealId ? { ...data, dealId } : data;
      onSubmit(submissionData as FormData, uploadedFiles);
    }
  };

  const toggleProduct = (productId: string) => {
    const current = form.getValues('selectedProducts') || [];
    if (current.includes(productId)) {
      form.setValue('selectedProducts', current.filter(p => p !== productId));
    } else {
      form.setValue('selectedProducts', [...current, productId]);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Form {...form}>
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for existing client to auto-fill..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              className="pl-12 pr-10 h-14 text-base rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
              data-testid="input-search-deals?"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setShowSearchResults(false);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {showSearchResults && filteredReferrals.length > 0 && (
            <Card className="mt-2 p-2 max-h-64 overflow-y-auto border-2 border-teal-200 rounded-xl shadow-lg">
              {filteredReferrals.map((deals?: any) => (
                <button
                  key={deals?.id}
                  onClick={() => handleSelectReferral(deals)}
                  className="w-full text-left p-3 hover:bg-teal-50 rounded-lg transition-colors"
                  data-testid={`button-select-deals-${deals?.id}`}
                >
                  <div className="font-semibold text-gray-900">{deals?.businessName}</div>
                  <div className="text-sm text-gray-600">{deals?.contactName}</div>
                  <div className="text-sm text-gray-500">{deals?.businessEmail}</div>
                </button>
              ))}
            </Card>
          )}

          {showSearchResults && searchTerm && filteredReferrals.length === 0 && (
            <Card className="mt-2 p-4 border-2 border-gray-200 rounded-xl">
              <p className="text-sm text-gray-500 text-center">No matching clients found</p>
            </Card>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted ? 'bg-teal-600 text-white' :
                      isActive ? 'bg-teal-500 text-white' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-teal-600' : 'text-gray-600'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded ${
                      currentStep > step.id ? 'bg-teal-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Client Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Client Information</h3>
              <p className="text-gray-600">Tell us about your client</p>
            </div>

            {/* Business Name */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <Label htmlFor="businessName" className="text-lg font-semibold text-gray-900 mb-3 block">
                Business Name *
              </Label>
              <Input
                id="businessName"
                {...form.register("businessName")}
                placeholder="e.g., ABC Coffee Shop"
                className="h-14 text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                data-testid="input-business-name"
                autoComplete="off"
              />
              {form.formState.errors.businessName && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {form.formState.errors.businessName.message}
                </p>
              )}
            </div>

            {/* Contact Name */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <Label htmlFor="contactName" className="text-lg font-semibold text-gray-900 mb-3 block">
                Contact Name *
              </Label>
              <Input
                id="contactName"
                {...form.register("contactName")}
                placeholder="e.g., John Smith"
                className="h-14 text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                data-testid="input-contact-name"
                autoComplete="off"
              />
              {form.formState.errors.contactName && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {form.formState.errors.contactName.message}
                </p>
              )}
            </div>

            {/* Email & Phone in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                <Label htmlFor="businessEmail" className="text-base font-medium text-gray-700 mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="businessEmail"
                  type="email"
                  {...form.register("businessEmail")}
                  placeholder="contact@business.com"
                  className="h-14 text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  data-testid="input-business-email"
                  autoComplete="off"
                />
                {form.formState.errors.businessEmail && (
                  <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {form.formState.errors.businessEmail.message}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                <Label htmlFor="businessPhone" className="text-base font-medium text-gray-700 mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  {...form.register("businessPhone")}
                  placeholder="+44 20 1234 5678"
                  className="h-14 text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  data-testid="input-business-phone"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Business Address */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <Label htmlFor="businessAddress" className="text-lg font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                Business Address
              </Label>
              <Textarea
                id="businessAddress"
                {...form.register("businessAddress")}
                placeholder="Enter full business address"
                rows={4}
                className="text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                data-testid="textarea-business-address"
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {/* Step 2: Services */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Services Needed</h3>
              <p className="text-gray-600">What services does the client need?</p>
            </div>

            {/* Product Selection */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <Label className="text-lg font-semibold text-gray-900 mb-4 block">
                Select Services *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productOptions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                      selectedProducts.includes(product.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    data-testid={`product-option-${product.id}`}
                  >
                    {selectedProducts.includes(product.id) && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-teal-600" />
                      </div>
                    )}
                    <div className="text-3xl mb-2">{product.icon}</div>
                    <h5 className="font-semibold text-gray-900 mb-1">{product.name}</h5>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                ))}
              </div>
              {form.formState.errors.selectedProducts && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-3">
                  <AlertCircle className="w-4 h-4" />
                  {form.formState.errors.selectedProducts.message}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <Label className="text-lg font-semibold text-gray-900 mb-3 block">
                Business Type *
              </Label>
              <Select 
                value={form.watch('businessTypeId')} 
                onValueChange={(value) => form.setValue('businessTypeId', value)}
              >
                <SelectTrigger data-testid="select-business-type" className="h-14 text-base rounded-xl border-gray-300">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {(businessTypes || []).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex flex-col py-1">
                        <span className="font-medium text-base">{type.name}</span>
                        <span className="text-sm text-gray-500">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.businessTypeId && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {form.formState.errors.businessTypeId.message}
                </p>
              )}
            </div>

            {/* Monthly Card Volume */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm space-y-4">
              <Label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                Monthly Card Volume
              </Label>
              
              <div className="bg-teal-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Amount</span>
                  <span className="text-2xl font-bold text-teal-600">{formatCurrency(monthlyVolume[0])}</span>
                </div>
                <Slider
                  value={monthlyVolume}
                  onValueChange={(value) => {
                    setMonthlyVolume(value);
                    form.setValue('monthlyVolume', value[0].toString());
                  }}
                  max={500000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>£1K</span>
                  <span>£500K</span>
                </div>
              </div>
              
              <Input
                type="number"
                value={monthlyVolume[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setMonthlyVolume([value]);
                  form.setValue('monthlyVolume', value.toString());
                }}
                placeholder="Or enter amount manually"
                className="h-14 text-base text-center rounded-xl border-gray-300"
                data-testid="input-monthly-volume"
              />
            </div>

            {/* Conditional Card Machine Fields - Only show if Card Payments is selected */}
            {selectedProducts.includes('card-payments') && (
              <>
                {/* Number of Card Machines */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                  <Label htmlFor="cardMachineQuantity" className="text-lg font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-600" />
                    Number of Card Machines
                  </Label>
                  <Input
                    id="cardMachineQuantity"
                    type="number"
                    min="1"
                    {...form.register("cardMachineQuantity", { valueAsNumber: true })}
                    placeholder="Enter number of card machines needed"
                    className="h-14 text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    data-testid="input-card-machine-quantity"
                    autoComplete="off"
                  />
                </div>

                {/* Current Card Machine Provider */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
                  <Label htmlFor="cardMachineProvider" className="text-lg font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                    <Building className="w-5 h-5 text-teal-600" />
                    Current Card Machine Provider <span className="text-sm font-normal text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="cardMachineProvider"
                    {...form.register("cardMachineProvider")}
                    placeholder="Enter current card machine provider (e.g., Worldpay, Barclaycard)"
                    className="h-14 text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    data-testid="input-card-machine-provider"
                    autoComplete="off"
                  />
                </div>
              </>
            )}

            {/* Optional Notes */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
              <Label htmlFor="notes" className="text-lg font-semibold text-gray-900 mb-3 block">
                Additional Notes <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                placeholder="Any additional information about the client or opportunity..."
                rows={3}
                className="text-base rounded-xl border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                data-testid="textarea-notes"
                autoComplete="off"
              />
            </div>
          </div>
        )}

        {/* Step 3: Documents Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Documents</h3>
              <p className="text-gray-600">Help us create the best quote by uploading current payment statements</p>
            </div>

            {/* Document Upload Section */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Current Payment Processing Bills
                  <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Upload your current payment processing statements to help us create a more accurate competitive quote. 
                  This helps ensure better savings for your client.
                </p>
              </div>

              {/* Drag and Drop Area */}
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const newFiles = Array.from(e.dataTransfer.files);
                    setUploadedFiles(prev => [...prev, ...newFiles]);
                  }
                }}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-base font-medium text-gray-900">
                      Drag and drop files here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, JPEG, PNG (Max 10MB each)
                    </p>
                  </div>

                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        setUploadedFiles(prev => [...prev, ...newFiles]);
                      }
                    }}
                    className="hidden"
                    id="document-upload-stepper"
                    data-testid="input-document-file"
                  />
                  
                  <Button
                    type="button"
                    onClick={() => document.getElementById('document-upload-stepper')?.click()}
                    variant="outline"
                    className="mt-2"
                    data-testid="button-select-files"
                  >
                    Select Files
                  </Button>
                </div>
              </div>

              {/* Upload Counter and Files List */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <CheckCircle className="h-4 w-4" />
                  Upload Bills ({uploadedFiles.length})
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-green-700">Ready to upload</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                          className="ml-2"
                          data-testid={`button-remove-file-${index}`}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Why Upload Bills Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Why upload bills?</h4>
                <p className="text-sm text-gray-600 mb-2">Your current payment processing statements help us:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Calculate exact savings potential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Create more competitive quotes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Identify hidden fees in current setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>Ensure accurate commission calculations</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons - Branded Colors */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                type="button"
                onClick={() => setShowNTCDialog(true)}
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg"
                data-testid="button-mark-ntc"
              >
                <FileX className="h-5 w-5 mr-2" />
                Mark as NTC
              </Button>
              
              <Button
                type="button"
                onClick={handleNext}
                variant="outline"
                className="flex-1 h-14 border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold text-lg"
                data-testid="button-skip-upload"
              >
                Skip Upload
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Review Your Quote Request</h3>
              <p className="text-gray-600">Please review all details before submitting</p>
            </div>

            {/* Beautiful Summary Cards */}
            <div className="grid gap-6">
              {/* Business Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  Business Information
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Business Name</p>
                    <p className="font-semibold text-gray-900">{form.watch('businessName') || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contact Name</p>
                    <p className="font-semibold text-gray-900">{form.watch('contactName') || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{form.watch('businessEmail') || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{form.watch('businessPhone') || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Services & Volume Card */}
              <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl p-6 border-2 border-teal-100 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-teal-600" />
                  Services & Processing
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Services Required</p>
                    <p className="font-semibold text-gray-900">
                      {selectedProducts.length > 0 ? selectedProducts.join(', ') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Volume</p>
                    <p className="font-semibold text-teal-600 text-lg">
                      {formatCurrency(parseInt(form.watch('monthlyVolume') || '0'))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Processor</p>
                    <p className="font-semibold text-gray-900">{form.watch('currentProcessor') || '-'}</p>
                  </div>
                  {selectedProducts.includes('card-payments') && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Card Machines</p>
                        <p className="font-semibold text-gray-900">{form.watch('cardMachineQuantity') || '-'}</p>
                      </div>
                      {form.watch('cardMachineProvider') && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Card Machine Provider</p>
                          <p className="font-semibold text-gray-900">{form.watch('cardMachineProvider')}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Documents & NTC Status */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-600" />
                  Documents & Pricing
                </h4>
                {isNTC ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-700 bg-blue-100 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">NTC (New to Card) Pricing Selected</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Terminal: {ntcTerminalOption === 'once' ? '£79 (one-time)' : '£15/month'}</p>
                      {ntcHardwareCare && <p>✓ Hardware Care included</p>}
                      {ntcSevenDaySettlement && <p>✓ 7-day settlement upgrade</p>}
                    </div>
                  </div>
                ) : uploadedFiles.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">{uploadedFiles.length} document{uploadedFiles.length > 1 ? 's' : ''} uploaded</span>
                    </div>
                    {uploadedFiles.map((file, idx) => (
                      <p key={idx} className="text-sm text-gray-600 ml-4">• {file.name}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No documents uploaded</p>
                )}
              </div>
            </div>

            {/* GDPR Consent */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
              <FormField
                control={form.control}
                name="gdprConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 h-6 w-6"
                        data-testid="checkbox-gdpr-consent"
                      />
                    </FormControl>
                    <div className="space-y-2 leading-none flex-1">
                      <FormLabel className="text-base font-semibold text-gray-900 cursor-pointer">
                        I have client permission to share their details *
                      </FormLabel>
                      <p className="text-sm text-gray-600">
                        By checking this box, you confirm that you have the client's explicit consent 
                        to share their business information for the purpose of obtaining competitive quotes.
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Ready Banner */}
            <div className="bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl p-8 text-white text-center shadow-xl">
              <div className="text-5xl mb-4">🎯</div>
              <h4 className="text-2xl font-bold mb-3">Ready to Submit!</h4>
              <p className="text-teal-50 text-lg">
                Your quote request will be reviewed within 24 hours and you'll receive a competitive offer.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="h-12 px-6 rounded-xl"
            data-testid="button-previous"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
              data-testid="button-next"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !form.watch('gdprConsent')}
              className="h-12 px-8 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white rounded-xl"
              data-testid="button-submit"
            >
              {isSubmitting ? "Submitting..." : "Submit Deal"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* NTC Pricing Dialog */}
      <Dialog open={showNTCDialog} onOpenChange={setShowNTCDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              NTC (New to Card) Pricing
            </DialogTitle>
            <DialogDescription>
              For businesses without current processing statements, we offer our NTC pricing structure.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Terminal Options */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Terminal Payment Options:</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="terminal-option"
                      value="once"
                      checked={ntcTerminalOption === 'once'}
                      onChange={() => setNtcTerminalOption('once')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Pay Once - £79</p>
                      <p className="text-sm text-gray-600">One-time payment</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="terminal-option"
                      value="monthly"
                      checked={ntcTerminalOption === 'monthly'}
                      onChange={() => setNtcTerminalOption('monthly')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Monthly - £15/month</p>
                      <p className="text-sm text-gray-600">Spread the cost</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Rates Package */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3">Rates Package - £39</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Includes Dojo plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Covers up to £4,000 monthly processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>1% surcharge on amounts over £4k</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Optional Add-ons */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Optional Add-ons:</h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={ntcHardwareCare}
                      onCheckedChange={(checked) => setNtcHardwareCare(checked as boolean)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Hardware Care</p>
                      <p className="text-sm text-gray-600">Extended warranty and support</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={ntcSevenDaySettlement}
                      onCheckedChange={(checked) => setNtcSevenDaySettlement(checked as boolean)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">7-Day Settlement Upgrade</p>
                      <p className="text-sm text-gray-600">Faster access to your funds</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Commission Info */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Your Commission</p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Total:</strong> £280 | <strong>Your Share (60%):</strong> £168
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Without processing statements, we cannot calculate exact savings. 
                  NTC pricing is a flat-rate option for new businesses.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNTCDialog(false)}
              data-testid="button-ntc-cancel"
            >
              Back to Upload
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsNTC(true);
                setShowNTCDialog(false);
                handleNext(); // Move to review step
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              data-testid="button-ntc-confirm"
            >
              Confirm NTC Pricing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
