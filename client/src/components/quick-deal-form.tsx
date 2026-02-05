import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BusinessNameAutocomplete from "@/components/business-name-autocomplete";
import { Zap } from "lucide-react";

const quickFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Invalid email format").optional(),
  productInterest: z.enum(["dojo-card-payments", "business-funding", "both"], {
    required_error: "Please select a product",
  }),
}).refine(
  (data) => data.contactPhone || data.contactEmail,
  {
    message: "Please provide either a phone number or email",
    path: ["contactPhone"],
  }
);

type QuickFormData = z.infer<typeof quickFormSchema>;

interface QuickDealFormProps {
  onSubmit: (data: QuickFormData) => void;
  isSubmitting: boolean;
}

export default function QuickDealForm({ onSubmit, isSubmitting }: QuickDealFormProps) {
  const form = useForm<QuickFormData>({
    resolver: zodResolver(quickFormSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      productInterest: undefined,
    },
  });

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <CardTitle>Quick Deal</CardTitle>
        </div>
        <CardDescription>
          Capture the essentials. Complete details later.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl>
                    <BusinessNameAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Start typing business name..."
                      data-testid="autocomplete-quick-business-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., John Smith"
                      className="h-11"
                      data-testid="input-quick-contact-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., +44 20 1234 5678"
                      className="h-11"
                      data-testid="input-quick-contact-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="e.g., contact@business.com"
                      className="h-11"
                      data-testid="input-quick-contact-email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground -mt-4">
              * Provide at least one contact method (phone or email)
            </p>

            <FormField
              control={form.control}
              name="productInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Interest *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11" data-testid="select-quick-product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dojo-card-payments" data-testid="option-dojo-card-payments">
                        Dojo Card Payments
                      </SelectItem>
                      <SelectItem value="business-funding" data-testid="option-business-funding">
                        Business Funding
                      </SelectItem>
                      <SelectItem value="both" data-testid="option-both">
                        Both Products
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 space-y-3">
              <Button 
                type="submit" 
                className="w-full h-11" 
                size="lg"
                disabled={isSubmitting}
                data-testid="button-submit-quick-deals"
              >
                {isSubmitting ? "Submitting..." : "Submit Quick Deal"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You can add more details and complete the full information later from your pipeline
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
