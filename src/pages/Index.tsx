
import React from "react";
import Header from "@/components/Header";
import CouponDisplay from "@/components/CouponDisplay";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50">
      <Header />
      
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
        
        <section className="py-16 bg-slate-50/80 border-t border-slate-100">
          <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                How It Works
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Our round-robin system ensures fair distribution of coupons while preventing abuse.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 animate-slide-up">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Claim Your Coupon</h3>
                <p className="text-slate-600">
                  Each visitor gets the next available coupon in our rotation sequence.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Use Your Discount</h3>
                <p className="text-slate-600">
                  Apply your coupon code during checkout to receive your exclusive discount.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Come Back Later</h3>
                <p className="text-slate-600">
                  After the time restriction expires, you can claim a new coupon from our rotation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Coupon Guru. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
