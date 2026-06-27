---
name: faak-ui-design
description: UI Design System and Guidelines for the Faak project. Use this skill when building or styling UI components for Faak.
---

# Faak Project - UI Design System & Guidelines (Apple Glassmorphism)

When building or modifying the frontend for the Faak project, you MUST strictly adhere to the following design system to ensure consistency, beauty, and a premium "Apple/iPhone Glass" user experience.

## 1. Core Technologies
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI (e.g., Button, Input, Card, Label)
- **Icons:** Lucide React (`lucide-react`)

## 2. Color Palette & Theming
- **Backgrounds:** Use dynamic, vibrant gradients or mesh gradients behind the glass layers to make the glass effect pop.
- **Glass Base:** `bg-white/40` (Light mode) or `bg-black/40` (Dark mode).
- **Primary Color:** `blue` for CTAs.

## 3. Design Aesthetics (The "Apple Glass" Feel)
- **Heavy Glassmorphism:** Cards, Navbars, and overlays MUST use `backdrop-blur-2xl` or `backdrop-blur-3xl`.
- **Translucency & Borders:** Use translucent backgrounds (`bg-white/40 dark:bg-black/40`) with a subtle white/gray inner border (`border border-white/40 dark:border-white/10`) to create a realistic glass edge.
- **Rounded Corners:** Use large border radii (`rounded-3xl` or `rounded-2xl`) to mimic iOS design.
- **Soft Shadows:** Use `shadow-2xl` with subtle opacities to separate layers.
- **Typography:** Clean, minimalist. Use `font-semibold` for titles and `tracking-tight`.

## 4. Standard Component Patterns (Override Shadcn Components)
Instead of adding heavy utility classes to every instance, you should modify the core `src/components/ui/*.tsx` files directly to set these styles as defaults:
- **Cards (`card.tsx`):** `"rounded-3xl border border-white/50 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-xl text-card-foreground overflow-hidden"`
- **Navbars:** Floating or sticky navbars must have high blur (`backdrop-blur-2xl bg-white/50 dark:bg-black/50 border-b border-white/30 dark:border-white/10`).
- **Inputs (`input.tsx`):** Inputs should be slightly translucent (`bg-white/50 dark:bg-black/50 rounded-xl`). 
- **Buttons (`button.tsx`):** Buttons should have full opacity for contrast, but heavily rounded (`rounded-xl` or `rounded-2xl`).
