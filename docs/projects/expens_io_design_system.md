# Expens.io — Front-End Design System Documentation

---

## 1. Project Overview

* **Brief description:** A cross‑platform Flutter application designed to track personal and shared expenses, offering advanced features like AI-powered insights, gamification, and rich data visualizations.
* **Primary purpose:** To provide a comprehensive, intelligent, and engaging financial management experience for tracking budgets, transactions, and analyzing spending behavior.
* **Platform:** Cross-platform (Mobile, Web, Desktop) via Flutter.
* **Target users:** Individuals and groups (students, professionals) looking to actively manage their finances, gain insights into spending habits, and participate in financial challenges.

---

## 2. Design Philosophy

* **Overall design intent:** Utility-focused yet immersive. The app balances data-heavy financial tracking with engaging elements (gamification, AI insights) in a modern, clean interface.
* **Emotional tone:** Energetic, intelligent, and reliable.
* **UX priorities:** Clarity in data visualization, speed of data entry (voice, receipt scanning), and engagement through smart notifications and gamified achievements.

---

## 3. Color System

The system supports a robust Dark and Light mode, adapting fluidly while maintaining a consistent accent palette.

### Primary Colors (Dark Theme)

* **Background:** `#0B0C10`
* **Surface/Card:** `#12151C`
* **Primary Accent:** `#0099FF` (Button Hover/Primary UI Elements)
* **Secondary Accent:** `#00E0D3`

### Primary Colors (Light Theme)

* **Background:** `#F9FAFB`
* **Surface/Card:** `#FFFFFF`
* **Primary Accent:** `#007CF0` (Button Hover/Primary UI Elements)
* **Secondary Accent:** `#00E0D3`

### Functional Colors

* **App Bar & Navigation Bar:** `#1F2937` (Dark slate, consistent anchor)
* **Success:** `#22C55E` (Implied for positive financial milestones)
* **Warning / Error:** `#EF4444` (Implied for budget exceeded alerts)
* **Chart Categorization Palette:** Blue, Green, Orange, Purple, Red, Teal, Brown

### Text Colors

* **Dark Theme Text:** Primary `#FFFFFF`, Secondary `#C9D1D9`
* **Light Theme Text:** Primary `#1F2937`, Secondary `#6B7280`
* **Borders (Dark/Light):** `#1F2937` / `#E5E7EB`

### Color Adaptation Strategy

* **Global Portfolio Blend:** The dark theme’s deep blue-black background (`#0B0C10`) easily integrates with a global portfolio dark theme (`#0A0F1E`).
* **Accent Preservation:** The vibrant gradients and accents (`#0099FF`, `#00E0D3`) should be preserved to maintain the app's energetic and intelligent identity.
* **Conflict Resolution:** If the global portfolio uses green (`#22C55E`) as a primary accent, it can be applied to success states or specific "budget intact" indicators without clashing with Expens.io's core cyan/blue accents.

---

## 4. Typography

* **Font style:** Modern, clean, and highly readable.
* **Heading hierarchy:** **Poppins** is used for AppBars and Titles (providing a geometric, friendly, and structured feel).
  * `Title Large`: Poppins, Bold, 22px
  * `Title Medium`: Poppins, Semi-Bold, 18px
  * `Title Small`: Poppins, Medium, 14px
* **Body text style:** **Roboto** is used for body text and data tables, ensuring maximum legibility for financial numbers and dense data.
  * `Body Large`: Roboto, Regular, 16px
  * `Body Medium`: Roboto, Regular, 14px
  * `Body Small`: Roboto, Regular, 12px
* **Emphasis usage:** Bold weights for monetary amounts and critical budget thresholds.

---

## 5. Layout System

* **Page structure:** 
  * Fixed top AppBar containing branding and theme toggles.
  * Scrollable main body utilizing `SingleChildScrollView` to accommodate dynamic content.
  * Floating/Curved bottom navigation bar for quick access to primary modules.
* **Grid system:** Modular card-based layout for dashboards, allowing charts and summaries to stack responsively.
* **Spacing philosophy:** Comfortable padding around cards (typically 12px - 16px) to separate distinct data points and insights.
* **Section hierarchy:** Top-level summaries (Wallet balance), followed by visual insights (Charts), followed by granular lists (Recent transactions).

---

## 6. Core UI Components

* **Curved Navigation Bar**
  * *Purpose:* Primary app navigation.
  * *Visual style:* Distinct dark background (`#1F2937`) with white icons, curved active state indicator.
  * *Adaptation strategy:* Translate to a standard portfolio sidebar or sticky header while keeping the icon set.

* **Data Cards**
  * *Purpose:* Contain charts, insights, and budget summaries.
  * *Visual style:* Subtle borders, solid surface color (`#12151C` or `#FFFFFF`), slight elevation.
  * *Adaptation strategy:* Map directly to the portfolio's default Card component.

* **Input Forms & TextFields**
  * *Purpose:* Data entry for expenses and budgets.
  * *Visual style:* Filled input fields, rounded borders (`12px` radius).
  * *Adaptation strategy:* Use standard portfolio form inputs, matching the border-radius.

* **Snackbars/Alerts**
  * *Purpose:* Budget threshold warnings and success notifications.
  * *Visual style:* High contrast, standard Material positioning.

---

## 7. Data Visualization

* **Types of charts used:** 
  * **Pie Chart:** Category or subcategory breakdown of expenses.
  * **Bar Chart:** Expenses per day for the current week.
  * **Line Chart:** Spending trends over the last 14 days.
* **Visual encoding:** Colors represent distinct spending categories; height/Y-axis represents monetary value; X-axis represents time (days).
* **Interaction patterns:** Touch/hover tooltips on charts to reveal exact amounts for specific data points.

---

## 8. Interaction Design

* **Hover/Tap States:** Buttons and interactive elements utilize the primary accent color (`#0099FF` / `#007CF0`) for visual feedback.
* **Click behavior:** Entire cards are tappable for detailed breakdowns.
* **Feedback systems:** Snackbars display immediate feedback upon expense addition or when a budget limit is reached (e.g., "Daily budget exceeded").
* **Transitions:** Smooth switching between tabs utilizing the animated Curved Navigation Bar.

---

## 9. Motion & Animation

* **Animation style:** Dynamic but purposeful.
* **Use of transitions:** The curved navigation bar features a fluid, sweeping motion when changing tabs.
* **Microinteractions:** Form validations, chart rendering animations (growing bars/lines), and gamification achievement unlocks.

---

## 10. Theming Strategy for Portfolio Integration

To showcase Expens.io within a global portfolio, its UI should be adapted while retaining its energetic, data-driven feel.

### Must Preserve
* **The Core Accents:** The cyan (`#00E0D3`) and bright blue (`#0099FF`) accent colors are crucial to the app's identity and should be used for highlights and charts.
* **Typography Pairing:** The Poppins (Titles) and Roboto (Body) combination provides the right balance of approachability and data legibility.
* **Card-based Dashboard Structure:** The visual separation of data widgets is essential.

### Can Adapt
* **Background Colors:** The specific dark (`#0B0C10`) or light (`#F9FAFB`) backgrounds can be adjusted to match the portfolio's global canvas colors.
* **Navigation:** The curved bottom navigation bar can be replaced by the portfolio's native navigation (e.g., a top nav or side menu) for better contextual fit on desktop views.

### Must Conform
* **Spacing and Responsiveness:** Margins and padding should align with the portfolio's grid system.
* **Shadows/Elevation:** Card shadows should match the global portfolio's elevation standards to avoid looking out of place.

---

## 11. Component Mapping to Portfolio System

* `Curved Navigation Bar` → **Portfolio Global Navigation**
* `Dashboard Data Card` → **Portfolio Card Component**
* `Expense Input Form` → **Shared Form Elements**
* `fl_chart Widgets` → **Portfolio Data Visualization System**
* `Budget Alert Snackbar` → **Portfolio Toast/Notification Component**

---

## 12. Visual Identity Summary

Expens.io stands out through its **intelligent, utility-driven aesthetic**. It successfully merges dense financial data with an approachable, gamified user experience. The stark contrast of bright cyan and blue accents against deep, dark backgrounds gives it a modern, slightly futuristic feel, perfectly aligning with its AI-powered features. In the context of a portfolio, it represents the ability to build complex, data-heavy, cross-platform applications that do not compromise on visual engagement or user experience.
