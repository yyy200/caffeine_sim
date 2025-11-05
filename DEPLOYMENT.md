# GitHub Pages Deployment Guide

## Setup Instructions

1. **Update the homepage URL in `package.json`**:
   - Replace `YOUR_USERNAME` with your GitHub username
   - If your repository name is different, update `caffeine_sim` to match your repo name
   - Example: `"homepage": "https://johndoe.github.io/caffeine_sim"`

2. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create GitHub repository**:
   - Go to GitHub and create a new repository
   - Don't initialize it with a README, .gitignore, or license

4. **Connect local repository to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/caffeine_sim.git
   git branch -M main
   git push -u origin main
   ```

5. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "gh-pages" branch
   - Click Save

6. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```
   or
   ```bash
   yarn deploy
   ```

   This will:
   - Build your React app
   - Create/update the `gh-pages` branch
   - Push the built files to GitHub

7. **Access your deployed app**:
   - Your app will be available at: `https://YOUR_USERNAME.github.io/caffeine_sim`
   - It may take a few minutes for the site to be available after the first deployment

## Updating the Deployment

Whenever you make changes and want to update the live site:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Deploy the updated version:
   ```bash
   npm run deploy
   ```

## Notes

- The `predeploy` script automatically runs `npm run build` before deploying
- The build folder is automatically ignored by git (it's in .gitignore)
- The `gh-pages` branch is created automatically and contains only the built files
- Your source code remains on the `main` branch

