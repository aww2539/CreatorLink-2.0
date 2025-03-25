# CreatorLink Frontend

This is the frontend for CreatorLink, a platform designed for creators to showcase their work and connect with others. Built with Next.js and TypeScript, it provides a modern and responsive user interface.

## Project Structure

The frontend project is structured as follows:

- `src/app`: Contains the main application components and pages.
  - `page.tsx`: The main landing page of the application. It fetches the current user and displays a welcome message.
  - `layout.tsx`: Defines the root layout of the application, including metadata and the basic HTML structure.
  - `globals.css`: Global CSS file that imports Tailwind CSS and defines global styles.
- `public`: Contains static assets such as images and fonts.
- `next.config.ts`: Configuration file for Next.js.
- `tsconfig.json`: Configuration file for TypeScript.
- `postcss.config.mjs`: Configuration file for PostCSS.
- `eslint.config.mjs`: Configuration file for ESLint.
- `package.json`: Lists project dependencies and scripts.

## Running the Application

### Development Mode

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the Next.js development server with turbopack.  You can then access the application in your browser at `http://localhost:3000`.

### Production Build

To build the application for production, use the following command:

```bash
npm run build
```

This will create an optimized production build of the application in the `.next` directory.  To start the production server, use:

```bash
npm run start
```

## Dependencies

Key dependencies used in this project:

- `next`: The React Framework for building web applications.
- `react`: A JavaScript library for building user interfaces.
- `react-dom`: Provides DOM-specific methods for React.
- `typescript`: A typed superset of JavaScript that compiles to plain JavaScript.
- `tailwindcss`: A utility-first CSS framework for rapidly designing custom user interfaces.
- `@aws-sdk/client-cognito-identity-provider`: AWS SDK for Cognito integration.
