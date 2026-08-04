# NexusBoard

> A real-time, multi-tenant collaborative whiteboard and visual workspace powered by Next.js 16, Liveblocks CRDTs, Convex, and AI-assisted diagramming.

[![GitHub stars](https://img.shields.io/github/stars/your-username/nexusboard?style=for-the-badge&logo=github)](https://github.com/your-username/nexusboard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Database-Convex-FF4F00?style=for-the-badge)](https://convex.dev/)
[![Liveblocks](https://img.shields.io/badge/Realtime-Liveblocks-4F46E5?style=for-the-badge)](https://liveblocks.io/)

---

## 2. Project Overview

**NexusBoard** is an enterprise-grade, real-time collaborative digital whiteboard designed for distributed engineering teams, UI/UX designers, product managers, and agile organizations. 

Traditional collaboration tools often suffer from state desynchronization, high-latency cursor tracking, complex permissions, or lack smart diagramming automation. **NexusBoard** addresses these challenges by uniting high-frequency multiplayer updates via Conflict-free Replicated Data Types (CRDTs), cloud-backed serverless persistence, organization-level multi-tenancy, and AI-driven canvas automation into a cohesive workspace.

### Key Value Propositions
* **Zero-Latency Multiplayer Canvas**: Real-time cursor movement, layer transformations, and freehand drawing synchronized instantly across all connected clients.
* **AI-Assisted Workflow**: Generate system architecture diagrams, summarize board sticky notes, and perform dynamic clustering powered by built-in AI models.
* **Organization Multi-Tenancy**: Team-isolated workspaces with role-based access control, favorite boards, search indexing, and organization management.
* **Rich Visual & Productivity Tools**: Smart object connectors, custom color pickers, spatial commenting, emoji reactions, version history snapshots, grid customizers, and high-res vector/PDF exports.

---

## 3. Features

### 🎨 Infinite Canvas & Drawing Tools
* **Multi-Shape Support**: Rectangles, Ellipses, Rhombuses, Triangles, Stars, Hexagons, Speech Bubbles, Arrows, Lines, and Custom Paths.
* **Freehand Drawing Engine**: Dynamic vector brush strokes with pressure sensitivity using `perfect-freehand`.
* **Smart Connectors**: Dynamic lines and arrows with anchor snapping for flowchart and architecture diagram generation.
* **Text & Typography**: Rich rich text editing, inline styling, font family choices, text alignment, and dynamic scaling.
* **Image Layers**: Upload and render high-resolution image objects directly onto the canvas with layer transformation controls.
* **Layer Alignment Toolbar**: Multi-element alignment (left, center, right, top, middle, bottom) and distribution options.
* **Grid Modes**: Switch between Dot Grid, Line Grid, Isometric Grid, or Clear Background for precision snapping.

### 👥 Real-Time Multiplayer Collaboration
* **Live Cursor & Presence Sync**: Low-latency rendering of peer cursors with custom usernames and avatars.
* **Selection Highlighting**: Distinct multi-user selection bounding boxes preventing edit collisions.
* **Spatial Comments**: Drop pinned comment threads anywhere on the infinite canvas with nested responses.
* **Emoji Reactions**: Express live visual feedback with animated canvas emoji streams.
* **Voice Rooms**: Integrated spatial audio context indicator for active room participants.
* **Mini-Map Navigation**: Live canvas radar view for effortless panning across expansive diagrams.

### 🤖 AI Canvas Intelligence
* **AI Diagram Generator**: Create full system architecture diagrams, mind maps, and flowcharts from plain-text prompts.
* **Board Summarizer**: Extract actionable insights, tasks, and executive summaries from sticky notes on the canvas.
* **Sticky Note Clustering**: Auto-categorize and cluster scattered sticky notes based on semantic topic analysis.

### 💼 Organization & Dashboard Management
* **Multi-Tenant Workspaces**: Seamless switching between personal and team organizations via Clerk.
* **Favorites & Bookmarks**: Star frequently used boards for instant access in dedicated dashboard views.
* **Global Search & Filtering**: Real-time title search and organization-wide board filtering with Convex search indexing.
* **Board CRUD Operations**: Create, rename, duplicate, favorite, and trash boards with toast notification confirmations.
* **Pre-Built Templates Modal**: Launch new boards quickly using software design, wireframing, retro, and brainstorming templates.

### 📤 Export & Import Capabilities
* **PNG / JPEG Export**: High-DPI canvas rasterization with support for transparent or solid backgrounds using `html-to-image`.
* **SVG Vector Export**: Crisp vector graphics export for documentation and presentation slides.
* **PDF Document Export**: Single-click multi-page or single-canvas PDF document rendering via `jspdf`.

---

## 4. Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server-side rendering, React Server Components, API routes, routing |
| **UI Library** | React 19 | Declarative user interface components and hooks |
| **Language** | TypeScript 5 | Strict static typing, interfaces, and autocomplete |
| **Styling** | Tailwind CSS v4 | Utility-first CSS styling and modern design system tokens |
| **UI Components** | Radix UI / Shadcn UI | Unstyled, accessible UI primitive components |
| **Realtime Engine** | Liveblocks | CRDT multi-user state synchronization, presence, and WebSocket room management |
| **Database & Backend** | Convex | Reactive serverless database, real-time queries, index searching, and mutations |
| **Authentication** | Clerk | Multi-tenant auth, user sessions, organization management, and security middleware |
| **State Management** | Zustand | Client-side application modal states and global UI context |
| **Freehand Engine** | Perfect Freehand | Smooth variable-width vector path calculation from pressure points |
| **Export Engines** | jsPDF & html-to-image | Canvas rasterization and document generation for exports |
| **Icons & Design** | Lucide React | Clean, responsive vector icon library |
| **Notifications** | Sonner | Modern, customizable toast notifications |

---

## 5. Architecture

The application employs a dual-layered backend architecture separating real-time high-frequency multiplayer state from transactional persistent storage.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             Client Browser                              │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                 React 19 / Next.js 16 UI Layer                  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│           │                                           │                 │
│  HTTP / Server Actions                     WebSocket / CRDT Sync        │
│           │                                           │                 │
└───────────┼───────────────────────────────────────────┼─────────────────┘
            ▼                                           ▼
┌───────────────────────────┐               ┌───────────────────────────┐
│     Convex Serverless     │               │   Liveblocks Cloud Engine │
│    Database & Functions   │               │     (WebSocket Server)    │
├───────────────────────────┤               ├───────────────────────────┤
│ • Board Meta Storage      │               │ • Layers (LiveMap)        │
│ • User Favorites Index    │               │ • Layer Order (LiveList)  │
│ • Title Search Indexes    │               │ • User Presence & Cursors │
│ • Org Access Rules        │               │ • Spatial Comments/Events │
└───────────────────────────┘               └───────────────────────────┘
            ▲                                           ▲
            │                                           │
            └─────────────── Clerk Auth ────────────────┘
                      (JWT & Identity Token Verification)
```

### Request Flow
1. **Authentication**: User authenticates via Clerk. Clerk issues a secure JWT token containing user identity and Organization ID (`orgId`).
2. **Dashboard Query**: Client requests board metadata and favorites from Convex via reactive WebSocket queries (`convex/boards.ts`). Convex validates the token and returns indexed records.
3. **Board Join**: Navigating to `/board/[boardId]` initializes a Liveblocks WebSocket room session after server authentication via `/api/liveblocks-auth`.
4. **Canvas Manipulation**: Tool actions (e.g. moving a rectangle or drawing a path) modify Liveblocks CRDT structures (`LiveMap` and `LiveList`). Changes broadcast at 60 FPS across all connected room clients.
5. **Persistence**: Board title and organization membership changes persist back to Convex asynchronously.

---

## 6. Folder Structure

```
nexusboard/
├── app/                        # Next.js 16 App Router hierarchy
│   ├── (dashboard)/            # Dashboard route group (Org management & Board lists)
│   │   ├── _components/        # Dashboard sidebars, board cards, search inputs, and views
│   │   ├── layout.tsx          # Dashboard layout wrapper with sidebar and navbar
│   │   └── page.tsx            # Main dashboard home page
│   ├── api/                    # Server API endpoints
│   │   └── liveblocks-auth/    # Next.js route handler for Liveblocks token auth
│   ├── board/                  # Infinite Canvas workspace routes
│   │   └── [boardId]/          # Dynamic board workspace route
│   ├── globals.css             # Tailwind v4 globals, color variables, and canvas styles
│   └── layout.tsx              # Root application layout with providers
├── components/                 # Reusable UI & canvas component modules
│   ├── ai/                     # AI diagram generation, sticky clustering, board summarizer
│   ├── auth/                   # Loading indicators and auth wrappers
│   ├── canvas/                 # Canvas toolbars, color pickers, shapes, connectors, typography
│   ├── collaboration/          # Minimap, live cursors, spatial comments, voice rooms, reactions
│   ├── modals/                 # Rename board, pro subscription, and confirm dialogs
│   ├── productivity/           # Export modal, template modal, version history, grid settings
│   └── ui/                     # Shadcn / Radix primitives (button, dialog, dropdown, input, etc.)
├── convex/                     # Convex reactive database functions & schemas
│   ├── auth.config.js          # Convex Clerk authentication issuer configuration
│   ├── board.ts                # Individual board CRUD mutations and queries
│   ├── boards.ts               # Organization-level board query handlers & search index
│   └── schema.ts               # Database table schemas and index definitions
├── hooks/                      # Custom React hooks (api hooks, selection, window dimensions)
├── lib/                        # Utility functions, canvas coordinate matrix math, color algorithms
├── liveblocks.config.ts        # Liveblocks client configuration, room types, presence interfaces
├── providers/                  # ConvexClientProvider, LiveblocksProvider, ThemeProvider
├── store/                      # Zustand state slices (e.g., useRenameModal, useProModal)
└── types/                      # TypeScript declarations for canvas layers, shapes, tools, and presence
```

---

## 7. Installation

### Prerequisites
* **Node.js**: v18.17.0 or higher
* **npm**: v9.0.0 or higher
* **Git**: Installed on your local machine

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/nexusboard.git
   cd nexusboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory by copying the configuration requirements described in [Environment Variables](#8-environment-variables).

4. **Initialize Convex Backend**
   ```bash
   npx convex dev
   ```
   *Follow the terminal prompts to log in to Convex and select/create your project.*

---

## 8. Environment Variables

Create a `.env.local` file in the root of your project with the following required variables:

| Variable | Description | Exposure Level |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CONVEX_URL` | Deployment URL for Convex WebSocket client connection | Public (Client) |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Convex site URL for HTTP endpoints | Public (Client) |
| `CONVEX_DEPLOYMENT` | Deployment identifier target for `npx convex dev` | Development / CLI |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend authentication | Public (Client) |
| `CLERK_SECRET_KEY` | Clerk secret key for server-side auth verification | Private (Server Only) |
| `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` | Liveblocks public API key | Public (Client) |
| `LIVEBLOCKS_SECRET_KEY` | Liveblocks secret key for server token signing in `/api/liveblocks-auth` | Private (Server Only) |
| `NEXT_PUBLIC_APP_URL` | Public app base URL (e.g. `http://localhost:3000` or production domain) | Public (Client) |

> [!WARNING]
> Never commit actual secret keys (`CLERK_SECRET_KEY`, `LIVEBLOCKS_SECRET_KEY`) to public source control repositories.

---

## 9. Running Locally

To run NexusBoard locally, run the development script which launches both Next.js and Convex sync:

1. **Start Convex Development Backend** (in terminal 1):
   ```bash
   npx convex dev
   ```

2. **Start Next.js Development Server** (in terminal 2):
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 10. Build for Production

To create an optimized production build:

1. **Compile Static & Dynamic Bundles**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Lint Check** (Optional verification step)
   ```bash
   npm run lint
   ```

---

## 11. Screenshots

### Dashboard Overview
*(Add screenshot: Dashboard showing organization boards, search bar, favorites filter, and create board button)*

### Canvas Workspace
*(Add screenshot: Live infinite canvas with shapes, smart connectors, typography, toolbar, and multiplayer cursors)*

### AI Diagram Generator
*(Add screenshot: AI prompt modal generating architecture flowcharts directly onto the canvas)*

### Spatial Collaboration & Comments
*(Add screenshot: Multi-user real-time spatial comment pins and live reaction streams)*

### Export Settings Modal
*(Add screenshot: Export configuration dialog supporting PNG, SVG, and high-DPI PDF generation)*

---

## 12. API Overview

NexusBoard utilizes Next.js Route Handlers alongside Convex Reactive Mutations/Queries.

### Route Handlers

#### `POST /api/liveblocks-auth`
* **Purpose**: Authenticates active Clerk users and issues Liveblocks room tokens with user identity claims.
* **Authentication**: Required (Clerk Session).
* **Payload**: `{ room: string }`
* **Response**: `200 OK` with session token object or `403 Forbidden`.

---

### Convex Queries & Mutations

| API Function | Type | Purpose | Auth Required |
| :--- | :--- | :--- | :--- |
| `board:create` | Mutation | Creates a new board under the current user's active Organization ID | Yes |
| `board:remove` | Mutation | Deletes a board and cleans up associated user favorite records | Yes (Author/Org) |
| `board:update` | Mutation | Renames an existing board title | Yes |
| `board:favorite` | Mutation | Adds a board to the user's personal favorites list | Yes |
| `board:unfavorite` | Mutation | Removes a board from the user's personal favorites list | Yes |
| `board:get` | Query | Fetches single board metadata by ID | Yes |
| `boards:get` | Query | Returns indexed board lists matching search queries & favorite filters | Yes |

---

## 13. Database Schema Overview

### Convex Database Schema (`convex/schema.ts`)

#### `boards` Table
Stores high-level board metadata attached to organizations.
* **`title`** (`v.string()`): Human-readable board title.
* **`orgId`** (`v.string()`): Clerk Organization ID string for multi-tenant isolation.
* **`authorId`** (`v.string()`): Clerk User ID of board creator.
* **`authorName`** (`v.string()`): Display name of creator.
* **`imageUrl`** (`v.string()`): Auto-generated placeholder/preview image URL.
* **Indexes**:
  * `by_org`: `["orgId"]`
  * `search_title`: `searchField: "title"`, `filterFields: ["orgId"]`

#### `userFavorites` Table
Tracks per-user board bookmarks.
* **`orgId`** (`v.string()`): Organization context identifier.
* **`userId`** (`v.string()`): User identifier.
* **`boardId`** (`v.id("boards")`): Foreign key reference to `boards` table.
* **Indexes**:
  * `by_board`: `["boardId"]`
  * `by_user_org`: `["userId", "orgId"]`
  * `by_user_board`: `["userId", "boardId"]`
  * `by_user_board_org`: `["userId", "boardId", "orgId"]`

---

### Liveblocks CRDT Room Storage (`liveblocks.config.ts`)

Canvas layer elements and presence state are persisted in real time inside Liveblocks room storage using conflict-free data structures:
* **`layers`** (`LiveMap<string, LiveObject<Layer>>`): Map of layer IDs to vector shape properties, coordinates, dimensions, fill colors, and connector anchors.
* **`layerIds`** (`LiveList<string>`): Ordered list of layer IDs defining the z-index rendering hierarchy.
* **`presence`**: Transient state synced across sockets (cursor position `{x, y}`, active selection `string[]`, pencil draft, reaction stream, and camera viewport coordinates).

---

## 14. Authentication Flow

```
[ Unauthenticated User ]
           │
           ▼
[ Access /dashboard or /board ] ──(Middleware Intercept)──► [ Clerk Sign-In Page ]
                                                                    │
                                                           (Enter Credentials)
                                                                    │
[ Return JWT Session Token ] ◄──────────────────────────────────────┘
           │
           ├──► [ Access Convex DB queries verified by Clerk JWT Issuer ]
           │
           └──► [ Join Liveblocks Room via Authenticated Route Handler ]
```

1. **Registration & Login**: Handled via Clerk's customizable authentication components. Supports Social OAuth providers (Google, GitHub) and Magic Email Links.
2. **Organization Switching**: Users belong to organizations. Active `orgId` scopes all Convex database queries to enforce multi-tenant privacy.
3. **Session Persistence**: Clerk manages secure, HTTP-only JWT session cookies refreshed automatically in the background.
4. **Protected Routes**: Next.js middleware guards board routes (`/board/*`) and dashboard routes (`/(dashboard)/*`), automatically redirecting unauthenticated traffic to login.

---

## 15. State Management

NexusBoard employs a specialized tri-part state architecture tailored for collaborative graphics applications:

```
                  ┌─────────────────────────────────────────┐
                  │          Global State Architecture       │
                  └────────────────────┬────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Server State    │         │ Canvas Realtime  │         │ Local UI State   │
│     (Convex)     │         │   (Liveblocks)   │         │    (Zustand)     │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ • Board list     │         │ • Layers & Shapes│         │ • Rename Modals  │
│ • Search Index   │         │ • Layer Order    │         │ • Pro Upgrade UI │
│ • Favorite Status│         │ • Peer Cursors   │         │ • Canvas Camera  │
│ • User Profiles  │         │ • Selections     │         │ • Tool Mode      │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

1. **Server Database State (Convex)**: Manages persistent, organization-wide meta records with automatic optimistic updates and real-time subscription sync.
2. **Multiplayer CRDT Canvas State (Liveblocks)**: Controls high-frequency vector layer mutations, selection bounds, presence, and live pencil strokes.
3. **Client UI State (Zustand & React State)**: Manages ephemeral UI states like modal dialog visibility, selected canvas tool, current camera position, zoom scale, and stroke color selections.

---

## 16. Error Handling

* **Schema Input Validation**: Form inputs and mutation payloads are validated against strict Convex value schemas (`v.string()`, `v.id()`) and TypeScript generics.
* **Toast Notifications**: Interactive user notifications via `sonner` for network state changes, failed board operations, copied links, and export completions.
* **Connection Re-establishment**: Liveblocks `useLostConnectionListener` provides visual status indicators when network connectivity drops and automatically re-synchronizes CRDT states upon reconnection.
* **Fallback UI Error Boundaries**: Graceful React component fallback views preventing full page crashes during unexpected rendering faults.

---

## 17. Security

* **Authentication & Token Verification**: All backend operations require verified Clerk JWT tokens.
* **Tenant Isolation**: Every database record includes an `orgId`. Convex mutations verify that the requesting identity belongs to the target organization.
* **Environment Secret Protection**: Secret keys (`CLERK_SECRET_KEY`, `LIVEBLOCKS_SECRET_KEY`) reside exclusively in server-side runtimes.
* **Input Sanitization**: React 19's JSX automatic escaping protects against Cross-Site Scripting (XSS) attacks.
* **NoSQL Injection Immunity**: Type-safe Convex query builders eliminate injection risks by parameterizing all query expressions.
* **CSRF Safeguards**: Next.js built-in Origin verification and SameSite cookie policies prevent Cross-Site Request Forgery.

---

## 18. Performance Optimizations

* **Canvas Render Throttle**: Liveblocks presence emissions are throttled to 16ms (~60 FPS) to maintain smooth cursor animation without choking network bandwidth.
* **Layer Selection Bounds Calculation**: Selective memoization of bounding box vectors prevents costly recalculations during canvas panning.
* **Next.js Server Components**: Core layouts and static pages leverage React Server Components for minimal client JavaScript bundle sizes.
* **Lazy Loading & Code Splitting**: Heavy export libraries (`jspdf`, `html-to-image`) and modal dialogs are dynamic imports loaded only when triggered.
* **Reactive Database Caching**: Convex caches query results on the client and pushes delta patches over WebSockets, minimizing database read overhead.

---

## 19. Responsive Design

NexusBoard is crafted for desktop monitors, laptops, and tablet displays:

* **Adaptive Canvas Viewport**: Responsive canvas camera controls supporting pinch-to-zoom, touch panning, and mouse-wheel scrolling.
* **Collapsible Dashboard Navigation**: Adaptive sidebar that collapses into a sleek mobile menu drawer on smaller screen viewports.
* **Touch-Friendly Controls**: Dynamic hit testing on canvas tools, handles, and shape selection boxes optimized for stylus and touch interactions.

---

## 20. Accessibility

* **Semantic HTML Elements**: Structural page layouts built using standard HTML5 landmarks (`nav`, `main`, `header`, `aside`).
* **Accessible Dialogs & Modals**: Modals powered by Radix UI primitives incorporate keyboard focus traps, `Escape` key close handlers, and screen reader labels (`aria-labelledby`, `aria-describedby`).
* **Keyboard Shortcut Navigation**: Dedicated hotkeys for quick tool switching (`V` for Select, `P` for Pencil, `R` for Rectangle, `T` for Text, etc.).
* **High Contrast Design**: Full support for dark and light color modes using `next-themes` with WCAG-compliant color contrast ratios.

---

## 21. Challenges Faced & Solutions

### Challenge 1: Concurrent Multiplayer Shape Transformations
* **Problem**: When multiple users modified the same shape simultaneously, standard WebSocket state replacement caused jitter and layer desynchronization.
* **Solution**: Implemented Liveblocks CRDT structures (`LiveMap` and `LiveObject`). Granular attribute updates (e.g. updating position vs updating fill color) merge seamlessly without overwriting adjacent properties.

### Challenge 2: Smooth Freehand Drawing Synchronization
* **Problem**: Synchronizing raw cursor point arrays over WebSockets during rapid freehand drawing resulted in laggy line paths.
* **Solution**: Integrated `perfect-freehand` path generation combined with transient presence drafts. Path points are streamed via presence during drawing and finalized into a single vector layer on mouse release.

---

## 22. Lessons Learned

* **CRDT vs Transactional Databases**: Learned to decouple real-time room storage (CRDTs for canvas operations) from relational metadata databases (Convex for user rights and organization board lists).
* **High-Frequency React Optimization**: Discovered the critical importance of keeping high-frequency canvas camera vectors out of standard React component state to eliminate unnecessary DOM re-renders.
* **Serverless Backend Speed**: Convex proved exceptionally effective for building real-time reactive dashboards without writing custom backend express servers or ORMs.

---

## 23. Future Improvements & Roadmap

- [ ] **AI Auto-Layout**: One-click automatic layout reorganization for messy brainstorm sticky notes.
- [ ] **Offline-First Synchronization**: Local storage layer caching updates offline and syncing automatically upon internet restoration.
- [ ] **Infinite Nested Frames**: Group canvas elements inside nested frame containers for design system organizing.
- [ ] **Custom Plugin Ecosystem**: Webhook and SDK architecture allowing developers to build custom canvas integrations.
- [ ] **Real-Time Video Mesh**: Embedded WebRTC video call strip within the board canvas interface.

---

## 24. Testing

### Automated Quality Checks
* **Linting**:
  ```bash
  npm run lint
  ```
* **TypeScript Type Checking**:
  ```bash
  npx tsc --noEmit
  ```

### Verification Workflows
* **Multi-User Session Testing**: Tested using multiple isolated browser profiles (Chrome + Firefox) verifying real-time cursor movement, shape creation, and comment synchronization.
* **Build Validation**: Verified clean execution of `npm run build` with zero compiler warnings or broken imports.

---

## 25. Deployment

### Deploying to Vercel

1. Push your repository code to GitHub.
2. Import your project into the [Vercel Dashboard](https://vercel.com).
3. Configure the environment variables in Vercel project settings matching your `.env.local` keys.
4. Set Build Command to `npm run build` and Output Directory to `.next`.
5. Click **Deploy**.

### Deploying Convex Backend

Run the production deployment command for Convex:
```bash
npx convex deploy
```
Copy the generated production Convex deployment URL into your Vercel Environment Variables as `NEXT_PUBLIC_CONVEX_URL`.

---

## 26. Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m "feat: add amazing canvas feature"
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 27. License

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2026 NexusBoard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restrictionlimitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software.
```

---

## 28. Author

**Your Name**
* **Portfolio**: [yourportfolio.dev](https://yourportfolio.dev)
* **GitHub**: [@your-username](https://github.com/your-username)
* **LinkedIn**: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
* **Email**: [your.email@example.com](mailto:your.email@example.com)

---

## 29. Acknowledgements

* [Next.js](https://nextjs.org/) - React Framework for the Web
* [Liveblocks](https://liveblocks.io/) - Real-time Collaborative Infrastructure
* [Convex](https://convex.dev/) - Reactive Backend Application Platform
* [Clerk](https://clerk.com/) - Complete User Authentication & Management
* [Shadcn UI](https://ui.shadcn.com/) - Reusable Component Primitives
* [Perfect Freehand](https://github.com/steveruizok/perfect-freehand) - Smooth Vector Drawing Algorithms

---

## 30. Conclusion

**NexusBoard** bridges the gap between low-latency visual collaboration and intelligent digital workspaces. Built with modern, web-scale technologies, it demonstrates the power of combining CRDT multiplayer engines with serverless reactive architectures. Whether you're mapping out system architecture or running a team retro, NexusBoard provides the tools needed to bring ideas to life seamlessly.
