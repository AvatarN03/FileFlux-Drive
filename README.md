# 📁 FileFlux-Drive

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A modern, cloud-powered file management system built for the web**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Usage](#-usage) • [Architecture Guide](docs/project-architecture-and-schema-update-guide.md) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

FileFlux-Drive is a feature-rich file and folder management web application that brings desktop-like file organization to your browser. Built with cutting-edge web technologies, it provides seamless file uploads, intelligent organization, and real-time state management for an exceptional user experience.

For a maintainer-focused explanation of how the app is wired and how to update it safely after schema changes, see [Project Architecture and Schema Update Guide](docs/project-architecture-and-schema-update-guide.md).

## ✨ Features

- **📤 Secure File Uploads** - Upload files and images with Cloudinary's robust cloud storage
- **📂 Smart Organization** - Create folders, move files, and maintain a clean file structure
- **👀 In-Browser Preview** - View files directly without downloading
- **⬇️ Quick Downloads** - Download files with a single click
- **🔄 Real-Time Updates** - Instant UI updates powered by Zustand state management
- **⚡ Lightning Fast** - Built on Next.js for optimal performance and SEO
- **📱 Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **🎨 Intuitive Interface** - Clean, modern UI that's easy to navigate

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 with App Router |
| **State Management** | Zustand |
| **Networking** | Axios |
| **File Storage** | Cloudinary |
| **Database** | Drizzle ORM |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (or your choice) |

## 📦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or above) - [Download here](https://nodejs.org/)
- **npm** / **yarn** / **pnpm** - Package manager
- **Cloudinary Account** - [Sign up for free](https://cloudinary.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AvatarN03/FileFlux-Drive.git
cd FileFlux-Drive
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Database (if applicable)
DATABASE_URL=your_database_url

# Add other environment variables as needed
```

4. **Run database migrations** (if using Drizzle)

```bash
npm run db:push
# or
npx drizzle-kit push:pg
```

5. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**

Navigate to `http://localhost:3000` and start managing your files!

## 📁 Project Structure

```
FileFlux-Drive/
├── app/                 # Next.js app directory (routes & pages)
│   ├── api/            # API routes
│   ├── (routes)/       # Application routes
│   └── layout.tsx      # Root layout
├── components/          # Reusable React components
├── context/            # Zustand state stores
├── db/                 # Database configuration
├── drizzle/            # Drizzle ORM schema & migrations
├── hooks/              # Custom React hooks
├── lib/                # Utility functions & helpers
├── public/             # Static assets
├── types/              # TypeScript type definitions
├── .env.local          # Environment variables (not committed)
├── package.json        # Dependencies & scripts
└── README.md           # You are here!
```

## 💡 Usage

### Uploading Files

1. Click the **Upload** button or drag and drop files into the upload zone
2. Files are automatically uploaded to Cloudinary with progress tracking
3. Uploaded files appear instantly in your current folder

### Managing Folders

- **Create Folder**: Click the "New Folder" button and enter a name
- **Navigate**: Click on any folder to view its contents
- **Move Files**: Select files and use the "Move to" option to relocate them

### File Operations

- **Preview**: Click on any file to view it in the browser
- **Download**: Use the download icon to save files locally
- **Delete**: Select files and click the delete button to remove them

## 🚀 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AvatarN03/FileFlux-Drive)

### Manual Deployment

1. Build the production version:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature suggestion? Please [open an issue](https://github.com/AvatarN03/FileFlux-Drive/issues) with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**AvatarN03**

- GitHub: [@AvatarN03](https://github.com/AvatarN03)
- Project Link: [https://github.com/AvatarN03/FileFlux-Drive](https://github.com/AvatarN03/FileFlux-Drive)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Cloudinary](https://cloudinary.com/) - Cloud Storage & Media Management
- [Zustand](https://github.com/pmndrs/zustand) - State Management
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM

---

<div align="center">

**If you find this project helpful, please consider giving it a ⭐️!**

Made with ❤️ by [AvatarN03](https://github.com/AvatarN03)

</div>