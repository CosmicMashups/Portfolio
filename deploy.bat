@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ============================================================================
REM  Deploy this Vite + React app to GitHub Pages (gh-pages branch via gh-pages)
REM ============================================================================
REM  Prerequisites: Node.js, npm, Git; remote "origin" must point at GitHub repo.
REM  One-time: GitHub repo > Settings > Pages > Build from branch > gh-pages /root
REM
REM  Base URL (must match your published URL path):
REM    - Project site:  https://<user>.github.io/<repo>/  ->  base /repo/
REM    - User/org site: https://<user>.github.io/        ->  base /
REM
REM  Configure (pick one):
REM    set GITHUB_PAGES_BASE=/MyRepoName/
REM    set GH_PAGES_ROOT=1
REM    (omit both: tries scripts\print-gh-pages-base.mjs from "origin", else folder name)
REM
REM  Optional:
REM    set SKIP_NPM_INSTALL=1   REM reuse existing node_modules
REM    set SKIP_DEPLOY=1        REM build only; do not push to gh-pages
REM    set USE_NPM_CI=1         REM use "npm ci" (clean) instead of default "npm install"
REM                               Close "npm run dev" / IDE first; EPERM on native .node files
REM                               usually means something still has node_modules locked.
REM ============================================================================

cd /d "%~dp0" || exit /b 1

if defined GH_PAGES_ROOT (
  set "GITHUB_PAGES_BASE=/"
) else (
  if not defined GITHUB_PAGES_BASE (
    for /f "delims=" %%i in ('node "%~dp0scripts\print-gh-pages-base.mjs" 2^>nul') do set "GITHUB_PAGES_BASE=%%i"
    if not defined GITHUB_PAGES_BASE (
      for %%I in ("%CD%") do set "GITHUB_PAGES_BASE=/%%~nI/"
    )
  )
)

if not "!GITHUB_PAGES_BASE:~0,1!"=="/" set "GITHUB_PAGES_BASE=/!GITHUB_PAGES_BASE!"
if not "!GITHUB_PAGES_BASE:~-1!"=="/" set "GITHUB_PAGES_BASE=!GITHUB_PAGES_BASE!/"

echo.
echo  GITHUB_PAGES_BASE=!GITHUB_PAGES_BASE!
echo  (Vite asset prefix and React Router basename follow this.)
echo.

if not exist package.json (
  echo ERROR: package.json not found. Run this script from the project root.
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not on PATH.
  exit /b 1
)

where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git is not on PATH.
  exit /b 1
)

if not defined SKIP_NPM_INSTALL (
  if defined USE_NPM_CI (
    call npm ci
  ) else (
    REM "npm install" avoids wiping node_modules; "npm ci" often hits EPERM on Windows
    REM when a native addon (.node) is still loaded (dev server, editor, antivirus).
    call npm install
  )
  if errorlevel 1 exit /b 1
)

set "TSC_BIN=%~dp0node_modules\.bin\tsc.cmd"
if not exist "!TSC_BIN!" (
  echo ERROR: Local tsc not found at !TSC_BIN!
  echo Run npm install in this folder, or set SKIP_NPM_INSTALL=0 after fixing EPERM.
  exit /b 1
)
call "!TSC_BIN!" -b
if errorlevel 1 exit /b 1

set "VITE_BIN=%~dp0node_modules\.bin\vite.cmd"
if not exist "!VITE_BIN!" (
  echo ERROR: Local vite not found at !VITE_BIN!
  echo Run npm install in this folder.
  exit /b 1
)
call "!VITE_BIN!" build --base "!GITHUB_PAGES_BASE!"
if errorlevel 1 exit /b 1

REM GitHub Pages + Jekyll: allow files and dirs named like _headers
type nul > "dist\.nojekyll"

REM SPA: deep links / refresh on client routes serve 404.html (copy of index)
if exist "dist\index.html" copy /y "dist\index.html" "dist\404.html" >nul

if defined SKIP_DEPLOY (
  echo.
  echo  SKIP_DEPLOY=1: build finished. Upload dist\ manually or remove SKIP_DEPLOY to push.
  exit /b 0
)

call npx --yes gh-pages -d dist -b gh-pages
if errorlevel 1 (
  echo.
  echo  gh-pages failed. If first run: ensure you are logged into npm ^(npx^) and git push works.
  exit /b 1
)

echo.
echo  Done. After the push, open GitHub ^> Settings ^> Pages and select branch gh-pages, folder /.
echo.
exit /b 0
