import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Check, DollarSign, CreditCard, Building, Settings } from "lucide-react";

// Device configuration
const DEVICE_PRICING = {
  dojo_go: {
    name: "Dojo Go",
    payOnce: 79,
    payMonthly: 15,
  },
  dojo_pocket: {
    name: "Dojo Pocket",
    payOnce: 239,
    payMonthly: 20,
  },
};

// Quote builder schema
const quoteBuilderSchema = z.object({
  // Rates
  creditCardRate: z.string().min(1, "Required"),
  debitCardRate: z.string().min(1, "Required"),
  corporateCardRate: z.string().min(1, "Required"),
  visaBusinessDebitRate: z.string().default("1.99"),
  otherBusinessDebitRate: z.string().default("1.99"),
  amexRate: z.string().default("1.90"),
  
  // Fees
  secureTransactionFee: z.string().min(1, "Required"), // in pence
  
  // Savings & Buyout
  estimatedMonthlySaving: z.string().min(1, "Required"),
  buyoutAmount: z.string().min(1, "Required"), // 3000 or 500
  
  // Device payment type
  devicePaymentType: z.enum(["pay_once", "pay_monthly"]),
  
  // Optional extras
  hardwareCare: z.boolean().default(false),
  settlementType: z.enum(["5_day", "7_day"]).default("5_day"),
  dojoPlan: z.boolean().default(false),
});

type QuoteBuilderFormData = z.infer<typeof quoteBuilderSchema>;

interface Device {
  type: "dojo_go" | "dojo_pocket";
  name: string;
  quantity: number;
  price: number;
  monthlyPrice: number;
}

interface QuoteBuilderProps {
  dealId: string;
  businessName: string;
  onQuoteCreated: (quoteId: string) => void;
  onCancel: () => void;
  apiEndpoint?: string; // Optional custom endpoint for quote generation
}

export default function QuoteBuilder({ dealId, businessName, onQuoteCreated, onCancel, apiEndpoint }: QuoteBuilderProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [devicePaymentType, setDevicePaymentType] = useState<"pay_once" | "pay_monthly">("pay_monthly");
  
  const form = useForm<QuoteBuilderFormData>({
    resolver: zodResolver(quoteBuilderSchema),
    defaultValues: {
      creditCardRate: "",
      debitCardRate: "",
      corporateCardRate: "",
      visaBusinessDebitRate: "1.99",
      otherBusinessDebitRate: "1.99",
      amexRate: "1.90",
      secureTransactionFee: "5.00",
      estimatedMonthlySaving: "",
      buyoutAmount: "3000",
      devicePaymentType: "pay_monthly",
      hardwareCare: false,
      settlementType: "5_day",
      dojoPlan: false,
    },
  });

  // Add device
  const addDevice = (type: "dojo_go" | "dojo_pocket") => {
    const pricing = DEVICE_PRICING[type];
    const price = devicePaymentType === "pay_once" ? pricing.payOnce : pricing.payMonthly;
    
    const existing = devices.find(d => d.type === type);
    if (existing) {
      setDevices(devices.map(d => 
        d.type === type 
          ? { ...d, quantity: d.quantity + 1, price: price * (d.quantity + 1) }
          : d
      ));
    } else {
      setDevices([...devices, { 
        type, 
        name: pricing.name,
        quantity: 1, 
        price,
        monthlyPrice: pricing.payMonthly
      }]);
    }
  };

  // Remove device
  const removeDevice = (type: "dojo_go" | "dojo_pocket") => {
    const existing = devices.find(d => d.type === type);
    if (existing && existing.quantity > 1) {
      const pricing = DEVICE_PRICING[type];
      const price = devicePaymentType === "pay_once" ? pricing.payOnce : pricing.payMonthly;
      setDevices(devices.map(d => 
        d.type === type 
          ? { ...d, quantity: d.quantity - 1, price: price * (d.quantity - 1) }
          : d
      ));
    } else {
      setDevices(devices.filter(d => d.type !== type));
    }
  };

  // Update device pricing when payment type changes
  useEffect(() => {
    setDevices(devices.map(device => {
      const pricing = DEVICE_PRICING[device.type];
      const unitPrice = devicePaymentType === "pay_once" ? pricing.payOnce : pricing.payMonthly;
      return { 
        ...device, 
        name: pricing.name,
        price: unitPrice * device.quantity,
        monthlyPrice: pricing.payMonthly
      };
    }));
  }, [devicePaymentType]);

  // Calculate totals
  const calculateTotals = () => {
    const deviceTotal = devices.reduce((sum, d) => sum + d.price, 0);
    const hardwareCareTotal = form.watch("hardwareCare") 
      ? devices.reduce((sum, d) => sum + (5 * d.quantity), 0) 
      : 0;
    const settlementFee = form.watch("settlementType") === "7_day" ? 10 : 0;
    const dojoPlanFee = form.watch("dojoPlan") ? 11.99 : 0;
    
    const monthlyTotal = devicePaymentType === "pay_monthly" 
      ? deviceTotal + hardwareCareTotal + settlementFee + dojoPlanFee
      : hardwareCareTotal + settlementFee + dojoPlanFee;
      
    const oneTimeTotal = devicePaymentType === "pay_once" ? deviceTotal : 0;
    
    return { monthlyTotal, oneTimeTotal, deviceTotal };
  };

  const { monthlyTotal, oneTimeTotal } = calculateTotals();

  const onSubmit = async (data: QuoteBuilderFormData) => {
    try {
      const endpoint = apiEndpoint || "/api/admin/quotes/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          ...data,
          devices,
          devicePaymentType,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        onQuoteCreated(result.quoteId);
      }
    } catch (error) {
      console.error("Failed to create quote:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Create Quote</h2>
          <p className="text-gray-600 mt-1">for {businessName}</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
          Draft Quote
        </Badge>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Savings & Buyout */}
        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Savings & Contract Buyout
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="estimatedMonthlySaving">Estimated Monthly Saving (£)</Label>
              <Input
                id="estimatedMonthlySaving"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("estimatedMonthlySaving")}
                className="h-12 text-lg mt-2"
              />
            </div>
            <div>
              <Label htmlFor="buyoutAmount">Contract Buyout</Label>
              <Select
                value={form.watch("buyoutAmount")}
                onValueChange={(value) => form.setValue("buyoutAmount", value)}
              >
                <SelectTrigger className="h-12 text-lg mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3000">£3,000</SelectItem>
                  <SelectItem value="500">£500</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Rates */}
        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Transaction Rates
            </CardTitle>
            <CardDescription>Enter rates as percentages (e.g., 1.49 for 1.49%)</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="creditCardRate">Credit Cards (%)</Label>
              <Input
                id="creditCardRate"
                type="number"
                step="0.01"
                placeholder="1.49"
                {...form.register("creditCardRate")}
                className="h-12 text-lg mt-2"
              />
            </div>
            <div>
              <Label htmlFor="debitCardRate">Debit Cards (%)</Label>
              <Input
                id="debitCardRate"
                type="number"
                step="0.01"
                placeholder="0.75"
                {...form.register("debitCardRate")}
                className="h-12 text-lg mt-2"
              />
            </div>
            <div>
              <Label htmlFor="corporateCardRate">Corporate Cards (%)</Label>
              <Input
                id="corporateCardRate"
                type="number"
                step="0.01"
                placeholder="1.75"
                {...form.register("corporateCardRate")}
                className="h-12 text-lg mt-2"
              />
            </div>
            <div>
              <Label htmlFor="visaBusinessDebitRate">Visa Business Debit (%)</Label>
              <Input
                id="visaBusinessDebitRate"
                type="number"
                step="0.01"
                {...form.register("visaBusinessDebitRate")}
                className="h-12 text-lg mt-2"
              />
            </div>
            <div>
              <Label htmlFor="otherBusinessDebitRate">Other Business Debit (%)</Label>
              <Input
                id="otherBusinessDebitRate"
                type="number"
                step="0.01"
                {...form.register("otherBusinessDebitRate")}
                className="h-12 text-lg mt-2"
              />
            </div>
            <div>
              <Label htmlFor="amexRate">AMEX (%)</Label>
              <Input
                id="amexRate"
                type="number"
                step="0.01"
                {...form.register("amexRate")}
                className="h-12 text-lg mt-2"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">Fixed at 1.90%</p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Fees */}
        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Transaction Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="secureTransactionFee">Secure Transaction Fee (pence)</Label>
                <Select
                  value={form.watch("secureTransactionFee")}
                  onValueChange={(value) => form.setValue("secureTransactionFee", value)}
                >
                  <SelectTrigger className="h-12 text-lg mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(21)].map((_, i) => {
                      const value = (5 - i * 0.25).toFixed(2);
                      if (parseFloat(value) >= 0) {
                        return <SelectItem key={value} value={value}>{value}p</SelectItem>;
                      }
                    })}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">Range: 0.00p - 5.00p (0.01p increments)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Machines/Devices */}
        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-600" />
              Card Machines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Payment Type</Label>
              <Select
                value={devicePaymentType}
                onValueChange={(value: "pay_once" | "pay_monthly") => {
                  setDevicePaymentType(value);
                  form.setValue("devicePaymentType", value);
                }}
              >
                <SelectTrigger className="h-12 text-lg mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pay_once">Pay Once (Upfront)</SelectItem>
                  <SelectItem value="pay_monthly">Pay Monthly (Rental)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Device Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Select Devices</Label>
              
              {/* Dojo Go */}
              <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-blue-400 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{DEVICE_PRICING.dojo_go.name}</p>
                  <p className="text-gray-600">
                    {devicePaymentType === "pay_once" 
                      ? `£${DEVICE_PRICING.dojo_go.payOnce} one-time` 
                      : `£${DEVICE_PRICING.dojo_go.payMonthly}/month`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {devices.find(d => d.type === "dojo_go") && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDevice("dojo_go")}
                        className="h-10 w-10"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {devices.find(d => d.type === "dojo_go")?.quantity || 0}
                      </span>
                    </>
                  )}
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={() => addDevice("dojo_go")}
                    className="h-10 w-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Dojo Pocket */}
              <div className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-blue-400 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{DEVICE_PRICING.dojo_pocket.name}</p>
                  <p className="text-gray-600">
                    {devicePaymentType === "pay_once" 
                      ? `£${DEVICE_PRICING.dojo_pocket.payOnce} one-time` 
                      : `£${DEVICE_PRICING.dojo_pocket.payMonthly}/month`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {devices.find(d => d.type === "dojo_pocket") && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDevice("dojo_pocket")}
                        className="h-10 w-10"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {devices.find(d => d.type === "dojo_pocket")?.quantity || 0}
                      </span>
                    </>
                  )}
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={() => addDevice("dojo_pocket")}
                    className="h-10 w-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optional Extras */}
        <Card className="border-2 rounded-2xl">
          <CardHeader>
            <CardTitle>Optional Extras</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex-1">
                <Label htmlFor="hardwareCare" className="text-base font-semibold cursor-pointer">
                  Hardware Care
                </Label>
                <p className="text-sm text-gray-600">£5 per device per month</p>
              </div>
              <Checkbox
                id="hardwareCare"
                checked={form.watch("hardwareCare")}
                onCheckedChange={(checked) => form.setValue("hardwareCare", checked as boolean)}
                className="h-6 w-6"
              />
            </div>

            <div className="p-4 border rounded-xl">
              <Label htmlFor="settlementType" className="text-base font-semibold">Settlement</Label>
              <Select
                value={form.watch("settlementType")}
                onValueChange={(value: "5_day" | "7_day") => form.setValue("settlementType", value)}
              >
                <SelectTrigger className="h-12 text-lg mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5_day">5 Day Settlement (Free)</SelectItem>
                  <SelectItem value="7_day">7 Day Settlement (£10/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-xl">
              <div className="flex-1">
                <Label htmlFor="dojoPlan" className="text-base font-semibold cursor-pointer">
                  Dojo Plan
                </Label>
                <p className="text-sm text-gray-600">£11.99/month (3 months free trial)</p>
              </div>
              <Checkbox
                id="dojoPlan"
                checked={form.watch("dojoPlan")}
                onCheckedChange={(checked) => form.setValue("dojoPlan", checked as boolean)}
                className="h-6 w-6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card className="border-2 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">Quote Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <p className="text-gray-600">Annual Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  £{(parseFloat(form.watch("estimatedMonthlySaving") || "0") * 12).toLocaleString()}
                </p>
              </div>
              {oneTimeTotal > 0 && (
                <div>
                  <p className="text-gray-600">One-Time Cost</p>
                  <p className="text-3xl font-bold text-blue-600">£{oneTimeTotal.toFixed(2)}</p>
                </div>
              )}
              {monthlyTotal > 0 && (
                <div>
                  <p className="text-gray-600">Monthly Cost</p>
                  <p className="text-3xl font-bold text-blue-600">£{monthlyTotal.toFixed(2)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="h-14 px-8 text-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Check className="w-5 h-5 mr-2" />
            Create & Send Quote
          </Button>
        </div>
      </form>
    </div>
  );
}
