# IIST High School Registrar System

## Overview
The IIST High School Registrar System is a centralized, web-based document requisition platform designed to digitize and streamline the request process for vital school records. Built for students, parents, and school administrators, it replaces manual paperwork with an online portal for requesting Form 137, Form 138, Certificates of Good Moral Character, and other essential documents. By providing real-time status tracking and integrated payment proof uploads, the system significantly reduces administrative overhead and improves service delivery efficiency for the school's registrar office.

---

## ✦ Key Highlights
- **Centralized Document Requisition:** Digitizes the request workflow for 7 distinct types of high school documents into a single, accessible portal.
- **Role-Based Portals:** Features distinct dashboards and access controls for administrators and clients (students/parents).
- **Real-Time Request Tracking:** Enables administrators to update document statuses (Processing, Invalid, Ready, Claim) which reflect immediately for clients.
- **Digital Payment Integration:** Supports uploading authorization letters or digital payment proofs (e.g., GCash, PayMaya receipts) for paid document requests.
- **Relational Data Management:** Utilizes a structured MySQL database architecture with dedicated tables for each document type to ensure organized data handling.
- **Intuitive User Interface:** Employs a clean, responsive UI built with Bootstrap and FontAwesome for maximum accessibility.

---

## Tech Stack

| Category             | Technologies                          |
|----------------------|---------------------------------------|
| Language(s)          | PHP 7.2.12, HTML5, CSS3, JavaScript   |
| Frontend             | Bootstrap 3.3.7, FontAwesome 5.7.2    |
| Backend              | PHP (Procedural)                      |
| Database             | MySQL (MariaDB 10.1.37)               |
| DevOps & Infra       | Apache (XAMPP Environment)            |

---

## System Architecture

The system employs a classic, monolithic Client-Server architecture built with procedural PHP. 

- **Structure:** The presentation layer (HTML/CSS) is tightly coupled with the backend business logic (PHP scripts) within individual pages.
- **Communication:** The browser communicates directly with the PHP backend via standard HTTP POST and GET requests during form submissions and state updates.
- **Data Flow:** When a user submits a document request, the POST data is processed by dedicated handler scripts (e.g., `form137_add.php`), which establish a database connection via `mysqli` and insert the record into the appropriate MySQL table. Administrators then retrieve this data on their dashboard (`request.php`) and can trigger state changes via parameter-driven GET requests to status-updating scripts.
- **Design Decisions:** A monolithic, procedural approach was chosen for rapid development and straightforward deployment in a standard LAMP/XAMPP stack environment.

---

## Features & Implementations

### User & Admin Authentication
**What it does:**
Secures the system by requiring users and administrators to log in to access their respective dashboards and functionalities.

**How it's implemented:**
Authentication is handled via HTML forms that submit POST requests to `login.php` or `adminlog.php`. The backend queries the `users` or `admin` MySQL tables using procedural `mysqli_query` functions. State management is maintained across pages using PHP's native `$_SESSION` variables.

**Notable details:**
The system effectively isolates administrative functions from client functions by routing successful logins to entirely different dashboard views (`home.php` vs. `a_home.php`), ensuring strict boundary control.

---

### Comprehensive Document Requisition Workflow
**What it does:**
Enables students or parents to submit formal requests for various school documents, including Form 137, Form 138, Good Moral Certificates, ESC Certifications, Enrollment/Graduation Certificates, and ID Replacements.

**How it's implemented:**
Each document type features a dedicated user-facing PHP form (e.g., `form137.php`). Upon submission, corresponding processing scripts (e.g., `form137_add.php`) validate the input and execute SQL `INSERT` statements to store the request details in dedicated database tables. The forms include fields for specifying payment methods and handling file uploads for authorization.

**Notable details:**
By creating distinct forms and processing pipelines for each document type, the system handles varying data requirements without creating a sparse, over-complicated unified database table.

---

### Centralized Admin Request Tracking
**What it does:**
Provides administrators with a unified view of all pending document requests across all categories, allowing them to process and update the status of each request.

**How it's implemented:**
The `request.php` admin dashboard executes `SELECT` queries across all document tables and renders the data in a comprehensive HTML table. Each record includes action links pointing to specific state-transition scripts located in the `/Status` directory (e.g., `process1.php`, `ready1.php`). These scripts use the record's `id` passed via the URL query string to execute an `UPDATE` query on the `status` column.

**Notable details:**
The modularization of state-transition logic into separate, highly-focused scripts ensures that the main dashboard code remains clean and the status update actions are stateless and deterministic.

---

## Data Models & Schema

The database (`registrar`) is structured relationally to separate core entities from request transactions:

- **`users` and `admin` Tables:** 
  - **Purpose:** Store user and administrator credentials and profiles.
  - **Key Fields:** `firstname`, `lastname`, `email`, `contact`, `lrn`, `username`, `password`, `usertype`.
- **Document Request Tables (`form137`, `form138`, `goodmoral`, `esc`, `enrollment`, `graduation`, `id`):**
  - **Purpose:** Store specific transactional data for each type of document request.
  - **Key Fields:** `username` (foreign key reference to the client), `date`, `schoolyear`, `grade`, `section`, `reason`, `pay` (payment details), `authorize` (file path for uploaded proofs), and `status` (Processing, Invalid, Sent!, Ready, Claim).

---

## Authentication & Security

- **Authentication:** Managed natively via PHP sessions (`session_start()`). The system checks for the presence of specific session variables before granting access to protected pages.
- **Access Control:** Enforced through role-based routing upon login, preventing standard users from accessing administrative endpoints.

---

## Performance & Optimization

- **Lightweight Execution:** The procedural PHP architecture ensures minimal overhead and rapid server-side rendering, making the system highly responsive even on low-resource hosting environments.
- **Optimized Data Retrieval:** Storing different document requests in dedicated tables prevents the performance degradation that can occur with single, massive, sparse transaction tables.

---

## UI/UX Design

- **Visual Language:** The application utilizes a professional, academic visual theme anchored by custom CSS (`style.css`, `style3.css`) and background imagery.
- **Component Library:** Integrates Bootstrap 3.3.7 to provide responsive, accessible grid layouts and UI components like alerts and buttons.
- **Iconography:** Employs FontAwesome 5.7.2 to provide intuitive visual cues across navigation menus and dashboard tables, enhancing user scannability.

---

## Challenges & Solutions

**Challenge:** Handling differing data and proof-of-payment requirements across various document types.  
**Solution:** Rather than forcing all requests into a single, complex database table with numerous nullable fields, the architecture implements distinct tables and processing pipelines for each document type. This localized the logic and ensured data integrity for each specific form.

**Challenge:** Managing the lifecycle and state transitions of requests efficiently.  
**Solution:** Implemented a standardized `status` column across all document tables and created a suite of modular, single-purpose scripts in the `/Status` directory. This allowed administrators to update request states via simple, intuitive hyperlink clicks directly from their dashboard.

---

## Future Improvements

- **Security Hardening:** Implement modern password hashing mechanisms (e.g., `password_hash()`) to replace plaintext credential storage and utilize prepared statements to prevent SQL injection.
- **Database Normalization:** Consolidate the disparate document request tables into a unified `requests` table utilizing a `document_type` enumerator and a JSON column for type-specific metadata.
- **Architectural Refactoring:** Migrate the procedural PHP codebase to a modern MVC framework (like Laravel or CodeIgniter) to improve maintainability and separation of concerns.

---

## Project Status

- **Status:** Archived / Proof of Concept
- **Tech Focus:** Procedural PHP, Relational Database Design, UI Implementation
