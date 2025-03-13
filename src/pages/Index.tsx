

import CouponDisplay from "@/components/CouponDisplay";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50">
     
      
      <main className="flex-1 flex flex-col">
        <section className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto animate-fade-in">
              <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                Exclusive Offers
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Round-Robin Coupon System
              </h1>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
                Our system fairly distributes coupons to all users. Claim yours now and enjoy exclusive savings on your next purchase.
              </p>
            </div>
            
            <div className="flex justify-center">
              <CouponDisplay />
            </div>
          </div>
        </section>
        
        
      </main>
      
      
    </div>
  );
};

export default Index;
