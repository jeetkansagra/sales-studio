// Coupon data type
export interface Coupon {
  code: string;
  description: string;
  discount: string;
  validUntil?: string;
}

// Available coupons
export const availableCoupons: Coupon[] = [
  {
    code: "SAVE10",
    description: "10% off your entire purchase",
    discount: "10%",
  },
  {
    code: "SAVE20",
    description: "20% off your entire purchase",
    discount: "20%",
  },
  {
    code: "FREESHIP",
    description: "Free shipping on your order",
    discount: "Free Shipping",
  },
  {
    code: "BOGO50",
    description: "Buy one, get one 50% off",
    discount: "50% off second item",
  },
  {
    code: "EXTRA15",
    description: "Extra 15% off sale items",
    discount: "15% off sale items",
  },
];

// Local storage keys
const LS_COUPON_KEY = "user-coupon";
const LS_TIMESTAMP_KEY = "coupon-timestamp";
const LS_LAST_IDX_KEY = "last-coupon-idx";

// Time restriction in milliseconds (1 hour)
export const TIME_RESTRICTION = 60 * 60 * 1000;

// Get the current global index
export const getLastCouponIndex = (): number => {
  const storedIndex = localStorage.getItem(LS_LAST_IDX_KEY);
  return storedIndex ? parseInt(storedIndex, 10) : -1;
};

// Update the global index
export const updateLastCouponIndex = (index: number): void => {
  localStorage.setItem(LS_LAST_IDX_KEY, index.toString());
};

// Get a new coupon in round-robin fashion
export const getNextCoupon = (): Coupon => {
  const lastIndex = getLastCouponIndex();
  const nextIndex = (lastIndex + 1) % availableCoupons.length;
  updateLastCouponIndex(nextIndex);
  return availableCoupons[nextIndex];
};

// Check if the user has a coupon and if it's still valid
export const getUserCoupon = (): { coupon: Coupon | null; timeLeft: number } => {
  const storedCoupon = localStorage.getItem(LS_COUPON_KEY);
  const storedTimestamp = localStorage.getItem(LS_TIMESTAMP_KEY);
  
  // If no coupon or timestamp, return null
  if (!storedCoupon || !storedTimestamp) {
    return { coupon: null, timeLeft: 0 };
  }
  
  const timestamp = parseInt(storedTimestamp, 10);
  const currentTime = Date.now();
  const elapsedTime = currentTime - timestamp;
  
  // If the time restriction has passed, return null
  if (elapsedTime >= TIME_RESTRICTION) {
    return { coupon: null, timeLeft: 0 };
  }
  
  // Otherwise, return the stored coupon and time left
  const timeLeft = TIME_RESTRICTION - elapsedTime;
  return { 
    coupon: JSON.parse(storedCoupon) as Coupon, 
    timeLeft 
  };
};

// Store a coupon for the user
export const storeCoupon = (coupon: Coupon): void => {
  localStorage.setItem(LS_COUPON_KEY, JSON.stringify(coupon));
  localStorage.setItem(LS_TIMESTAMP_KEY, Date.now().toString());
};

// Format milliseconds to minutes and seconds
export const formatTimeLeft = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Clear user's coupon (for testing purposes)
export const clearUserCoupon = (): void => {
  localStorage.removeItem(LS_COUPON_KEY);
  localStorage.removeItem(LS_TIMESTAMP_KEY);
};
