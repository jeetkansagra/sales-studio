
import React, { useState, useEffect } from "react";
import CouponCard from "./CouponCard";
import { Button } from "@/components/ui/button";
import { 
  Coupon, 
  CouponClaim,
  getCookieToken, 
  getIpAddress, 
  formatTimeLeft, 
  TIME_RESTRICTION,
  mapDbCouponToAppCoupon,
  getTimeLeftFromTimestamp
} from "@/utils/couponUtils";
import { toast } from "sonner";
import { Gift, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CouponDisplay: React.FC = () => {
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const cookieToken = getCookieToken();

  // Check for existing claims on component mount
  useEffect(() => {
    async function checkExistingClaim() {
      try {
        // Get the most recent claim for this user's cookie token
        const { data: claimData, error: claimError } = await supabase
          .from('claims')
          .select('*, coupons(*)')
          .eq('cookie_token', cookieToken)
          .order('claimed_at', { ascending: false })
          .limit(1);

        if (claimError) throw claimError;

        if (claimData && claimData.length > 0) {
          const claim = claimData[0];
          const coupon = claim.coupons;
          
          // Calculate time left
          const timeRemaining = getTimeLeftFromTimestamp(claim.claimed_at);
          
          if (timeRemaining > 0) {
            // User has an active coupon
            setCurrentCoupon(mapDbCouponToAppCoupon(coupon));
            setTimeLeft(timeRemaining);
          } else {
            // Coupon has expired
            setCurrentCoupon(null);
          }
        }
      } catch (error) {
        console.error("Error checking existing claim:", error);
        toast.error("Failed to check for existing coupons");
      } finally {
        setLoading(false);
      }
    }

    checkExistingClaim();

    // Set up real-time subscription for claims table
    const claimsChannel = supabase
      .channel('public:claims')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'claims',
        filter: `cookie_token=eq.${cookieToken}`
      }, (payload) => {
        console.log('New claim created:', payload);
        // Refresh the coupon data when a new claim is made
        checkExistingClaim();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(claimsChannel);
    };
  }, [cookieToken]);

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

  const handleGetCoupon = async () => {
    try {
      setLoading(true);

      // Check if user already has a valid coupon
      if (timeLeft > 0 && currentCoupon) {
        toast.info("You already have an active coupon");
        return;
      }

      // Get IP address for tracking
      const ipAddress = await getIpAddress();
      
      // Get an available coupon (not claimed yet)
      const { data: availableCoupons, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('claimed', false)
        .limit(1);

      if (couponError) throw couponError;
      
      if (!availableCoupons || availableCoupons.length === 0) {
        // If all coupons are claimed, reset one
        const { data: anyCoupon, error: resetError } = await supabase
          .from('coupons')
          .select('*')
          .limit(1);
          
        if (resetError) throw resetError;
        
        if (anyCoupon && anyCoupon.length > 0) {
          // Reset this coupon to be available again
          const { error: updateError } = await supabase
            .from('coupons')
            .update({ claimed: false })
            .eq('id', anyCoupon[0].id);
            
          if (updateError) throw updateError;
          
          // Use this coupon
          availableCoupons.push(anyCoupon[0]);
        } else {
          toast.error("No coupons available at this time");
          return;
        }
      }
      
      const couponToUse = availableCoupons[0];
      
      // Create a claim record
      const newClaim: CouponClaim = {
        coupon_id: couponToUse.id,
        cookie_token: cookieToken,
        ip_address: ipAddress || undefined
      };
      
      const { error: claimError } = await supabase
        .from('claims')
        .insert(newClaim);
        
      if (claimError) throw claimError;
      
      // Mark coupon as claimed
      const { error: updateError } = await supabase
        .from('coupons')
        .update({ claimed: true })
        .eq('id', couponToUse.id);
        
      if (updateError) throw updateError;
      
      // Update the state
      const appCoupon = mapDbCouponToAppCoupon(couponToUse);
      setCurrentCoupon(appCoupon);
      setTimeLeft(TIME_RESTRICTION);
      setIsNew(true);
      
      toast.success("New coupon claimed successfully!");
      
      // Reset the "new" status after animation
      setTimeout(() => setIsNew(false), 2000);
    } catch (error) {
      console.error("Error claiming coupon:", error);
      toast.error("Failed to claim coupon");
    } finally {
      setLoading(false);
    }
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
