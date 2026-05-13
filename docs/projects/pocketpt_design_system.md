# PocketPT — Front-End Design System Documentation

## 1. Project Overview

* **Description:** An AI-powered rehabilitation assistant that tracks patient progress, provides guided exercise routines, and uses machine learning for real-time pose estimation and pain monitoring.
* **Primary Purpose:** To guide patients through physical therapy exercises, track their pain levels, and ensure correct form using AI computer vision.
* **Platform:** Cross-platform (Mobile: Android/iOS portrait-locked, Web with offline capabilities).
* **Target Users:** Patients recovering from injuries, physical therapy clients, and individuals managing chronic pain.

---

## 2. Design Philosophy

* **Overall Design Intent:** Clinical yet accessible, focusing on clarity, trust, and encouraging progress. The UI aims to reduce cognitive load for users who may be experiencing discomfort or pain.
* **Emotional Tone:** Professional, empathetic, supportive, and medically credible (Muscular Maroon accents denote strength and recovery).
* **UX Priorities:** Accessibility (large tap targets, clear typography), speed (offline-first data, responsive loading), and engagement (guided tutorials, visual progress tracking).

---

## 3. Color System

### Primary Colors

* **Primary Background:** `#F8FAFC` (Light Mode) / `#0F1012` (Dark Mode)
* **Surface:** `#FFFFFF` (Light Mode) / `#111315` (Dark Mode)
* **Primary Accent:** `#8B2E2E` (Muscular Maroon - conveys muscular strength and clinical precision)
* **Secondary Accent:** `#C24A4A` (Lighter Maroon - used for interactive states and highlights)
* **Detail Color:** `#6B7280` (Gray borders and subtle dividers)

### Functional Colors

* **Success:** `#10B981` (Green - exercise completed, positive progress)
* **Warning:** `#F59E0B` (Orange - form correction needed, moderate pain)
* **Error:** `#EF4444` (Red - critical pain levels, severe form deviation)
* **Info:** `#6B7280` (Muted functional alerts)

### Text Colors

* **Primary Text:** `#1F2937` (Dark Gray for high readability) / `#FFFFFF` (Dark Mode)
* **Secondary Text:** `#4B5563` (Medium Gray for supporting info) / `rgba(255, 255, 255, 0.7)` (Dark Mode)
* **Muted Text:** `#9CA3AF` (Disabled states, placeholders)

### Color Adaptation Strategy

* **Global Dark Theme Blend:** The native dark mode (`#0F1012` / `#111315`) already aligns seamlessly with a global portfolio dark theme.
* **Accent Preservation:** The signature "Muscular Maroon" (`#8B2E2E`) should be preserved as the defining brand color for this project card and its internal portfolio page, replacing the global accent where appropriate.
* **Functional Alignment:** The success/warning/error semantic colors (`#10B981`, `#F59E0B`, `#EF4444`) are standard and should map 1:1 with the global portfolio utility colors.

---

## 4. Typography

* **Font Style:** Clean, highly legible, modern sans-serif with a structural, geometric heading typeface to inspire confidence.
* **Heading Hierarchy (Poppins):**
  * Used for `display`, `headline`, and `title` roles.
  * Emphasizes structural stability and modern clinical tech.
  * Weights vary from Medium (w500) to Bold (w700).
* **Body Text Style (PT Sans):**
  * Used for `body` and `label` roles.
  * Highly readable for longer paragraphs (e.g., exercise instructions, pain descriptions).
* **Emphasis Usage:** Bold `Poppins` for vital metrics (reps, pain score), muted `PT Sans` for timestamps and secondary logs.

---

## 5. Layout System

* **Page Structure:** Mobile-first dashboard layout. Primary views include daily assessment panels, exercise carousels, and persistent bottom navigation.
* **Grid System:** Single-column stacked layout on mobile; constrained centered columns on web/desktop to mimic mobile proportions and maintain focus.
* **Spacing Philosophy:** Generous padding (typically 16px/24px) to accommodate users with potentially limited motor control. Deeply inset surfaces for clear visual separation of distinct medical data points.
* **Section Hierarchy:** Hero sections for active assessments, followed by horizontally scrollable cards for daily tasks, and stacked lists for historical logs.

---

## 6. Core UI Components

* **Curved Navigation Bar**
  * **Purpose:** Main app navigation between Dashboard, Exercises, and Profile.
  * **Visual Style:** Fluid, animated, organic shape breaking rigid clinical lines.
  * **Interaction Behavior:** Smooth slide/curve animation on tab switch.
  * **Portfolio Adaptation:** Represented as standard sticky navigation or pill-shaped floating nav in the web portfolio.

* **Animated Pain Scale**
  * **Purpose:** To log user pain levels interactively.
  * **Visual Style:** Gradient slider or segmented interactive chart reflecting pain intensity (green to red).
  * **Interaction Behavior:** Draggable, with micro-animations on value change.
  * **Portfolio Adaptation:** Reusable slider component with custom gradient fills.

* **AI Pose Skeleton Overlay**
  * **Purpose:** Real-time feedback on physical therapy form.
  * **Visual Style:** High-contrast nodes and connecting lines overlaid on live camera feed.
  * **Interaction Behavior:** Dynamic movement tracking.
  * **Portfolio Adaptation:** Showcase as a looped video or interactive WebGL canvas demo in the portfolio.

* **Progressive Loading Indicators**
  * **Purpose:** To keep users engaged during heavy ML model or data sync operations.
  * **Visual Style:** Branded loaders (incorporating the maroon theme).
  * **Interaction Behavior:** Smooth, non-blocking pulse animations.
  * **Portfolio Adaptation:** Map to global portfolio skeleton loaders or spinners, tinted maroon.

* **Responsive Dialogs**
  * **Purpose:** Confirmations, alerts, and deep-dive tutorial help.
  * **Visual Style:** Centered modals with soft rounded corners and prominent call-to-action buttons.
  * **Interaction Behavior:** Fade and scale-in transitions with backdrop blur.
  * **Portfolio Adaptation:** Standard portfolio modal component.

---

## 7. Data Visualization

* **Types of Charts Used:** Line charts for long-term pain history; progress rings/circular indicators for daily task completion.
* **Visual Encoding:** Color gradients represent intensity (green = good, red = bad/pain). Size/fill percentage represents task completion.
* **Interaction Patterns:** Tap data points on line charts to see specific daily notes; swipe to change timeframes (weekly/monthly).

---

## 8. Interaction Design

* **Hover States:** Subtle elevation increases and lightening of the `kSubColor` for buttons (more prominent on Web build).
* **Click Behavior:** Immediate tactile feedback via ripple effects (Material standard), especially important for accessibility.
* **Feedback Systems:** Snackbars for save confirmations (e.g., "Data successfully saved"); color-coded form validation.
* **Transitions:** Hero animations between exercise list and exercise detail views; smooth cross-fades during authentication and loading states.

---

## 9. Motion & Animation

* **Animation Style:** Purposeful and reassuring. Nothing erratic.
* **Use of Transitions:** Page transitions use sliding or fading. The Curved Navigation bar uses spring physics.
* **Microinteractions:** Pulse effects on active AI tracking areas, smooth filling of progress bars, animated pain face icons depending on the selected scale.

---

## 10. Theming Strategy for Portfolio Integration

To integrate PocketPT into the unified global portfolio while preserving its identity:

### Must Preserve
* **Color Accents:** The Muscular Maroon (`#8B2E2E`) must remain the primary brand color for buttons, links, and highlights on the PocketPT project page.
* **Typography Pairing:** The use of Poppins (Headers) and PT Sans (Body) should be retained for any simulated UI mockups or text describing the project.
* **Data Visualization Style:** The specific green-to-red gradient for pain scales must be kept to accurately represent the app's functionality.

### Can Adapt
* **Backgrounds:** The app's native dark mode (`#0F1012`) can be overridden by the portfolio's global dark background (`#0A0F1E`) to maintain global harmony.
* **Navigation:** The mobile Curved Navigation Bar can be abstracted or replaced by standard portfolio layouts for case-study presentation.

### Must Conform
* **Spacing:** The spacing scale of the portfolio should dictate the padding of the case study page, rather than using the app's exact native padding.
* **Animation System:** Scroll-reveal animations and page transitions should follow the global portfolio's physics/timing.

---

## 11. Component Mapping to Portfolio System

* `Responsive Loading Screen` → **Portfolio Global Loader (tinted #8B2E2E)**
* `Dashboard Task Card` → **Portfolio Grid Card Component**
* `Pain History Chart` → **Shared Data Visualization Component (Line Variant)**
* `Responsive Dialog` → **Portfolio Modal Wrapper**
* `Primary Button (Maroon)` → **Portfolio Primary Button Variant (Color Override)**

---

## 12. Visual Identity Summary

PocketPT balances a **strict, professional clinical tool** with an **empathetic, accessible patient experience**. It stands out visually through its "Muscular Maroon" branding and its focus on clear, large-format typography (Poppins). In the context of a diverse portfolio, PocketPT contributes a strong example of **accessible health-tech UI**, demonstrating how to handle complex AI integrations (pose estimation) and sensitive medical data within a clean, un-intimidating, and highly responsive mobile-first interface.
