# GearGuard Pro - Smart Maintenance Management System

## Overview

GearGuard Pro is a comprehensive maintenance management platform designed to help organizations track equipment, automate workflows, and eliminate downtime. Built with modern web technologies for optimal performance and user experience.

## Features

- **Equipment Tracking**: Monitor all your equipment in one centralized dashboard
- **Maintenance Scheduling**: Automated maintenance reminders and workflows
- **Team Management**: Role-based access control for different team members
- **Real-time Analytics**: Track maintenance metrics and equipment performance
- **Calendar Integration**: Visual maintenance scheduling and planning
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

This project is built with:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Context API & TanStack Query
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd gearguard-pro

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── config/         # Configuration files
└── lib/            # Utility functions
```

## Deployment

Build the project for production:

```sh
npm run build
```

The optimized files will be in the `dist` directory, ready to be deployed to any static hosting service.

## License

This project is private and proprietary.
