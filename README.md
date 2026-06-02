# QRTimeSync

A web app that displays a QR code used to configure the time in our controllers.

**Live site:** https://koolecontrols.github.io/QRTimeSync/

Pushes to `main` are automatically built and deployed to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Built with Vite + React + TypeScript + shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
