
import React from "react";
import { Coupon } from "@/utils/couponUtils";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CouponCardProps {
  coupon: Coupon;
  isNew?: boolean;
  timeLeft?: string;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, isNew = false, timeLeft }) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success("Coupon code copied to clipboard!");
  };

  return (
    <Card className={`max-w-md w-full mx-auto overflow-hidden transition-all duration-500 ${isNew ? "animate-pulse-once" : ""}`}>
      <div className="h-2 bg-primary w-full"></div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full inline-block mb-2">
              {coupon.discount}
            </div>
            <CardTitle className="text-2xl font-medium">{coupon.code}</CardTitle>
          </div>
          {isNew && (
            <div className="bg-primary/10 text-primary font-medium text-xs px-2 py-1 rounded-full">
              New Coupon
            </div>
          )}
        </div>
        <CardDescription className="mt-2">{coupon.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-secondary p-4 rounded-md flex items-center justify-between">
          <code className="font-mono font-bold text-lg">{coupon.code}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="h-9 w-9 p-0"
            aria-label="Copy code"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        {timeLeft && (
          <p className="text-sm text-muted-foreground w-full text-center">
            New coupon available in {timeLeft}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default CouponCard;
