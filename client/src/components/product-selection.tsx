import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  commissionRate: string;
  isActive: boolean;
}

interface ProductSelectionProps {
  onProductsChange: (selectedProductIds: string[]) => void;
  selectedProducts: string[];
}

export default function ProductSelection({ onProductsChange, selectedProducts }: ProductSelectionProps) {
  const products: Product[] = [
    {
      id: "card-machines",
      name: "Card Machines",
      category: "card_machines",
      description: "Payment processing solutions for all business types",
      price: "Competitive rates",
      commissionRate: "£150-£5,000",
      isActive: true
    },
    {
      id: "business-funding",
      name: "Merchant Cash Advance",
      category: "business_funding",
      description: "Fast business funding based on card sales",
      price: "Funding available from £1,000 to £1,000,000",
      commissionRate: "£1,000-£25,000",
      isActive: true
    },
    {
      id: "business-gas-electric",
      name: "Gas & Electric Supply",
      category: "utilities",
      description: "Competitive business energy rates",
      price: "Competitive rates",
      commissionRate: "£50-£200",
      isActive: true
    },
    {
      id: "business-insurance",
      name: "Business Insurance",
      category: "insurance",
      description: "Comprehensive business protection policies",
      price: "Tailored quotes",
      commissionRate: "£100-£500",
      isActive: true
    }
  ];

  const handleProductToggle = (productId: string, checked: boolean) => {
    let updatedProducts;
    if (checked) {
      updatedProducts = [...selectedProducts, productId];
    } else {
      updatedProducts = selectedProducts.filter(id => id !== productId);
    }
    onProductsChange(updatedProducts);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "card_machines":
        return "💳";
      case "business_funding":
        return "💰";
      case "utilities":
        return "⚡";
      case "insurance":
        return "🛡️";
      default:
        return "📦";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "card_machines":
        return "Card Machines";
      case "business_funding":
        return "Business Funding";
      case "utilities":
        return "Utilities";
      case "insurance":
        return "Insurance";
      default:
        return "Other";
    }
  };

  const categorizedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Services to Offer</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose which services you'd like to offer to this business. Multiple selections increase earning potential.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <h4 className="font-semibold text-foreground">{getCategoryName(category)}</h4>
              <Badge variant="outline" className="text-xs">
                {categoryProducts.length} option{categoryProducts.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {categoryProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={product.id}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleProductToggle(product.id, checked as boolean)}
                    data-testid={`checkbox-product-${product.id}`}
                  />
                  <div className="flex-1">
                    <Label htmlFor={product.id} className="cursor-pointer">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {product.description}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-primary font-medium">
                          Price: {product.price}
                        </span>
                        <span className="text-green-600 font-medium">
                          Commission: {product.commissionRate}
                        </span>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {selectedProducts.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Please select at least one service to continue
          </div>
        )}
        
        {selectedProducts.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <h5 className="font-semibold text-foreground mb-2">Selected Services:</h5>
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map(productId => {
                const product = products.find(p => p.id === productId);
                return product ? (
                  <Badge key={productId} variant="default" className="text-xs">
                    {getCategoryIcon(product.category)} {product.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}