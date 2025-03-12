
// Coupon data type
export interface Coupon {
  id?: string;
  code: string;
  description: string;
  discount: string;
  validUntil?: string;
  claimed?: boolean;
}

// Coupon claim type
export interface CouponClaim {
  id?: string;
  coupon_id: string;
  ip_address?: string;
  cookie_token: string;
  claimed_at?: string;
}

// Available coupon descriptions and discounts map
export const couponDetails: Record<string, { description: string; discount: string }> = {
  "SAVE10": {
    description: "10% off your entire purchase",
    discount: "10%",
  },
  "SAVE20": {
    description: "20% off your entire purchase",
    discount: "20%",
  },
  "FREESHIP": {
    description: "Free shipping on your order",
    discount: "Free Shipping",
  },
  "BOGO50": {
    description: "Buy one, get one 50% off",
    discount: "50% off second item",
  },
  "EXTRA15": {
    description: "Extra 15% off sale items",
    discount: "15% off sale items",
  },
};

// Local storage keys
const LS_COOKIE_TOKEN_KEY = "coupon-cookie-token";
const LS_TIMESTAMP_KEY = "coupon-timestamp";

// Time restriction in milliseconds (1 hour)
export const TIME_RESTRICTION = 60 * 60 * 1000;

// Generate a unique cookie token if one doesn't exist
export const getCookieToken = (): string => {
  let token = localStorage.getItem(LS_COOKIE_TOKEN_KEY);
  
  if (!token) {
    token = Math.random().toString(36).substring(2, 15) + 
            Math.random().toString(36).substring(2, 15);
    localStorage.setItem(LS_COOKIE_TOKEN_KEY, token);
  }
  
  return token;
};

// Get user's IP address (this is a simple approach - in production you might use a service)
export const getIpAddress = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return null;
  }
};

// Format milliseconds to minutes and seconds
export const formatTimeLeft = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Calculate time left until a user can claim another coupon
export const getTimeLeftFromTimestamp = (timestamp: string): number => {
  const claimTime = new Date(timestamp).getTime();
  const currentTime = Date.now();
  const elapsedTime = currentTime - claimTime;
  
  if (elapsedTime >= TIME_RESTRICTION) {
    return 0;
  }
  
  return TIME_RESTRICTION - elapsedTime;
};

// Map database coupon to app coupon format
export const mapDbCouponToAppCoupon = (dbCoupon: any): Coupon => {
  const code = dbCoupon.code;
  const details = couponDetails[code] || { 
    description: "Special offer", 
    discount: "Special discount" 
  };

  return {
    id: dbCoupon.id,
    code: code,
    description: details.description,
    discount: details.discount,
    claimed: dbCoupon.claimed
  };
};

// For dev purposes: reset the cookie token
export const resetCookieToken = (): void => {
  localStorage.removeItem(LS_COOKIE_TOKEN_KEY);
  localStorage.removeItem(LS_TIMESTAMP_KEY);
};
