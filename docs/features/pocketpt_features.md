# PocketPT

## Overview

PocketPT is an AI-powered physical rehabilitation assistant that enables users to perform and track physical therapy routines directly from their mobile devices. It solves the problem of inaccessible or expensive physical therapy by providing on-device Range of Motion (AROM) assessments and intelligently generating personalized, evolving rehabilitation plans. Designed for individuals recovering from muscular or joint injuries, it provides a guided, medically informed recovery process. What makes PocketPT technically notable is its integration of on-device Google ML Kit Pose Detection alongside custom ONNX pain recognition models, paired with an offline-first architecture that functions fully without internet access. The outcome is a robust, privacy-preserving telehealth application that democratizes access to basic physical therapy guidance.

---

## ✦ Key Highlights

- **On-Device AI Assessment:** Utilizes Google ML Kit Pose Detection and a custom ONNX model (`pain_recognition_model.onnx`) to perform live, on-device Active Range of Motion (AROM) and pain assessments without relying on cloud processing.
- **Offline-First Architecture:** Engineered with Hive for robust local data persistence and a dedicated Guest Mode, ensuring full application functionality in zero-connectivity environments.
- **Dynamic Plan Generation:** Features a deterministic rules engine that synthesizes user assessment data (pain duration, level, affected muscles) to automatically generate personalized, week-by-week rehabilitation and treatment plans.
- **Robust State Management:** Leverages Riverpod for highly scalable, reactive state management across complex data flows, including live AI feedback and asynchronous Firebase syncing.
- **Medical Design System:** Implements a custom, accessible UI/UX theme optimized for healthcare contexts, featuring specialized dark mode support and staggered animations for reduced cognitive load.
- **Cross-Platform Readiness:** Built with Flutter, targeting Android, iOS, and Web with platform-specific optimizations (e.g., conditional web-offline stubs and native channel implementations for ONNX).

---

## Tech Stack

| Category             | Technologies                                      |
|----------------------|---------------------------------------------------|
| Language(s)          | Dart, Python (for ML model training)              |
| Frontend             | Flutter (Riverpod, Google Fonts)                  |
| Backend / Cloud      | Firebase (Auth, Cloud Firestore)                  |
| AI & Machine Learning| Google ML Kit Pose Detection, ONNX Runtime        |
| Local Storage        | Hive, Flutter Secure Storage, Shared Preferences  |
| Analytics & Reports  | fl_chart, pdf, printing, csv                      |
| UI / Animations      | Lottie, simple_animations, tutorial_coach_mark    |

---

## System Architecture

PocketPT is structured as a **client-side heavy, offline-first mobile application** using a modular architecture.

- **Frontend Layer:** Built in Flutter, utilizing Riverpod for reactive state management. The UI is separated into domain-specific modules (assessment, dashboard, exercise, AI).
- **Data & Persistence Layer:** The system prioritizes local storage using **Hive** as the primary source of truth. Data (`UserAssess`, `RehabilitationPlan`, `DailyProgress`) is written to Hive first to ensure immediate, offline availability.
- **Sync & Cloud Layer:** A background `DataSyncService` handles synchronization with Firebase Cloud Firestore. When an internet connection is available and the user is authenticated, local Hive data is synced to the cloud, resolving conflicts and ensuring cross-device continuity.
- **AI/ML Layer:** The AI assessment pipeline runs entirely on-device. The device camera feeds frames to Google ML Kit for pose detection, extracting skeletal landmarks. These landmarks are passed to a local ONNX model for pain and motion analysis, processing frame-by-frame data without network latency.

---

## Features & Implementations

### AI Range of Motion (AROM) Assessment

**What it does:**
Allows users to perform guided physical assessments using their device's camera, evaluating joint mobility and detecting pain points in real-time.

**How it's implemented:**
Integrates `camera` and `google_mlkit_pose_detection` to capture and process live video frames. Pose data is extracted and passed to a native ONNX Runtime instance for inference. The app maps specific muscle groups to localized video instructions (`local_muscle_video_player.dart`) to guide the user during the assessment.

**Notable details:**
Processing ML models frame-by-frame on mobile devices can cause severe UI jank. PocketPT mitigates this by running inference in optimized platform channels and aggressively managing memory via custom `imageCache` limits, ensuring smooth rendering even on lower-end devices.

---

### Automated Rehabilitation Plan Generation

**What it does:**
Automatically synthesizes user assessment data to create a tailored, progressive treatment and exercise plan.

**How it's implemented:**
The `generate_plan.dart` service evaluates the user's reported pain scale, pain duration, and specific muscle injuries (`UserAssess` hive model). Based on a deterministic rules engine and CSV-backed exercise references, it outputs a customized `RehabilitationPlan`.

**Notable details:**
The system handles critical medical edge cases gracefully. For example, if a user reports "Severe" pain or an injury "Less than 48 hours ago," the algorithm explicitly blocks exercise generation and restricts the plan strictly to passive treatments, prioritizing patient safety.

---

### Offline-First Data Synchronization

**What it does:**
Ensures the app remains 100% functional without an internet connection, seamlessly syncing data to the cloud when connectivity is restored.

**How it's implemented:**
Utilizes `Hive` for NoSQL local storage with registered type adapters (`HiveDailyProgressAdapter`, `HiveRehabilitationPlanAdapter`, etc.). The `DataPersistenceService` orchestrates saving data locally, while `DataSyncService` monitors network state and authentication to push/pull from Firebase Firestore.

**Notable details:**
Includes a dedicated Web-Offline stub (`web_offline.dart`) and Guest Mode, allowing users to bypass Firebase initialization entirely if they wish to use the app anonymously or offline, demonstrating a high degree of architectural flexibility.

---

### Dynamic Reports and Analytics

**What it does:**
Visualizes the user's recovery progress over time, generating interactive charts and exportable PDF reports for healthcare providers.

**How it's implemented:**
Utilizes `fl_chart` for rendering interactive progress graphs based on `DailyProgress` and `ExerciseHistory` data from Hive. The `pdf` and `printing` packages allow the app to compile this data into beautifully formatted documents.

**Notable details:**
Data is aggregated and rendered securely on-device before being formatted into a PDF, ensuring that sensitive health data does not need to be sent to a third-party document generation server.

---

## Data Models & Schema

- **UserDetails:** Core profile data, authentication state, and guest status flags.
- **UserAssess:** Stores the user's active assessment inputs (specific muscle, pain level, pain duration, pain type, rehab goal).
- **RehabilitationPlan:** Contains the structured week-by-week plan, linking to multiple `ExerciseReference` and `TreatmentReference` entities.
- **DailyProgress / UserProgress:** Tracks daily completion of exercises, pain levels, and consistency streaks, enabling the analytics dashboard.
- **ExerciseHistory & PainHistory:** Time-series logs of completed sessions and pain fluctuations over the recovery period.

---

## API & Endpoints *(if applicable)*

*N/A - PocketPT is an offline-first application relying on Firebase SDKs rather than exposing a traditional REST API. Cloud synchronization is handled via direct Firestore document references.*

---

## Authentication & Security

- **Authentication:** Managed via `firebase_auth` supporting Google Sign-In and standard email/password authentication.
- **Guest Mode:** A custom offline Guest Session allows users to bypass authentication entirely, storing all data purely locally via Hive.
- **Data Protection:** Implements `flutter_secure_storage` for sensitive credentials and encrypts critical on-device data. Firestore rules (`firestore.rules`) strictly limit read/write access to ensure users can only access their own document paths.

---

## Performance & Optimization

- **Image Caching:** The global `imageCache` is artificially constrained (`maximumSize = 200`, `maximumSizeBytes = 50MB`) within `main.dart` to prevent Out Of Memory (OOM) crashes on low-end devices during heavy image/video loading.
- **Lazy Loading:** Aggressive background preloaders were intentionally removed in favor of a lazy-loading architecture, deferring heavy data hydration until the Dashboard is actively rendered.
- **Frame Timing Profiling:** Integrates a custom lightweight `SchedulerBinding` callback to monitor frame timings (budget < 16ms), flagging jank during thesis measurements and ML inference.

---

## UI/UX Design

- **Medical Design System:** Built with a custom, accessible color palette (`kMainColor` as a Muscular Maroon, `kBackgroundColor` as a clinical Light Gray).
- **Typography:** Employs `Poppins` for strong, legible headings and `PT Sans` for highly readable body text, specifically chosen for visual accessibility.
- **Guided Onboarding:** Integrates `tutorial_coach_mark` and `showcaseview` to provide interactive, contextual walkthroughs for new users navigating complex medical interfaces.

---

## Challenges & Solutions

**Challenge:** Running complex pose estimation and ONNX models on mobile devices caused severe UI freezing and skipped frames.
**Solution:** Offloaded ML inference to native platform channels and optimized the Flutter rendering pipeline. Implemented an `AppScrollBehavior` that removes default overscroll glows to reduce unnecessary layer repainting during heavy computation.

**Challenge:** Handling user data safely when transitioning between offline and online states, or between Guest and Authenticated users.
**Solution:** Developed a multi-layered `DataPersistenceService`. It forces immediate writes to Hive for durability, and uses a queued `DataSyncService` that defers Firebase writes until a stable connection is confirmed, ensuring zero data loss during transitions.

---

## What I Learned / Reflections

- Mastered the complexities of integrating heavy C++ based ML models (ONNX) into a Flutter application using native platform channels.
- Gained a deep appreciation for offline-first architectures; implementing Hive as a local source of truth significantly improved the app's perceived performance and reliability over direct cloud reads.
- Learned to balance medical safety with UX, implementing strict safeguards (e.g., blocking exercise generation for severe, acute injuries) to prioritize user well-being above engagement metrics.

---

## Project Status

- **Status:** Development / Research Project
- **Live URL:** N/A
- **Repository:** Private / Thesis Context
- **Date / Timeline:** 2026
