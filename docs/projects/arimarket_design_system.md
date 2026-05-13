# AriMarket — Front-End Design System Documentation

## 1. Project Overview
* **Brief description**: An AI-driven price prediction and market analysis platform.
* **Primary purpose**: Provide real-time data, trend analysis, and predictive modeling for financial assets.
* **Platform**: Web (Desktop-first)
* **Target users**: Traders, financial analysts, data scientists.

## 2. Design Philosophy
* **Overall design intent**: Data-heavy, technical, immersive, and precision-oriented.
* **Emotional tone**: Futuristic, authoritative, analytical, and fast.
* **UX priorities**: Speed of real-time updates, high contrast for legibility, and information density.

## 3. Color System

### Primary Colors
Primary Background: #0B0F19
Surface: #1A2235
Primary Accent: #10B981 (Bullish Green)
Secondary Accent: #F43F5E (Bearish Red)

### Functional Colors
Success: #10B981
Warning: #F59E0B
Error: #F43F5E
Info: #3B82F6

### Text Colors
Primary Text: #F8FAFC
Secondary Text: #94A3B8
Muted Text: #475569

### Color Adaptation Strategy
AriMarket naturally aligns with the global dark theme (`#0A0F1E`). Surfaces will match standard portfolio dark mode elevations. The bullish green (`#10B981`) overrides the global green (`#22C55E`) slightly for specific financial context but maintains harmony.

## 4. Typography
* **Font style**: Monospaced for numbers (Roboto Mono or Space Mono), clean geometric sans-serif for UI (Inter).
* **Heading hierarchy**: Uppercase, tracked out for widgets and panels.
* **Body text style**: Compact, highly legible at small sizes.
* **Emphasis usage**: Color-coded emphasis (green/red) based on market state rather than font weight alone.

## 5. Layout System
* **Page structure**: Modular, multi-panel dashboard with resizable widgets.
* **Grid system**: Strict CSS grid for complex widget alignment.
* **Spacing philosophy**: Dense, structured spacing (2px/4px/8px).
* **Section hierarchy**: Heavy use of borders and subtle background differentials to separate data streams.

## 6. Core UI Components

* **Financial Charts**
  * *Purpose*: Displaying time-series and candlestick data.
  * *Visual style*: High-contrast lines, gridlines muted.
  * *Interaction behavior*: Crosshairs, zooming, panning.
  * *Adaptation strategy*: Portfolio Specialized Chart Component.
* **Real-Time Tickers**
  * *Purpose*: Live streaming price updates.
  * *Visual style*: Scrolling or flashing text blocks.
  * *Interaction behavior*: Color flashes on value change.
  * *Adaptation strategy*: Marquee/Ticker Component.
* **Control Panels**
  * *Purpose*: Adjusting AI prediction parameters.
  * *Visual style*: Sliders, segmented controls, dense toggles.
  * *Interaction behavior*: Immediate chart response on tweak.
  * *Adaptation strategy*: Shared Filter Component.

## 7. Data Visualization
* **Types of charts used**: Candlestick charts, time-series line charts with AI confidence intervals (shaded regions).
* **Visual encoding**: Green for upward movement, Red for downward. Thickness denotes confidence.
* **Interaction patterns**: Hover for crosshair and detailed tooltip data; drag to zoom.

## 8. Interaction Design
* **Hover states**: Brightening of borders, crosshair activation on charts.
* **Click behavior**: Crisp, immediate.
* **Feedback systems**: Subtle background flashes when data updates via WebSocket.
* **Transitions**: Minimal to prevent jarring shifts during rapid data ingestion.

## 9. Motion & Animation
* **Animation style**: Dynamic, micro-flashes.
* **Use of transitions**: Smooth line drawing for newly rendered data points.
* **Microinteractions**: Color pulsing on live active assets.

## 10. Theming Strategy for Portfolio Integration

### Must Preserve
Monospaced numeric typography, strict green/red market semantic coloring, and widget-based layout.

### Can Adapt
Base background color (shifting perfectly to portfolio dark mode), font family for non-numeric UI.

### Must Conform
Global navigation structure, modal overlays, responsiveness.

## 11. Component Mapping to Portfolio System
Market Chart → Portfolio Specialized Chart
Control Panel → Shared Filter Component
Real-Time Ticker → Marquee Component

## 12. Visual Identity Summary
Distinct for its terminal-like, high-contrast dark mode and monospaced data focus. It brings a highly technical, futuristic "command center" vibe to the overall portfolio.
