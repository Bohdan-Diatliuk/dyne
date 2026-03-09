# DYNE

Dyne — is a modern social platform built with Next.js that brings people together through real-time global communication. Users can discover others, build their network through a follow system, and engage in an interactive global chat — all powered by a scalable full-stack architecture.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript

### Backend & Database

- Next.js API Routes
- Supabase (PostgreSQL, Auth, Realtime)

### Internationalization

- next-intl

### UI & Styling

- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide Icons
- Sonner 
- tsParticles

## Features

- **Realtime global chat** - users can send and receive messages instantly.
- **User authentication** - secure sign-up and login powered by Supabase.
- **Multi-language support** - switch between languages using next-intl.
- **Interactive particles background** - animated, interactive UI elements with tsParticles.
- **Responsive design** - works on desktop and mobile devices.

## Architecture

The project follows a modular structure using Next.js App Router, organized to separate concerns and make the codebase scalable and maintable.

### Project Structure

```
app/[locale]        # Pages and layouts, locale-specifix routing
components/         # Reusable UI components (shadcn/ui, Radix, Tailwind)
hooks/              # Custom React hooks for state and logic 
i18n/               # Internationalization setup (next-intl)
lib/                # Supabase client and utility functions
messages/           # Localization message files
public/             # Static assets (icon)
types/              # TypeScript types
next.config.ts      # Next.js configuration
proxy.ts            # API proxy / middleware
```

## Instalation 

Clone the repository:

```
git clone https://github.com/Bohdan-Diatliuk/dyne.git
cd dyne
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

## Live Demo

You can open website here - [DYNE](https://dyne-gold.vercel.app/)