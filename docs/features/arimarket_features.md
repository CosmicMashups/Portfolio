# AriMarket

## Overview

AriMarket is an AI-driven commodity price prediction and market analysis platform designed to help buyers, traders, and financial analysts make informed purchasing decisions. By utilizing historical data to forecast future commodity prices, the platform enables users to optimize their purchases and avoid overpaying in volatile markets. What makes AriMarket technically notable is its seamless integration of a responsive frontend, a PHP/MySQL backend, and a Python-powered machine learning pipeline—including ARIMA models for price forecasting and an NLP-based sentiment analysis engine for user feedback. The result is a fast, data-dense, and highly immersive dashboard that operates with the precision of a professional financial tool.

---

## ✦ Key Highlights

- **Predictive Market Analytics:** Employs trained ARIMA (AutoRegressive Integrated Moving Average) models to forecast the average, high, and low prices of various commodities.
- **Static API Optimization:** Bypasses live inference latency by precomputing price predictions via Jupyter Notebooks and serving them as static, heavily optimized JSON files to the frontend.
- **NLP Sentiment Analysis Integration:** Features a contact form that pipes user messages into a Python/Scikit-learn model to analyze user sentiment (positive/negative) and dynamically adapts the UI dialog responses based on the results.
- **Interactive Financial Visualizations:** Utilizes Chart.js with custom financial controllers to render candlestick-style and time-series charts for granular market insights.
- **Futuristic "Command Center" UI:** Delivers a highly technical, high-contrast dark-mode-first aesthetic with dynamic micro-animations (via particles.js) and monospaced typography.
- **Hybrid Polyglot Architecture:** Successfully orchestrates HTML/Vanilla JS on the frontend, PHP/MySQL for server-side state, and Python for data science and machine learning tasks.

---

## Tech Stack

| Category             | Technologies                          |
|----------------------|---------------------------------------|
| Languages            | JavaScript (Vanilla), PHP, Python, HTML5, CSS3 |
| Frontend             | Chart.js, Particles.js, FontAwesome   |
| Backend              | PHP 8.x                               |
| Database             | MySQL                                 |
| Machine Learning     | Python, Scikit-learn, NLTK, Joblib, Jupyter Notebooks |
| Forecasting Models   | ARIMA (AutoRegressive Integrated Moving Average) |
| Architecture         | MVC-inspired, Static JSON serving     |

---

## System Architecture

AriMarket operates on a hybrid architecture that separates heavy data-science workloads from the live user experience:
- **Frontend Layer:** A lightweight, Vanilla JavaScript and HTML/CSS structure that acts as a Single Page Application (SPA) dashboard. It consumes static JSON files asynchronously to plot data.
- **Pre-computed ML Pipeline:** Instead of running expensive machine learning predictions live, Python scripts and Jupyter Notebooks extract data, run ARIMA models, and generate `.json` files (e.g., `tomato.json`, `beef_brisket.json`) that contain historical and forecasted prices. 
- **Backend / Operational Layer:** PHP handles form submissions and session management. When a user submits a contact form, the PHP script asynchronously executes a Python NLP script (`sentiment.py`), waits for the output, and logs the parsed sentiment directly into a MySQL database before returning a personalized UI response.

---

## Features & Implementations

### Real-Time Price Dashboard & Financial Charts

**What it does:**
Displays the latest prices for various market commodities (meat, fish, rice, fruits, vegetables) and visualizes historical/predicted trends using candlestick and line graphs.

**How it's implemented:**
Vanilla JavaScript uses the Fetch API to asynchronously pull pre-generated JSON files mapping dates to `average_prices`, `high_prices`, and `low_prices`. The data is then parsed and fed into `Chart.js`, which leverages a custom `chartjs_financial.js` controller to render complex financial charts (OHLC/Candlestick) seamlessly on the canvas.

**Notable details:**
To ensure zero lag on the dashboard, live ML inference is completely avoided. The prices are strictly read from precomputed JSON datasets, ensuring the UI remains crisp and responsive regardless of how complex the underlying ARIMA model parameters are.

---

### AI-Powered User Sentiment Analysis

**What it does:**
Evaluates the emotional tone of user feedback submitted through the "Contact Us" form and tailors the automated response dialog based on whether the feedback is positive or negative.

**How it's implemented:**
When the HTML form is submitted, a PHP script (`connect.php`) intercepts the POST request. It uses `exec()` to pass the user's message to a Python script (`sentiment.py`). The Python script utilizes `NLTK` for tokenization and stop-word removal, and a pre-trained `Scikit-learn` model (loaded via `joblib`) to classify the text. The PHP script continuously checks for the output file, reads the sentiment, and saves it to a MySQL database alongside the user's details.

**Notable details:**
This feature bridges a traditional PHP backend with a modern Python NLP stack. To prevent blocking the main thread indefinitely, the PHP script uses a lightweight polling mechanism (`sleep(3)` with a maximum of 10 attempts) to wait for the Python script's execution to complete.

---

### Dynamic Theming & "Command Center" UI

**What it does:**
Provides a dense, highly structured visual environment suitable for financial analysts, complete with a dark mode toggle and dynamic background particles.

**How it's implemented:**
Built using Vanilla CSS and CSS variables. A JavaScript event listener toggles a `dark-mode` class on the root element, which dynamically swaps the CSS variables for backgrounds, text, and accent colors (e.g., Bullish Green and Bearish Red). `particles.js` is implemented in the background to give a subtle, floating geometric aesthetic.

**Notable details:**
The design relies heavily on monospaced fonts for numerical data to ensure alignment in tables and charts, replicating the exact feel of a professional Bloomberg terminal or trading software.

---

## Data Models & Schema

The primary live database usage revolves around user interactions, while market data is handled via document-style JSON arrays.

### `contacts` Table
- **Purpose:** Stores user feedback, inquiries, and the AI-analyzed sentiment of their message.
- **Fields:**
  - `id` (INT, Primary Key, Auto-Increment)
  - `name` (VARCHAR): User's provided name.
  - `email` (VARCHAR): User's email address.
  - `concern` (TEXT): The actual message or feedback.
  - `sentiment` (VARCHAR): The result from the Python NLP model (e.g., "positive" or "negative").

---

## API & Endpoints

While the project does not expose a traditional RESTful API for external consumption, its internal architecture mimics a static API through JSON files:

| Method | Endpoint / Operation        | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| GET    | `/json/{commodity_name}.json` | Returns arrays of dates, high, low, and average prices for rendering charts. |
| POST   | `/php/connect.php`          | Accepts form-data (`name`, `email`, `concern`), triggers NLP script, and returns a session-based UI dialog. |

---

## Authentication & Security

- **Input Sanitization:** The PHP backend heavily sanitizes inputs using `htmlspecialchars()` and `filter_var(..., FILTER_SANITIZE_EMAIL)` to prevent Cross-Site Scripting (XSS).
- **SQL Injection Prevention:** All database transactions use MySQLi prepared statements (`$stmt->bind_param()`) to ensure user inputs are safely escaped before insertion.
- **Execution Isolation:** User inputs passed to the Python script via `exec()` are aggressively escaped using `escapeshellarg()` to prevent command injection vulnerabilities.

---

## Performance & Optimization

- **Precomputed Data Sets:** The biggest optimization in the platform is decoupling the ARIMA model training from the live web server. By saving predictions locally as JSON arrays, frontend data loading takes milliseconds.
- **Frontend Code Splitting:** JavaScript is separated into logical, domain-specific files (`top_prices.js`, `gdp.js`, `collapsible-list.js`) rather than a single monolithic bundle, allowing the browser to parse only what is necessary per page.
- **Polling Fallback:** For cross-language execution (PHP to Python), the backend avoids infinite hangs by implementing a strict retry-limit (10 checks) before timing out safely.

---

## UI/UX Design

- **Visual Language:** The design system prioritizes data density, utilizing a deep dark mode (`#0B0F19`) coupled with highly contrasting "Bullish Green" (`#10B981`) and "Bearish Red" (`#F43F5E`) semantics.
- **Component Layout:** The interface uses a modular, multi-panel dashboard grid. Navigation is securely pinned to the left, while data streams and control panels occupy the center stage.
- **Micro-interactions:** Interactive components, such as collapsible commodity lists, feature smooth CSS transitions. Charts include interactive crosshairs and tooltips for precise date-to-price tracking.

---

## Challenges & Solutions

**Challenge:** Live Machine Learning Inference Latency
Running an ARIMA prediction model dynamically every time a user requests a commodity price graph would result in massive loading times (several seconds per chart) and high server CPU usage.
**Solution:** A decoupled architecture was adopted. Data science workflows (Jupyter Notebooks) are run offline to generate robust datasets and predictions, which are then exported as lightweight JSON files. The frontend essentially functions as a static site viewer for these pre-compiled JSONs, ensuring lightning-fast performance.

**Challenge:** Integrating Python NLP Scripts with a PHP Backend
PHP is excellent for rapid web form handling, but Python is superior for Scikit-learn/NLTK NLP workloads. Connecting them asynchronously without locking up the server was difficult.
**Solution:** The PHP script uses a background `exec()` call piped to a temporary text file (`> output.txt &`). PHP then runs a highly controlled `while` loop with `sleep()` to poll the file system for the result, ensuring the user gets their sentiment-based UI response without the server timing out.

---

## What I Learned / Reflections

- **Polyglot Architecture:** Managing communication across multiple languages (JS, PHP, Python) taught me how to effectively build bridges between different ecosystems (e.g., shell execution, JSON parsing).
- **Data Engineering:** I gained hands-on experience in how crucial data extraction and pre-processing are before they even reach a web interface.
- **UX for Data:** Designing a tool focused almost entirely on numbers and trends forced me to think deeply about typography, alignment, and color semantics to avoid cognitive overload for the user.

---

## Future Improvements

- **Automated Data Scraping:** Implement a daily cron job that scrapes live market prices and automatically triggers the Python ARIMA scripts to re-train and update the JSON files dynamically.
- **User Authentication:** Allow users to create accounts, save their favorite commodities to a personalized dashboard, and set up price-drop email alerts.
- **RESTful Microservice:** Refactor the Python scripts into a dedicated FastAPI or Flask microservice, replacing the `exec()` shell polling with a clean HTTP REST integration.

---

## Project Status

- **Status:** Proof of Concept / In Development
- **Live URL:** [Placeholder]
- **Repository:** [Placeholder]
- **Date / Timeline:** [Placeholder]
