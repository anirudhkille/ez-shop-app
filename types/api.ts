export interface IUser {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface IVariantSize {
  size: string;
  stock: number;
  sku: string;
  price: number;
  discountPrice: number;
}

export interface IVariant {
  _id: string;
  color: string;
  colorCode: string;
  images: string[];
  sizes: IVariantSize[];
}

export interface IProductFacets {
  price: { min: number; max: number };
  sizes: string[];
  colors: { label: string; hex: string }[];
  ratings: number[];
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ICategory | string;
  price: number;
  discountPrice: number;
  image: string;
  variants: IVariant[];
  gender: "men" | "women" | "unisex";
  stock: number;
  isFeatured: boolean;
  isBestSellers: boolean;
  rating: number;
  reviewsCount: number;
  tag: string;
  publish: boolean;
  createdAt: string;
}

export interface ICartProduct {
  _id: string;
  product: IProduct | string;
  variantId?: string;
  size?: string;
  quantity: number;
  priceAtPurchase: number;
  discountPriceAtPurchase?: number;
}

export interface ICart {
  _id: string;
  user: string;
  products: ICartProduct[];
  subtotal: number;
  discountTotal: number;
  total: number;
}

export interface IAddress {
  _id: string;
  user: string;
  label: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

export interface IOrderProduct {
  product: string | IProduct;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  user?: string;
  name?: string;
  email?: string;
  phone?: string;
  products: IOrderProduct[];
  address: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  deliveryMethod: "standard" | "express" | "same-day";
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  paymentType: "cod" | "card";
  paymentIntentId?: string;
  sessionId?: string;
  orderStatus: "processing" | "shipped" | "delivered";
  createdAt: string;
}

export interface IReview {
  _id: string;
  product: string;
  user: string;
  rating: number;
  comment: string;
}

export interface IWishlist {
  _id: string;
  user: string;
  products: string[] | IProduct[];
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
  pagination?: IPagination;
  url?: string;
  orderId?: string;
  redirectUrl?: string;
}

export interface ISignUp {
  name?: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IResetPassword {
  token: string;
  password: string;
}

export interface IUpdateProfile {
  name?: string;
  phone?: string;
}
