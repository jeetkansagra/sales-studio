
import React, { useState, useEffect } from "react";
import CouponCard from "./CouponCard";
import { Button } from "@/components/ui/button";
import { Coupon, getNextCoupon, getUserCoupon, storeCoupon, formatTimeLeft, TIME_RESTRICTION } from "@/utils/couponUtils";
import { toast } from "sonner";
import { Gift, RefreshCw } from "lucide-react";

const CouponDisplay: React.FC = () => {
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Check for existing coupon on component mount
  useEffect(() => {
    const { coupon, timeLeft } = getUserCoupon();
    if (coupon) {
      setCurrentCoupon(coupon);
      setTimeLeft(timeLeft);
    }
  }, []);

  // Update the countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1000;
        if (newTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format the time whenever it changes
  useEffect(() => {
    if (timeLeft > 0) {
      setFormattedTime(formatTimeLeft(timeLeft));
    } else {
      setFormattedTime("");
    }
  }, [timeLeft]);

  const handleGetCoupon = () => {
    // Check if user already has a valid coupon
    const { coupon, timeLeft } = getUserCoupon();
    
    if (coupon) {
      // User has a valid coupon, return it with time left
      setCurrentCoupon(coupon);
      setTimeLeft(timeLeft);
      setIsNew(false);
      toast.info("You already have an active coupon");
      return;
    }

    // Simulate loading
    setLoading(true);
    
    // Simulate network delay for better UX
    setTimeout(() => {
      // Get the next coupon in the round-robin sequence
      const newCoupon = getNextCoupon();
      
      // Store the coupon with current timestamp
      storeCoupon(newCoupon);
      
      // Update the state
      setCurrentCoupon(newCoupon);
      setTimeLeft(TIME_RESTRICTION);
      setIsNew(true);
      setLoading(false);
      
      toast.success("New coupon claimed successfully!");
      
      // Reset the "new" status after animation
      setTimeout(() => setIsNew(false), 2000);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      <div className="space-y-6">
        {currentCoupon ? (
          <div className="space-y-8 animate-fade-in">
            <CouponCard 
              coupon={currentCoupon} 
              isNew={isNew}
              timeLeft={formattedTime} 
            />
            
            <div className="flex justify-center">
              <Button
                disabled={timeLeft > 0 || loading}
                onClick={handleGetCoupon}
                className="transition-all relative overflow-hidden group px-6"
              >
                {timeLeft > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Wait for {formattedTime}
                  </>
                ) : loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Getting coupon...
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Get New Coupon
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 p-6 animate-fade-in">
            <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">No Active Coupon</h3>
              <p className="text-muted-foreground">
                Claim your exclusive coupon code now and save on your purchase.
              </p>
            </div>
            <Button
              onClick={handleGetCoupon}
              disabled={loading}
              size="lg"
              className="transition-all relative overflow-hidden group"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Getting coupon...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Claim Your Coupon
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponDisplay;
