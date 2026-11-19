import {
  Folder,
  Eye,
  Zap,
  ShieldCheck,
  HardDrive,
  Home,
  FolderTree,
  Star,
  Clock,
  Trash2,
  Link2,
  Settings,
  User,
  Activity,
  FileText,
  FileCode,
  Lock,
  CheckCircle2,
  UploadCloud,
  Share2,
  Layers,
} from "lucide-react";

// Authenticated workspace navigation
export const topSections = [
  { key: "home", icon: Home, label: "Overview", href: "/dashboard" },
  { key: "files", icon: Folder, label: "Files", href: "/files" },
  { key: "folders", icon: FolderTree, label: "Folders", href: "/folders" },
  { key: "recent", icon: Clock, label: "Recent", href: "/recent" },
  { key: "favorites", icon: Star, label: "Favorites", href: "/favorites" },
  { key: "shared", icon: Link2, label: "Shared", href: "/shared" },
  { key: "trash", icon: Trash2, label: "Trash", href: "/trash" },
];

export const bottomSections = [
  { key: "storage", icon: HardDrive, label: "Storage", href: "/storage" },
  { key: "activity", icon: Activity, label: "Activity", href: "/activity" },
  { key: "settings", icon: Settings, label: "Settings", href: "/settings" },
  { key: "profile", icon: User, label: "Profile", href: "/profile" },
];

// Landing page hero content
export const HERO_VAULT_FILES = [
  {
    name: "Financial-Audit-2026.pdf",
    badge: "Encrypted",
    badgeClass: "bg-brand-peach/60 text-brand-violet border-brand-border",
    size: "3.2 MB",
    icon: FileText,
    iconColor: "text-brand-brown",
  },
  {
    name: "Master-Keys.encrypted",
    badge: "Vault Locked",
    badgeClass: "bg-brand-violet text-brand-peach border-brand-peach-vibrant",
    size: "640 KB",
    icon: Lock,
    iconColor: "text-brand-peach-vibrant",
  },
  {
    name: "Brand-Tokens.json",
    badge: "Private",
    badgeClass: "bg-brand-peach-vibrant/20 text-brand-brown-dark border-brand-brown",
    size: "24.8 KB",
    icon: FileCode,
    iconColor: "text-brand-brown",
  },
  {
    name: "Project-Archive.zip",
    badge: "Archived",
    badgeClass: "bg-brand-cream-muted text-brand-violet/80 border-brand-border",
    size: "18.5 MB",
    icon: FileText,
    iconColor: "text-brand-brown",
  },
] as const;

export const HERO_CAPABILITY_CARDS = [
  {
    title: "Personal Encrypted Vault",
    description:
      "Files are encrypted in your browser with your personal vault passphrase — unreadable to our servers and your storage provider.",
    icon: ShieldCheck,
    cardClass:
      "bg-brand-cream border-2 border-brand-brown p-5 shadow-brown-4",
    iconClass:
      "bg-brand-peach/40 border-2 border-brand-brown text-brand-brown shadow-brown-2",
  },
  {
    title: "Instant In-Browser Previews",
    description:
      "Preview images and videos right in the browser, decrypted locally on demand — no download required.",
    icon: CheckCircle2,
    cardClass:
      "bg-brand-cream border-2 border-brand-peach-vibrant p-5 shadow-peach-vibrant-4",
    iconClass:
      "bg-brand-peach-vibrant/20 border-2 border-brand-peach-vibrant text-brand-brown-dark shadow-peach-vibrant-2",
  },
  {
    title: "Private by Default",
    description:
      "Your files stay private to your vault unless you decide otherwise. Public share links with expiring access are on our roadmap.",
    icon: UploadCloud,
    cardClass:
      "bg-brand-cream border-2 border-brand-violet p-5 shadow-violet-4 sm:col-span-2 lg:col-span-1",
    iconClass:
      "bg-brand-violet text-brand-peach border-2 border-brand-violet shadow-violet-2",
  },
] as const;

// Landing page feature content
export const FEATURES_SECTION_CONTENT = {
  eyebrow: "What FileFlux Offers",
  title: "Everything You Need to Manage Your Files",
  description:
    "Built for speed and privacy — here's what FileFlux gives you today, and what's coming next.",
} as const;

export const FEATURE_CARD_BASE_CLASS =
  "bg-brand-cream-muted border-2 flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-none group";

export const FEATURE_BENTO_CARDS = [
  {
    id: "personal-vault",
    delay: 0,
    className:
      "md:col-span-2 lg:col-span-8 border-brand-brown p-6 sm:p-8 shadow-feature-brown",
    icon: ShieldCheck,
    iconContainerClass:
      "w-12 h-12 bg-brand-brown text-brand-cream border-2 border-brand-brown-dark shadow-violet-2",
    iconClass: "w-6 h-6",
    eyebrow: "Core Cryptographic Engine",
    title: "Zero-Knowledge Personal Vault",
    badge: "libsodium + Argon2id",
    badgeClass:
      "text-xs font-mono font-bold px-3 py-1 bg-brand-violet text-brand-peach border border-brand-violet-dark",
    description:
      "Every sensitive document undergoes client-side encryption in your browser before transmission. Your private master passphrase never touches any remote database or server memory.",
    descriptionClass: "text-sm sm:text-base mb-6 max-w-2xl",
    visualization: {
      kind: "encryption",
      label: "// CLIENT ENCRYPTION PIPELINE",
      status: "RUNS ENTIRELY IN YOUR BROWSER",
      steps: [
        {
          title: "1. Plaintext File",
          primary: "master_keys.env",
          secondary: "Raw binary memory",
          className: "bg-brand-violet/80 border-brand-violet-light",
          titleClass: "text-brand-peach/80",
          primaryClass: "font-bold text-brand-cream",
          secondaryClass: "text-brand-cream/60",
        },
        {
          title: "2. Salt & Derivation",
          primary: "Argon2id key derivation",
          secondary: "256-bit entropy",
          className: "bg-brand-brown/40 border-brand-brown flex flex-col justify-between",
          titleClass: "text-brand-peach-vibrant",
          primaryClass: "text-brand-cream",
          secondaryClass: "text-brand-peach",
        },
        {
          title: "3. Encrypted Payload",
          primary: "0x7f9a2e...88bc",
          secondary: "Safe for cloud storage",
          className: "bg-brand-violet/90 border-brand-peach-vibrant/60",
          titleClass: "text-brand-peach-vibrant",
          primaryClass: "text-brand-peach text-[11px]",
          secondaryClass: "text-emerald-400",
        },
      ],
    },
    footer: {
      text: "Encrypted locally — only ciphertext ever leaves your device",
      icon: Lock,
      iconClass: "w-4 h-4 text-brand-brown",
      className: "pt-4 font-semibold text-brand-violet/75",
    },
  },
  {
    id: "storage-overview",
    delay: 0.1,
    className:
      "md:col-span-2 lg:col-span-4 border-brand-violet p-6 sm:p-7 shadow-feature-violet",
    icon: HardDrive,
    iconContainerClass:
      "w-11 h-11 bg-brand-violet text-brand-peach border-2 border-brand-violet-dark shadow-brown-2",
    iconClass: "w-5 h-5",
    eyebrow: null,
    title: "Storage & Quota Overview",
    badge: "AUTO-UPDATED",
    badgeClass:
      "text-[10px] font-mono font-bold px-2 py-0.5 bg-brand-peach text-brand-violet border border-brand-border",
    description:
      "Track storage usage by file type, folder counts, and remaining quota — recalculated as you upload.",
    descriptionClass: "text-sm mb-6",
    visualization: {
      kind: "storage",
      label: "Vault Allocation",
      value: "18.2 MB / 50 MB",
      segments: [
        {
          label: "Docs",
          percent: 50,
          title: "Docs: 12.4 MB",
          barClass: "bg-brand-brown w-[50%]",
          dotClass: "bg-brand-brown",
        },
        {
          label: "Vault",
          percent: 33,
          title: "Vault: 8.1 MB",
          barClass: "bg-brand-violet w-[33%]",
          dotClass: "bg-brand-violet",
        },
        {
          label: "Media",
          percent: 17,
          title: "Media: 4.0 MB",
          barClass: "bg-brand-peach-vibrant w-[17%]",
          dotClass: "bg-brand-peach-vibrant",
        },
      ],
    },
    footer: {
      text: "Recalculated as you upload",
      icon: Zap,
      iconClass: "w-4 h-4 text-brand-brown",
      className: "pt-3 font-bold text-brand-violet",
      pulse: true,
    },
  },
  {
    id: "browser-previews",
    delay: 0.15,
    className:
      "md:col-span-1 lg:col-span-4 border-brand-peach-vibrant p-6 shadow-feature-peach-vibrant",
    icon: Eye,
    iconContainerClass:
      "w-11 h-11 bg-brand-peach-vibrant text-brand-brown-dark border-2 border-brand-brown shadow-violet-2",
    iconClass: "w-5 h-5 text-brand-violet",
    eyebrow: null,
    title: "Instant In-Browser Previews",
    badge: "IN-BROWSER",
    badgeClass:
      "text-[10px] font-bold px-2 py-0.5 bg-brand-peach-vibrant/20 text-brand-brown-dark border border-brand-peach-vibrant",
    description:
      "Preview images and videos right in the browser, decrypted locally on demand — more formats coming.",
    descriptionClass: "text-sm mb-5",
    visualization: {
      kind: "formats",
      items: [
        { format: ".PNG/.JPG", label: "Images", formatClass: "text-brand-brown" },
        { format: ".MP4/.WEBM", label: "Video", formatClass: "text-brand-violet" },
        { format: ".PDF", label: "Coming soon", formatClass: "text-brand-brown-dark" },
      ],
    },
    footer: {
      text: "No download-and-open round trips",
      icon: Zap,
      iconClass: "w-4 h-4 text-brand-peach-vibrant",
      className: "pt-3 font-semibold text-brand-violet/80",
    },
  },
  {
    id: "access-sharing",
    delay: 0.2,
    className:
      "md:col-span-1 lg:col-span-4 border-brand-violet p-6 shadow-feature-brown",
    icon: Share2,
    iconContainerClass:
      "w-11 h-11 bg-brand-violet text-brand-peach border-2 border-brand-violet-dark shadow-peach-vibrant-2",
    iconClass: "w-5 h-5 text-brand-peach",
    eyebrow: null,
    title: "Granular Access & Sharing",
    badge: "COMING SOON",
    badgeClass:
      "text-[10px] font-bold px-2 py-0.5 bg-brand-cream text-brand-violet border border-brand-border",
    description:
      "Every file is private to your vault by default. Expiring public share links are planned for an upcoming release.",
    descriptionClass: "text-sm mb-5",
    visualization: {
      kind: "sharing",
      accessLabel: "Default Access",
      accessValue: "PRIVATE",
      detailIcon: Lock,
      detail: "Only you can decrypt your files",
      roadmapLabel: "Public links: planned",
      policy: "Expiring · Revocable",
    },
    footer: {
      text: "Private until you choose to share",
      icon: Lock,
      iconClass: "w-3.5 h-3.5 text-brand-brown",
      className: "pt-3 font-semibold text-brand-violet/80",
    },
  },
  {
    id: "folder-hierarchy",
    delay: 0.25,
    className:
      "md:col-span-2 lg:col-span-4 border-brand-brown p-6 shadow-feature-peach-vibrant",
    icon: FolderTree,
    iconContainerClass:
      "w-11 h-11 bg-brand-brown text-brand-cream border-2 border-brand-brown-dark shadow-violet-2",
    iconClass: "w-5 h-5 text-brand-peach",
    eyebrow: null,
    title: "Hierarchical Organization",
    badge: "UNLIMITED NESTING",
    badgeClass:
      "text-[10px] font-bold px-2 py-0.5 bg-brand-peach/40 text-brand-brown border border-brand-brown",
    description:
      "Deep folder nesting, instant breadcrumbs, bulk actions, and multi-asset management with zero page reloads.",
    descriptionClass: "text-sm mb-5",
    visualization: {
      kind: "folder-tree",
      rootIcon: FolderTree,
      root: "/personal-vault",
      status: "[LOCKED]",
      children: [
        { label: "tax-returns-2026.pdf", icon: FileText, iconClass: "text-brand-violet" },
        { label: "/credentials", icon: FolderTree, iconClass: "text-brand-peach-vibrant" },
      ],
    },
    footer: {
      text: "Fast client-side indexing",
      icon: Layers,
      iconClass: "w-4 h-4 text-brand-brown",
      className: "pt-3 font-semibold text-brand-violet/80",
    },
  },
] as const;

// File upload form state
export const INITIAL_STATE = {
  file: null,
  fileName: "",
  isEditingFileName: false,
  isDragging: false,
  isUploading: false,
  uploadProgress: 0,
  uploadComplete: false,
};

// Authentication rate limiting
export const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

// Client API endpoints
export const AUTH_API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  CHECK_AUTH: "/api/auth/protected",
  VERIFICATION_MAIL: "/api/auth/resend-verification",
  VERIFY_EMAIL: "/api/auth/verify-email",
  DELETE_ACCOUNT: "/api/auth/delete",
  CHECK_STORAGE: "/api/files/checkStorage",
  UPLOAD: "/api/files/upload",
} as const;

export const FILE_API_ENDPOINTS = {
  GET: "/api/files",
  ITEM: "/api/files/item",
  DELETE: "/api/files/delete",
  UPDATE: "/api/files/update",
  MOVE: "/api/files/move",
  RESTORE: "/api/files/restore",
} as const;

// Authentication toast messages
export const AUTH_TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Login successful 🎉",
  LOGIN_FAILED: "Login failed",
  SIGNUP_SUCCESS: "Account created successfully 🎉",
  FIELDS_INVALID: "Field/s are invalid",
  SIGNUP_FAILED: "Signup failed",
  LOGOUT_SUCCESS: "Logged out successfully 👋",
  LOGOUT_FAILED: "Logout failed",
  SESSION_EXPIRED: "Session expired. Please login again.",
  NETWORK_ERROR: "Network error",
  DELETE_SUCCESS: "Account deleted successfully",
  DELETE_FAILED: "Failed to delete account",
  GOOGLE_LOGIN_FAILED: "Google login failed",
  GOOGLE_LOGIN_SUCCESS: "Google login successful 🎉",
  RESEND_VERIFICATION_SUCCESS: "Verification email sent successfully",
  RESEND_VERIFICATION_FAILED: "Failed to send verification email",
  EMAIL_VERIFICATION_SUCCESS: "Email verified successfully 🎉",
  EMAIL_VERIFICATION_FAILED: "Email verification failed",
} as const;

// File extension labels
export const FileType = {
  pdf: "PDF",
  doc: "Word Document",
  docx: "Word Document",

  xls: "Excel Spreadsheet",
  xlsx: "Excel Spreadsheet",

  ppt: "PowerPoint",
  pptx: "PowerPoint",

  jpg: "JPEG Image",
  jpeg: "JPEG Image",
  png: "PNG Image",
  gif: "GIF Image",
  webp: "WebP Image",
  svg: "SVG Image",

  mp4: "MP4 Video",
  mov: "MOV Video",
  mkv: "MKV Video",

  mp3: "MP3 Audio",
  wav: "WAV Audio",

  zip: "ZIP Archive",
  rar: "RAR Archive",
  "7z": "7-Zip Archive",

  txt: "Text File",
  csv: "CSV File",
  json: "JSON File",

  default: "File",
};

