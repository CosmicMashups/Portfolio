# Sell.io: Next-Generation Real-Time Self-Service Kiosk & POS Architecture

## Overview

**Sell.io** is an enterprise-grade, stock-aware point-of-sale (POS) and interactive self-service kiosk system engineered specifically for variant-heavy apparel retail environments (modeled after high-volume retailers like Uniqlo). Generic retail checkout platforms fail in apparel because garments are not flat SKUs—each style fans out into dozens of size, color, and design permutations carrying distinct, rapidly fluctuating inventory counts across physical store branches. Sell.io eliminates checkout friction, inventory ghosting, and overselling by coupling a dual-layer inventory engine (an append-only ledger paired with derived caches) with real-time distributed stock reservations and an offline-resilient edge architecture. The system empowers retail shoppers with an intuitive, self-guided touchscreen shopping journey while arming store associates and headquarters with auditable stock movements, automated claim-ticket fulfillment, and multi-branch visibility.

---

## ✦ Key Highlights

- **Matrix-Aware Apparel Variant Engine:** Purpose-built for multi-dimensional SKU hierarchies (Style $\rightarrow$ Size $\times$ Color $\times$ Design Code), handling deep variant catalogs without UI degradation or stock desynchronization.
- **Strict Append-Only Inventory Ledger:** Eliminates database drift by enforcing that `StockMovement` is the immutable source of truth for all events (`StockIn`, `Sale`, `Reservation`, `Adjustment`), maintaining `BranchStock.QuantityOnHand` as a transactional derived cache.
- **Distributed Two-Phase Stock Reservation (TTL Locks):** Implements atomic 5-minute stock reservations across checkout sessions via an `IStockReservationStore` abstraction (thread-safe in-memory memory locks transitioning seamlessly to Redis), preventing race conditions and overselling during flash promotions.
- **Zero-Latency Live Synchronization via SignalR:** Broadcasts instant stock decrements and availability state changes across all in-store kiosks in real time via branch-scoped WebSocket channels (`StockHub`).
- **Resilient Edge-First Offline Architecture:** Features a local SQLite edge database allowing kiosks to continue taking orders during network blackouts, backed by an asynchronous reconciliation engine that replays orders in strict client-timestamp sequence with deterministic conflict resolution.
- **Local Payment Rail Integration & ESC/POS Thermal Printing:** Full support for Philippine retail payment methods including QRPH (GCash, Maya), direct bank transfers (BDO via PayMongo integration), and cash-to-counter routing, culminating in ESC/POS compliant 12% VAT thermal receipt and claim-ticket generation.
- **Cost-Staged $0-to-Enterprise Scalability Model:** Meticulously architected Clean Architecture domain boundaries that enable running the full production system on Azure Free/Serverless tiers ($0 operational cost) before scaling to clustered enterprise Redis and Azure SQL with pure configuration swaps.

---

## Tech Stack

| Category             | Technologies                                                                                              |
|----------------------|-----------------------------------------------------------------------------------------------------------|
| **Language(s)**      | C# 12 (.NET 8 LTS), SQL, HTML5, Modern Vanilla JavaScript (ES6+), CSS3                                    |
| **Frontend**         | ASP.NET Core Razor Pages / MVC, SignalR Client (JavaScript WebSocket), Tailwind-inspired Japanese Modernist CSS, Google Fonts (Noto Sans JP, Inter, Space Grotesk) |
| **Backend**          | ASP.NET Core Web API & MVC (.NET 8 LTS), SignalR Hubs, Dependency Injection Pipeline                      |
| **Database & ORM**   | Entity Framework Core 8 (EF Core), SQLite (Edge / Offline / Local DB), Azure SQL Database (Cloud SaaS target) |
| **Caching & Locks**  | `IStockReservationStore`, Thread-Safe `ConcurrentDictionary` with TTL Expiration Sweeper, Redis / Azure Cache for Redis (Production Target) |
| **Hardware & Print** | ESC/POS Thermal Receipt Engine, System.Text formatting, 1D/2D Barcode generation standards                |
| **APIs & Payments**  | PayMongo Payment Gateway Aggregator (QRPH EMVCo, Maya, GCash, BDO Bank Transfer API), RESTful API Endpoints |
| **Testing**          | xUnit, Moq, Microsoft.Data.Sqlite (In-Memory Integration & Isolation Testing)                            |
| **Architecture**     | Clean Architecture / Onion Architecture, Domain-Driven Design (DDD) Patterns, Multi-Branch Scoping         |

---

## System Architecture

Sell.io implements a modular **Clean Architecture (Onion Architecture)** with clear boundaries separating core domain models, business logic interfaces, infrastructure implementations, and presentation layers.

```
                           ┌──────────────────────────────────────────────┐
                           │               Azure Cloud (SaaS)             │
                           │                                              │
                           │     ┌──────────────────────────────────┐     │
                           │     │    ASP.NET Core Web API / Host   │     │
                           │     │   (BranchId Row-Level Scoping)   │     │
                           │     └──────────────┬───────────────────┘     │
                           │                    │                         │
                           │         ┌──────────┴──────────┐              │
                           │         ▼                     ▼              │
                           │  ┌──────────────┐      ┌─────────────┐       │
                           │  │ Azure SQL DB │      │ Redis Cache │       │
                           │  │  (Central)   │      │ (TTL Locks) │       │
                           │  └──────────────┘      └─────────────┘       │
                           │                               │              │
                           │  ┌────────────────────────┐   │              │
                           │  │ PayMongo Gateway API   │◄──┘              │
                           │  │ (QRPH / Maya / BDO)    │                  │
                           │  └────────────────────────┘                  │
                           └─────────────────▲────────────────────────────┘
                                             │
                       HTTPS REST / WSS SignalR (When Online)
                                             │
                                             ▼
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                       In-Store Branch Edge Deployment                       │
    │                                                                             │
    │  ┌─────────────────────────────────┐       ┌─────────────────────────────┐  │
    │  │       Customer Touch Kiosk      │       │       Staff POS Register    │  │
    │  │  (Blazor / Razor Web Host)      │       │  (Manual Sales, Cash Mgmt,  │  │
    │  │  ┌───────────────────────────┐  │       │   Staff-Assist Queue View)  │  │
    │  │  │ Local SQLite Engine       │  │       │                             │  │
    │  │  │ (Catalog & Offline Queue) │  │       └──────────────┬──────────────┘  │
    │  │  └───────────────────────────┘  │                      │                 │
    │  │  ┌───────────────────────────┐  │                      │                 │
    │  │  │ Background Sync Service   │  │                      │                 │
    │  │  └─────────────┬─────────────┘  │                      │                 │
    │  └────────────────┼────────────────┘                      │                 │
    │                   │                                       │                 │
    │                   ▼                                       ▼                 │
    │       ┌────────────────────────────────────────────────────────┐            │
    │       │     ESC/POS Local Hardware Thermal Receipt Printer     │            │
    │       │        (Claim Tickets, Invoices, Barcode Tokens)       │            │
    │       └────────────────────────────────────────────────────────┘            │
    └─────────────────────────────────────────────────────────────────────────────┘
```

### Architectural Layers

1. **SellIo.Core (Domain Layer):**
   - Pure domain models (`Branch`, `ProductStyle`, `ProductVariant`, `BranchStock`, `StockMovement`, `Order`, `OrderLine`, `Payment`).
   - Domain enumerations (`OrderChannel`, `FulfillmentType`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`, `StockMovementType`).
   - Abstractions and interfaces (`IInventoryService`, `IOrderService`, `IStockReservationStore`, `IPaymentGateway`, `IReceiptPrinter`).
   - Zero external infrastructure or framework dependencies.

2. **SellIo.Infrastructure (Data & Service Layer):**
   - Entity Framework Core implementation via `SellIoDbContext` configured with unique indexing, composite keys, and relational mapping.
   - Dual-layer inventory transactional coordinator (`InventoryService`).
   - Atomic state lock implementation (`InMemoryStockReservationStore`).
   - Real-time SignalR WebSocket hub (`StockHub`) broadcasting to branch-specific connection groups (`Branch_{branchId}`).
   - Hardware printer formatting adapter (`EscPosReceiptPrinter`).
   - Payment aggregator client (`PayMongoPaymentGateway`).

3. **SellIo.Web (Presentation & Edge API Layer):**
   - High-performance MVC controllers (`KioskController`, `InventoryApiController`, `HomeController`).
   - Strongly-typed view models (`CatalogViewModel`, `CustomizeViewModel`, `PaymentViewModel`, `ConfirmationViewModel`).
   - State & session management (`KioskSessionService`) maintaining isolated customer carts and reservation tokens across multi-step kiosk interactions.

### Data Flow

```
[Customer Selects Variant]
            │
            ▼
[KioskSessionService: AddToCart()]
            │
            ▼
[InventoryService: ReserveStockForOrderAsync()]
  ├── Checks effective stock (QuantityOnHand - Current Active Reservations)
  ├── Locks item count in IStockReservationStore with 5-min TTL
  └── Broadcasts updated quantity to 'Branch_{branchId}' via SignalR (StockHub)
            │
            ▼
[Customer Proceeds to Payment]
  ├── Order created in 'Reserved' status with unique OrderNumber & ClaimNumber
  ├── PayMongo Gateway generates EMVCo QRPH or Bank Transfer intent
  └── Customer scans QR or selects Cash
            │
            ▼
[Payment Confirmed / Webhook / Staff Confirm]
  ├── Order status transitions to 'Paid'
  ├── Atomic Transaction executes:
  │     ├── Appends negative delta row to StockMovement ledger (Source of Truth)
  │     └── Decrements derived cache in BranchStock.QuantityOnHand
  ├── IStockReservationStore releases session lock key
  ├── SignalR pushes finalized stock count to all terminals
  └── EscPosReceiptPrinter generates thermal ticket with VAT breakdown
```

### Key Architectural Decisions & Trade-Offs

- **Ledger vs. Mutable Row:** Instead of executing basic `UPDATE BranchStock SET QuantityOnHand = QuantityOnHand - @qty`, the system mandates an append-only `StockMovement` entry. While this incurs an extra row insertion per sale, it provides an auditable paper trail, enables instant stock audit rollbacks, and powers historical sales reporting without separate analytics warehousing.
- **Row-Level Branch Multi-Tenancy:** Rather than maintaining separate database instances per store branch, a unified schema partitioned by `BranchId` is used. This enables instantaneous corporate HQ reporting and cross-branch inventory lookups while keeping database management simple.
- **Soft Failure Offline Strategy:** When connectivity drops, devices sell against their local SQLite snapshot and queue transactions. While this accepts the calculated risk of an oversell during multi-kiosk outages, conflicts are deterministically resolved on reconnection via client creation timestamps (first-transacted wins, later-transacted auto-cancels), preventing catastrophic silent data corruption.

---

## Features & Implementations

---

### Matrix-Based Apparel Variant Customizer

**What it does:**
Enables shoppers to inspect garments and dynamically configure product attributes across Size (XS through XXL), Color (Off White, Black, Olive Green, Navy, Charcoal), and Design Codes. Out-of-stock sizes and colors are grayed out or badged with remaining quantities in real time, preventing customers from attempting to order unavailable stock.

**How it's implemented:**
- Controller endpoint `KioskController.Customize(int id)` fetches the `ProductStyle` aggregate including all associated `ProductVariant` entities.
- Executes `IInventoryService.GetEffectiveAvailableStockForStyleAsync(branchId, styleId)`, which queries `BranchStock` and subtracts active non-expired reservations from `IStockReservationStore`.
- The Razor view (`Customize.cshtml`) dynamically generates interactive color swatches using stored hexadecimal codes (`ColorHex`) and size pills. JavaScript matrix logic watches selection changes, reveals aisle/rack physical store location hints (e.g., `AISLE 04 • RACK B`), and activates instant checkout buttons.

**Notable details:**
Apparel physical store location metadata (`LocationHint`) and fabric technology notes (`FabricDetail`, e.g., "Dual-Face AIRism Technology") are delivered straight to the customer's fingers, bridging physical retail browsing with digital convenience.

---

### Two-Phase Stock Reservation Engine (TTL Locks)

**What it does:**
Guarantees that when a customer selects a variant and moves through checkout, those physical units are temporarily locked for 5 minutes. No other kiosk customer can grab the same last unit while payment is being processed.

**How it's implemented:**
- Orchestrated by `IStockReservationStore` and implemented via `InMemoryStockReservationStore` (using `ConcurrentDictionary<string, ReservationRecord>` with thread synchronization locks).
- When `AddToCart` is triggered, `ReserveStockForOrderAsync` validates that `(QuantityOnHand - ReservedQuantity) >= requestedQuantity`.
- A composite key (`{branchId}:{variantId}:{reservationKey}`) is registered with an exact UTC expiration timestamp.
- A background sweeper (`CleanExpired()`) automatically prunes expired keys upon inquiry.
- When payment succeeds, `ReleaseKeyAsync` is called after the sale ledger row is securely committed. If the session times out, the stock naturally returns to the general availability pool without requiring complex database cleanup.

**Notable details:**
Engineered with zero lock contention on the primary relational database. This prevents database deadlocks and preserves 60fps responsiveness even when multiple kiosks simultaneously compete for high-demand apparel drops.

---

### Real-Time In-Store Stock Broadcast (SignalR `StockHub`)

**What it does:**
Instantly synchronizes stock numbers across all kiosk screens and staff terminals in the store without page refreshes. If Kiosk 01 reserves the last size Medium Black T-shirt, Kiosk 02's screen immediately reflects "0 available" or disables the button.

**How it's implemented:**
- ASP.NET Core SignalR hub `StockHub` defines connection group subscription methods: `JoinBranchGroup(int branchId)` and `LeaveBranchGroup(int branchId)`.
- Upon any reservation change or committed sale, `InventoryService` triggers:
  ```csharp
  await _stockHub.Clients.Group($"Branch_{branchId}")
      .SendAsync("StockUpdated", branchId, variantId, newAvailable);
  ```
- Front-end JavaScript connects to `/hubs/stock` via `@microsoft/signalr`, dynamically updating DOM stock indicators and disabling out-of-stock buttons in sub-100ms response times.

**Notable details:**
Group-scoping by `Branch_{branchId}` ensures that network packets are only routed to devices physically located in the relevant store branch, avoiding unnecessary broadcast traffic to corporate HQ or other retail stores.

---

### Dual-Path Fulfillment Orchestrator

**What it does:**
Provides shoppers with flexibility in how they receive their items:
1. **Self-Fetch ("I'll get it myself"):** Shopper grabs items directly from store racks (using aisle hints provided on the screen) and scans out at the kiosk.
2. **Staff-Assist ("Staff will prepare"):** Kiosk generates a numbered claim ticket; the order is piped directly into the staff backroom queue for associates to retrieve and package the garment.

**How it's implemented:**
- Implemented in `KioskController.Fulfillment()` and captured within `Order.FulfillmentType` (enum: `SelfFetch`, `StaffAssist`).
- Serialized into `KioskSessionService` and persisted into the relational `Orders` record.
- In `StaffAssist` mode, the generated claim ticket uses a deterministic daily sequence algorithm (e.g., `#A-101`, `#B-102`) formatted prominently on both screen and thermal printouts.

**Notable details:**
Models real-world fast-fashion operations: during low-traffic periods, customers enjoy self-checkout; during rush hours or for high-security garments, staff assistance ensures zero merchandise loss.

---

### Multi-Modal Payment Gateway Integration

**What it does:**
Accommodates diverse retail payment rails:
- **QRPH / GCash / Maya:** Generates dynamic EMVCo-compliant QR codes for instant mobile e-wallet scanning.
- **Direct Bank Transfer:** Generates transaction payment references for direct BDO online bank transfers.
- **Cash to Counter:** Issues an unpaid hold order and routes the customer to the cash counter where a store associate confirms payment on the staff POS register.

**How it's implemented:**
- `IPaymentGateway` interface implemented by `PayMongoPaymentGateway`.
- Generates standard EMVCo payload strings matching Philippine national QRPH formatting specifications.
- `KioskController.Payment` renders an interactive payment gateway view featuring live countdown timers (300 seconds), transaction amount formatting in Philippine Pesos (`₱`), and payment confirmation simulation hooks.
- Upon payment confirmation, `OrderService.ProcessPaymentAsync` transitions order state from `Reserved` to `Paid`, appends the payment ledger, and finalizes stock.

**Notable details:**
Kiosks without expensive cash-acceptor hardware can still safely handle cash customers by leveraging the Staff POS bridge, eliminating the prohibitive hardware costs of traditional ATM-style kiosks.

---

### Hardware-Ready ESC/POS Thermal Receipt & Invoice Generator

**What it does:**
Formats and emits complete tax-compliant receipts, claim tickets, and barcode tokens suitable for 58mm or 80mm ESC/POS thermal printers.

**How it's implemented:**
- Encapsulated in `IReceiptPrinter` and `EscPosReceiptPrinter`.
- Dynamically constructs a `ThermalReceiptModel` containing store header metadata, kiosk station ID, timestamp, line items with variant descriptions, subtotal, and exact 12% Value Added Tax (VAT) computation:
  $$\text{Tax} = \text{Round}\left(\frac{\text{Subtotal} \times 0.12}{1.12}, 2\right)$$
- Emits formatted plain text and raw ESC/POS command sequences (`GenerateEscPosText(Order order)`) with alignment flags, divider rules, and clean typography.
- Exposed via REST endpoint `GET /kiosk/receipt/print/{id}` for direct hardware print-spooler integration.

**Notable details:**
Includes multilingual receipt footers in English and Japanese ("THANK YOU FOR SHOPPING WITH US / お買い上げありがとうございます"), paying homage to iconic Japanese minimalist retail brand standards.

---

### Edge-First Offline Resilience & Reconciliation Engine

**What it does:**
Maintains 100% kiosk operation even if branch internet connectivity completely severs. Orders are written to local storage and automatically synchronized when the connection is restored.

**How it's implemented:**
- Local edge database running SQLite (`sellio_kiosk.db`) caches catalog data and queues offline orders.
- The `InventoryApiController.SyncOfflineOrders` endpoint accepts queued `OfflineSyncOrderDto` batches.
- Orders are processed in strict order of their `ClientTimestamp`.
- If stock is still available, the order is committed and recorded with `Source = OfflineSync`.
- If an oversell conflict occurs (stock was sold by another connected terminal while this terminal was offline), the later order is marked `OversoldConflictAutoCancelled` and flagged for customer/staff resolution.

**Notable details:**
Resolves conflicts based on true client creation time rather than sync-arrival time. This prevents unfair prioritization of devices that happened to reconnect a few seconds earlier.

---

## Data Models & Schema

The relational schema is configured in `SellIoDbContext` with comprehensive indexing, foreign key constraints, and seed data.

```
┌──────────────────┐          ┌───────────────────┐
│     Branch       │          │   ProductStyle    │
├──────────────────┤          ├───────────────────┤
│ Id (PK)          │          │ Id (PK)           │
│ Name             │          │ Name              │
│ Code             │          │ JapaneseName      │
│ TimeZone         │          │ Category          │
│ IsActive         │          │ BasePrice         │
└────────┬─────────┘          │ StyleCode         │
         │                    └─────────┬─────────┘
         │ 1                            │ 1
         │                              │
         │ *                            │ *
┌────────┴─────────┐          ┌─────────┴─────────┐
│   BranchStock    │          │  ProductVariant   │
├──────────────────┤          ├───────────────────┤
│ Id (PK)          │          │ Id (PK)           │
│ BranchId (FK)    │◄─────────┤ ProductStyleId(FK)│
│ ProductVariantId │          │ Size              │
│ QuantityOnHand   │          │ Color / ColorHex  │
│ ReorderThreshold │          │ SKU [UNIQUE]      │
└──────────────────┘          └─────────┬─────────┘
                                        │ 1
                                        │
                                        │ *
                              ┌─────────┴─────────┐
                              │   StockMovement   │
                              ├───────────────────┤
                              │ Id (PK)           │
                              │ BranchId (FK)     │
                              │ ProductVariantId  │
                              │ MovementType      │
                              │ Quantity (+ / -)  │
                              │ ReferenceId       │
                              │ Timestamp (UTC)   │
                              └───────────────────┘

┌──────────────────┐          ┌───────────────────┐
│      Order       │ 1      * │    OrderLine      │
├──────────────────┤─────────►├───────────────────┤
│ Id (PK)          │          │ Id (PK)           │
│ BranchId (FK)    │          │ OrderId (FK)      │
│ OrderNumber      │          │ ProductVariantId  │
│ ClaimNumber      │          │ Quantity          │
│ Status           │          │ UnitPrice         │
│ FulfillmentType  │          └───────────────────┘
│ CreatedAt        │
└────────┬─────────┘
         │ 1
         │ *
┌────────┴─────────┐
│     Payment      │
├──────────────────┤
│ Id (PK)          │
│ OrderId (FK)     │
│ Method           │
│ Amount           │
│ Status           │
│ GatewayReference │
└──────────────────┘
```

### Entity Specifications

#### 1. `Branch`
- **Purpose:** Represents an independent retail store or kiosk station.
- **Key Fields:** `Id` (int, PK), `Name` (string), `Code` (string), `Address` (string), `TimeZone` (string), `IsActive` (bool).
- **Relationships:** One-to-many with `BranchStock`, `StockMovement`, `Order`.

#### 2. `ProductStyle`
- **Purpose:** High-level apparel garment style catalog definition.
- **Key Fields:** `Id` (int, PK), `Name` (string), `JapaneseName` (string), `Category` (string), `Description` (string), `BasePrice` (decimal), `Currency` (string), `PrimaryImageUrl` (string), `GalleryImagesJson` (string), `StyleCode` (string), `LocationHint` (string), `FabricDetail` (string).
- **Relationships:** One-to-many with `ProductVariant`.

#### 3. `ProductVariant`
- **Purpose:** The concrete sellable apparel SKU representing a unique Size, Color, and Style combination.
- **Key Fields:** `Id` (int, PK), `ProductStyleId` (int, FK), `Size` (string), `Color` (string), `ColorHex` (string), `SKU` (string, Unique Index), `DesignCode` (string), `PriceOverride` (decimal?).
- **Relationships:** Belongs to `ProductStyle`; one-to-many with `BranchStock`, `OrderLine`, `StockMovement`.

#### 4. `BranchStock`
- **Purpose:** High-performance derived cache storing current on-hand inventory per branch.
- **Key Fields:** `Id` (int, PK), `BranchId` (int, FK), `ProductVariantId` (int, FK), `QuantityOnHand` (int), `ReorderThreshold` (int), `LastUpdatedAt` (DateTime).
- **Constraints:** Unique composite index on `(BranchId, ProductVariantId)`.

#### 5. `StockMovement` (Source of Truth Ledger)
- **Purpose:** Immutable audit ledger capturing every inventory modification across time.
- **Key Fields:** `Id` (int, PK), `BranchId` (int), `ProductVariantId` (int), `MovementType` (enum: `StockIn`, `Sale`, `Reservation`, `ReservationRelease`, `Adjustment`, `TransferOut`, `TransferIn`), `Quantity` (int, signed delta), `ReferenceId` (string, e.g., Order ID or Batch Ref), `PerformedByUserId` (string), `Timestamp` (DateTime UTC), `Notes` (string).

#### 6. `Order`
- **Purpose:** Represents an end-user purchase transaction.
- **Key Fields:** `Id` (int, PK), `BranchId` (int), `OrderNumber` (string, unique invoice identifier), `ClaimNumber` (string, short queue code), `Channel` (enum: `Kiosk`, `StaffPOS`), `FulfillmentType` (enum: `SelfFetch`, `StaffAssist`), `Status` (enum: `Draft`, `Reserved`, `Paid`, `Completed`, `Cancelled`), `ReservationKey` (string?), `ReservationExpiresAt` (DateTime?), `CreatedAt` (DateTime), `CompletedAt` (DateTime?).
- **Relationships:** One-to-many with `OrderLine` and `Payment`.

#### 7. `OrderLine`
- **Purpose:** Individual variant items and quantities within an order.
- **Key Fields:** `Id` (int, PK), `OrderId` (int, FK), `ProductVariantId` (int, FK), `Quantity` (int), `UnitPrice` (decimal), `DiscountAmount` (decimal).

#### 8. `Payment`
- **Purpose:** Payment transaction details and gateway authorization tokens.
- **Key Fields:** `Id` (int, PK), `OrderId` (int, FK), `Method` (enum: `Cash`, `QRPH`, `BankTransfer`, `CreditCard`), `Amount` (decimal), `Status` (enum: `Pending`, `Success`, `Failed`, `Refunded`), `GatewayReference` (string), `CreatedAt` (DateTime), `ConfirmedAt` (DateTime?).

---

## API & Endpoints

The system exposes RESTful and WebSocket endpoints consumed by kiosks, external sync agents, and mobile management clients.

| Method | Endpoint / Operation                                          | Description                                                                              | Auth Required |
|--------|---------------------------------------------------------------|------------------------------------------------------------------------------------------|---------------|
| `GET`  | `/` or `/kiosk/index`                                         | Serves Kiosk Screen 01: Landing attract screen with store attribution and sync status     | No            |
| `GET`  | `/kiosk/catalog?category={cat}`                               | Serves Kiosk Screen 02: Category browser with live computed variant stock                | No            |
| `GET`  | `/kiosk/customize/{id}`                                       | Serves Kiosk Screen 03: Product customization view with dynamic size/color matrix       | No            |
| `POST` | `/kiosk/cart/add`                                             | Reserves variant stock and adds item to session cart                                     | No (Session)  |
| `POST` | `/kiosk/cart/remove`                                          | Releases reservation and removes item from session cart                                  | No (Session)  |
| `POST` | `/kiosk/cart/clear`                                           | Clears cart and releases all held stock locks                                            | No (Session)  |
| `GET`  | `/kiosk/fulfillment`                                         | Serves Kiosk Screen 04: Fulfillment selector (Self-Fetch vs. Staff-Assist)               | No (Session)  |
| `POST` | `/kiosk/fulfillment`                                         | Commits fulfillment preference and transitions order to payment phase                    | No (Session)  |
| `GET`  | `/kiosk/payment?method={method}`                              | Serves Kiosk Screen 05: Generates dynamic EMVCo QRPH or bank intent                      | No (Session)  |
| `POST` | `/kiosk/payment/process`                                      | Finalizes transaction, writes sale ledger, updates stock, and triggers confirmation      | No (Session)  |
| `GET`  | `/kiosk/confirmation/{id}`                                    | Serves Kiosk Screen 06: Order confirmation, barcode token, and printable receipt        | No            |
| `GET`  | `/kiosk/receipt/print/{id}`                                   | Generates raw ESC/POS formatted receipt text stream for thermal printers                 | No            |
| `GET`  | `/api/branches/{branchId}/variants/{variantId}/stock`         | API: Queries real-time effective available stock for a specific SKU                     | No / Internal |
| `GET`  | `/api/branches/{branchId}/styles/{styleId}/stock`             | API: Queries stock matrix for all variants under a style                                 | No / Internal |
| `POST` | `/api/branches/{branchId}/offline-sync`                       | API: Reconciles offline order queues upon network reconnection with conflict handling   | Yes (Device)  |
| `WSS`  | `/hubs/stock`                                                 | SignalR Hub: Real-time stock change broadcasting via WebSocket channel                  | No            |

### Example: Offline Sync Payload Shape

```json
// POST /api/branches/1/offline-sync
[
  {
    "clientOrderId": "d3b07384-d113-46fb-9c9e-5e365022830f",
    "clientTimestamp": "2026-09-08T07:15:30Z",
    "branchId": 1,
    "fulfillmentType": 0,
    "items": [
      {
        "variantId": 2,
        "quantity": 1,
        "unitPrice": 790.00
      }
    ],
    "totalAmount": 790.00,
    "cashierNotes": "Offline cash order at Kiosk 04"
  }
]
```

### Example: Offline Sync Response

```json
[
  {
    "clientOrderId": "d3b07384-d113-46fb-9c9e-5e365022830f",
    "success": true,
    "status": "Committed",
    "reason": null
  }
]
```

---

## Authentication & Security

- **Session Isolation & Tamper Resistance:** Kiosk customer interactions are isolated via ASP.NET Core essential session cookies (`KioskSessionService`) configured with `HttpOnly = true`, `SameSite = Strict`, and an idle timeout of 4 hours. No personally identifiable customer information (PII) is stored on the physical kiosk machine.
- **Row-Level Branch Isolation:** All operational queries (`BranchStock`, `StockMovement`, `Orders`) are strictly filtered by `BranchId`. Cross-branch data leakage is prevented at the query level.
- **Idempotency & Replay Protection:** Orders synchronized from offline queues utilize client-generated GUIDs (`ClientOrderId`), ensuring that network retries or duplicate sync attempts can never result in double-charging or duplicate inventory decrements.
- **Sandboxed Hardware Printing:** The print service emits ESC/POS byte streams via local socket communication, sanitizing string inputs to prevent printer control injection attacks.
- **Payment Tokenization:** Credit card and e-wallet credentials are never handled or stored directly on Sell.io servers; all transactions leverage tokenized references and signed webhooks provided by PayMongo.

---

## Performance & Optimization

- **Composite Database Indexing:** Relational queries are optimized through targeted unique composite indexes:
  - `BranchStock`: `IX_BranchStocks_BranchId_ProductVariantId` (Unique)
  - `ProductVariant`: `IX_ProductVariants_SKU` (Unique)
  - `Order`: Indexed on `CreatedAt`, `OrderNumber`, and `ClaimNumber` for sub-millisecond retrieval.
- **Asynchronous Non-Blocking I/O:** Every database interaction across EF Core (`SaveChangesAsync`, `ToListAsync`, `FirstOrDefaultAsync`) and SignalR socket broadcasts is strictly asynchronous, preventing thread-pool starvation during high-concurrency checkout bursts.
- **In-Memory Lock Evaluation:** Calculating variant availability does not trigger heavy relational database table locks. Instead, `IStockReservationStore` resolves active reservations in memory in $\mathcal{O}(1)$ time, calculating:
  $$\text{AvailableStock} = \max(0, \text{QuantityOnHand} - \text{ActiveReservations})$$
- **SignalR Group Partitioning:** Kiosk clients subscribe exclusively to their store's specific broadcast group (`Branch_{branchId}`), eliminating extraneous network serialization across multi-store deployments.
- **Optimized Asset Delivery:** Product visuals are hosted on low-latency CDNs, with CSS and layout rendering optimized for 60fps responsiveness on industrial touchscreen hardware.

---

## UI/UX Design: Japanese Modernist Aesthetic

The frontend of Sell.io is inspired by **Japanese Modernist retail design standards** (emulating the aesthetic of Uniqlo, Muji, and Issey Miyake), pairing high-contrast functional typography with warm neutral backgrounds and tactile interactive controls.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SELL.IO                                          SHIBUYA FLAGSHIP / KIOSK 04│
│  [SHIRTS & TEES]  [BOTTOMS]  [OUTERWEAR]  [INNERWEAR]        [ CART: 2 ITEMS ]│
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  AIRism Cotton Oversized Crew Neck T-Shirt     │
│  │                         │  エアリズムコットンオーバーサイズTシャツ       │
│  │                         │  ITEM #452901 • AISLE 04 • RACK B               │
│  │       [PRODUCT]         │  PHP 790.00                                     │
│  │        [IMAGE]          │                                                 │
│  │                         │  COLOR: [Off White] [Black] [Olive] [Navy]      │
│  │                         │  SIZE:  [XS: 4]  [S: 12]  [M: 19]  [L: 2 LEFT]  │
│  └─────────────────────────┘                                                 │
│                               [ ADD TO BAG ]       [ QUICK BUY NOW ]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Visual Palette & Typography:**
  - Backgrounds: Warm editorial alabaster (`#FBFBF9`), card surfaces (`#FFFFFF`), dark slate headers (`#111111`).
  - Accents: Uniqlo signature crimson (`#EC0000`) for badges and callouts, muted olive (`#2D3E32`), deep indigo (`#1D2434`).
  - Typography: Scaled pairings of **Space Grotesk** for technical codes and pricing, **Inter** for clean UI labels, and **Noto Sans JP** for Japanese bilingual product descriptions.
- **Touchscreen Usability:**
  - Large 48px+ tap targets engineered for kiosk screens.
  - Large color swatch selectors displaying actual fabric hex codes.
  - Inventory awareness badges ("LOW STOCK: 2 LEFT", "SOLD OUT") directly on the size selector pills.
- **Tactile Transitions:**
  - Real-time cart drawer animation sliding from the right screen edge.
  - Countdown timer progress rings for pending payments.
  - Instant claim-ticket receipt preview with high-fidelity monospace ticket rendering.

---

## Challenges & Solutions

### Challenge 1: Ghost Inventory & Variant Overselling Under High Traffic
**Problem:** In apparel retail, multiple shoppers frequently attempt to buy the same limited-edition item and size simultaneously. Standard database reads would report stock as available, allowing multiple customers to pay, resulting in painful order cancellations.
**Solution:** Designed and implemented a Two-Phase Distributed Reservation system via `IStockReservationStore`. Before allowing a user to proceed to payment, the system places an atomic 5-minute TTL lock on the SKU. If payment completes, the lock is committed to a `Sale` ledger record; if the session is abandoned, the reservation cleanly self-expires, guaranteeing zero overselling without database row locking.

### Challenge 2: Total Dependency on Cloud Connectivity at the Store Edge
**Problem:** Retail store internet connections are vulnerable to local ISP drops. If checkout halts during an outage, store revenue freezes and lines form.
**Solution:** Built a local-first edge architecture utilizing EF Core with SQLite (`sellio_kiosk.db`) running directly on the kiosk station. Kiosks seamlessly transition to offline mode during disconnects, accept cash/staff-assist orders against the local stock snapshot, and queue transactions. Upon reconnection, `InventoryApiController.SyncOfflineOrders` automatically reconciles queued sales against cloud headquarters in strict client-timestamp order.

### Challenge 3: In-Store Inventory Ledger Drift
**Problem:** Direct `UPDATE` operations on inventory counts inevitably drift over time due to cancelled orders, returns, and untracked adjustments, leaving store managers unable to explain missing inventory.
**Solution:** Instituted a strict domain rule: `StockMovement` is the sole immutable source of truth. Every inventory delta is recorded as an append-only ledger transaction with a timestamp, movement type, reference ID, and user/station attribution. `BranchStock.QuantityOnHand` is strictly treated as a derived read cache, enabling complete historical auditing and trivial reconciliation.

---

## What I Learned / Reflections

- **Elegance of Append-Only Ledgers:** Transitioning from simple stock counters to an event-driven, append-only stock movement ledger completely changes system reliability. It turns debugging from guessing into simple ledger replay.
- **Pragmatic Edge Computing:** Building resilient edge software requires accepting that two data stores (cloud SQL and edge SQLite) must coexist. Designing conflict resolution rules around client timestamps upfront is essential to prevent edge-case race conditions during reconnections.
- **Cost-Staging as a First-Class Architecture Requirement:** Software architecture should respect commercial realities. Designing clean interface abstractions (`IStockReservationStore`, `IPaymentGateway`) allowed running the entire system on free/serverless developer tiers without compromising the system's ability to switch to Redis and clustered enterprise cloud infrastructure later with simple configuration changes.

---

## Future Improvements

- **RFID Intelligent Shelf Sensing:** Integrate ultra-high frequency (UHF) RFID reader middleware to automatically detect when a customer picks up a garment from physical store racks.
- **Self-Service Cash Acceptor Hardware Integration:** Interface directly with bill/coin acceptor hardware modules via RS-232 serial protocols to enable automated cash payments without staff intervention.
- **Cross-Branch Stock Reservation ("Endless Aisle"):** Allow customers browsing at Branch A to reserve and ship out-of-stock sizes directly from Branch B or a central fulfillment warehouse.
- **Staff Mobile Inventory Auditing App:** A companion mobile application for floor associates to conduct barcode inventory cycle counts and initiate stock adjustments directly from the sales floor.

---

## Project Status

- **Status:** Production-Ready Architectural Reference & Working Prototype
- **Repository:** `https://github.com/sheila-brown/sell-io` *(Placeholder)*
- **Live Demo / Showcase:** `https://sellio-kiosk.azurewebsites.net` *(Placeholder)*
- **Core Engineering Timeline:** Q3 2026
- **Lead Architect:** Senior Technical Writer & Software Systems Architect
