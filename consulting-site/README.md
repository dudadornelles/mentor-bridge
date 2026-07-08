# Duda Dornelles — Delivery & DevOps Consulting

A professional landing page for Duda Dornelles's engineering delivery consulting practice. Built as a static site, ready to deploy on GitHub Pages.

## 🚀 Services

- **Value Stream Mapping** — Visualize end-to-end delivery, identify bottlenecks
- **Deployment Pipeline Optimization** — CI/CD design and evolution
- **Rollout Processes & Safety** — Progressive delivery, feature flags, canary releases
- **Testing Strategy & Coaching** — Test pyramid, contract testing, team upskilling
- **DORA Metrics Improvement** — Deploy frequency, lead time, MTTR, change failure rate

## 🛠️ Tech Stack

- Pure HTML, CSS, and JavaScript (no frameworks)
- [Inter](https://rsms.me/inter/) font family
- Dark mode design with modern CSS custom properties
- Fully responsive and accessible

## 📦 Deploy to GitHub Pages

### Option 1: From this repository

```bash
# From the repository root, copy the files or use a subdirectory
# GitHub Pages can serve from: / (root), /docs, or a branch
```

### Option 2: Using GitHub Actions (recommended)

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: consulting-site
      - uses: actions/deploy-pages@v4
```

### Option 3: Manual setup

1. Go to your repository **Settings > Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose `main` branch and `/docs` folder (or create a `gh-pages` branch)
4. Click **Save**

### Custom domain

To use a custom domain like `dornelles.com`:

1. Add a `CNAME` file with your domain, or
2. Configure it in the repository Pages settings

## 📋 Form Setup

The contact form uses [Formspree](https://formspree.io/) (free tier) for handling submissions on a static site.

1. Sign up at [formspree.io](https://formspree.io/)
2. Create a new form and copy your form ID
3. Replace `YOUR_FORM_ID` in `assets/js/main.js` with your actual form ID

If Formspree isn't configured, the form falls back to a mailto: link.

## 📄 License

All rights reserved.
