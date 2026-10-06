# LyricsFront: GitHub Copilot Instructions

## Project overview

LyricsFront is an existing and working Angular web application for displaying music lyrics quotes and providing music-related quiz functionality.

This is not a new project and should not be rebuilt from scratch.

The application already retrieves existing data through a separate Node.js and Express API. The API communicates with an existing Supabase PostgreSQL database.

The main goal when modifying this repository is to extend the existing working application while changing as little existing behavior as possible.

## Architecture

The application uses the following architecture:

1. Angular frontend
2. Node.js and Express backend API hosted separately on Render
3. Supabase PostgreSQL database
4. GitHub Pages for frontend hosting

Data flow:

Browser
→ Angular frontend
→ Render API
→ Supabase database

The Angular frontend must normally communicate with Supabase through the Render API.

Do not add direct database access from Angular unless explicitly requested.

## Repositories and hosting

Frontend repository:

- Repository name: LyricsFront
- GitHub owner: TheJokes1
- Hosted using GitHub Pages
- Published application: [LyricsFront](https://thejokes1.github.io/LyricsFront/)
- Random quote page: [Random quote game](https://thejokes1.github.io/LyricsFront/Random)

Backend:

- Separate Node.js and Express repository
- Hosted as a Render web service
- Base API: [Lyrics API](https://lyrics-api-wlkl.onrender.com/api/)

Database:

- Existing Supabase PostgreSQL database
- The database already contains the application data
- Do not recreate the database or replace Supabase
- Do not invent tables, columns, relationships or constraints
- Inspect the existing API models, queries and responses before proposing database changes

## Current development and deployment

The current active development branch is `quizz`.

The frontend is published through the `gh-pages` branch.

The `quizz` branch has significantly diverged from `master`. Do not merge, reset, rebase or overwrite branches unless explicitly requested.

Do not assume that `master` contains the latest working application.

Before changing deployment configuration, inspect:

- `package.json`
- `angular.json`
- the existing deploy scripts
- the current output directory
- the configured GitHub Pages base href

The production base href must remain compatible with:

`/LyricsFront/`

Existing deployment commands and scripts should be preserved unless a change is necessary and explicitly explained.

## Local development

The project has previously been developed using Node.js 16.20.2.

Before changing Node.js or Angular versions:

1. Inspect `package.json`.
2. Inspect `package-lock.json`.
3. Inspect the installed Angular version.
4. Check compatibility between Node.js, Angular and the dependencies.
5. Do not perform automatic major-version upgrades.
6. Explain any required upgrade and its impact before changing files.

Typical local Angular command:

```bash
npx -p @angular/cli ng serve --host 0.0.0.0 --port 4200
