import {
  Cloud,
  Folder,
  Download,
  Eye,
  BarChart3,
  Zap,
  Crown,
  Upload,
  ShieldCheck,
  Users,
  HardDrive,
} from "lucide-react";

import { FeatureType } from "./types/ui";

export const navLinks = [
  {
    name:"Home", 
    link:"#home"
  },
  {
    name:"Features", 
    link:"#features"
  },
  {
    name:"Pricing", 
    link:"#pricing"
  },
]

export const features: FeatureType[] = [
  {
    title: "Secure Cloud Storage",
    description:
      "Store your files safely in the cloud with up to 250 MB of personal storage and full control.",
    icon: Cloud,
    class:
      "flex-col-reverse col-span-1 md:col-span-6  bg-peach relative after:content-[''] after:absolute after:right-25   after:top-0    after:w-3  after:h-3   after:rounded-sm  after:bg-peach after:z-20 before:content-[''] before:absolute before:right-0   before:top-13    before:w-4  before:h-4  before:rounded-sm  before:bg-peach before:z-20",
    pos: "bottom-0 right-2",
    cut: "top-0 -right-2 -translate-y-2",
  },
  {
    title: "Organize Files & Folders",
    description:
      "Create folders, upload files, edit details, and delete anything with ease.",
    icon: Folder,
    class: "flex-col col-span-1 md:col-span-5 bg-brown",
    pos: "top-0 right-2",
    cut: "bottom-0 -right-2 translate-y-2",
  },
  {
    title: "View & Download Files",
    description:
      "Instantly preview and download your files anytime without losing quality.",
    icon: Download,
    class: "flex-col col-span-1 md:col-span-5 bg-peach",
    pos: "right-2 top-2",
    cut: "bottom-0 -right-2 translate-y-2",
  },
  {
    title: "Controlled Public Access",
    description:
      "Share files publicly with a toggle—only when you choose to make them accessible.",
    icon: Eye,
    class: "flex-col-reverse col-span-1 md:col-span-6 bg-brown",
    pos: "bottom-2 right-2",
    cut: "top-0 -right-2 -translate-y-2",
  },
  {
    title: "Activity & Storage Analytics",
    description:
      "Track uploads, downloads, edits, and storage usage from a single analysis board.",
    icon: BarChart3,
    class: "flex-col col-span-1 md:col-span-full bg-peach",
    pos: "right-4 bottom-3",
    cut: "top-0 -right-2 -translate-y-2 !w-32 md:!w-64",
  },
];

export const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    duration: "Forever",
    icon: Cloud,
    description: "For personal use and small file storage",
    features: [
      { label: "20 MB Storage", icon: HardDrive },
      { label: "Basic File Upload", icon: Upload },
      { label: "Folder Management", icon: Folder },
      { label: "Standard Security", icon: ShieldCheck },
    ],
    limits: {
      storageMB: 20,
      maxFileSizeMB: 25,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹199",
    duration: "per month",
    icon: Zap,
    highlight: true,
    description: "For developers and power users",
    features: [
      { label: "500 MB Storage", icon: HardDrive },
      { label: "Large File Uploads", icon: Upload },
      { label: "Advanced Folder System", icon: Folder },
      { label: "Enhanced Security", icon: ShieldCheck },
      { label: "Priority Support", icon: Users },
    ],
    limits: {
      storageMB: 500,
      maxFileSizeMB: 500,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    duration: "Contact us",
    icon: Crown,
    description: "For teams and organizations",
    features: [
      { label: "500 MB Storage", icon: HardDrive },
      { label: "Unlimited File Size", icon: Upload },
      { label: "Team Collaboration", icon: Users },
      { label: "Enterprise-grade Security", icon: ShieldCheck },
    ],
    limits: {
      storageMB: 5120,
      maxFileSizeMB: 500,
    },
  },
];


export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  CHECK_AUTH: "/api/auth/protected",
  DELETE_ACCOUNT: "/api/auth/delete",
  CHECK_STORAGE: "/api/files/checkStorage",
  UPLOAD: "/api/files/upload",
} as const;

export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Login successful 🎉",
  LOGIN_FAILED: "Login failed",
  SIGNUP_SUCCESS: "Account created successfully 🎉",
  SIGNUP_FAILED: "Signup failed",
  LOGOUT_SUCCESS: "Logged out successfully 👋",
  LOGOUT_FAILED: "Logout failed",
  SESSION_EXPIRED: "Session expired. Please login again.",
  NETWORK_ERROR: "Network error",
  DELETE_SUCCESS: "Account deleted successfully",
  DELETE_FAILED: "Failed to delete account",
} as const;

export const STORAGE_KEY = "FP-storage";