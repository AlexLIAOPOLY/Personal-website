# Liao Wang - Personal Portfolio Website

## Overview
This is a personal portfolio website showcasing the profile, skills, projects, and experiences of Liao Wang. The website is designed with a modern, interactive interface to provide visitors with an engaging experience.

## Features
- **Responsive Design**: The website is fully responsive and optimized for all device sizes.
- **Interactive Elements**: 
  - Animated hero slider showcasing different aspects of professional identity
  - Interactive card layouts for about section
  - Timeline visualization for education and experience
  - Animated skill progress bars
  - Project filtering system by category
  - Contact form with validation
- **Smooth Animations**: Utilizes AOS (Animate On Scroll) library for smooth scrolling animations.
- **Modern UI Components**:
  - Card layouts
  - Timeline view
  - Progress bars
  - Interactive filter buttons
  - Back to top button
  - Sticky header with scroll effects
- **Social Profiles Integration**:
  - Direct links to GitHub, Hugging Face, and Bilibili profiles
  - Accessible from both contact section and footer
- **Functional Contact Form**:
  - Node.js backend for processing form submissions
  - Email notifications sent to your QQ email

## Technologies Used
- HTML5
- CSS3 (Custom-built responsive design)
- JavaScript (ES6+)
- Node.js (Express)
- Nodemailer for email functionality
- Font Awesome for icons
- AOS (Animate On Scroll) library

## Structure
The website is structured into the following sections:
1. **Hero Section**: Features a slider showcasing different professional identities with a profile image and call-to-action buttons.
2. **About Section**: Information about Liao Wang presented in an engaging card layout.
3. **Education Section**: Academic background displayed in an interactive timeline format.
4. **Experience Section**: Professional experience shown in a timeline view.
5. **Projects Section**: Project showcase with category filtering functionality.
6. **Skills Section**: Technical skills presented with animated progress bars.
7. **Awards Section**: Awards and honors displayed in a card grid.
8. **Contact Section**: Contact information, social profiles, and a functional contact form.

## Deployment on Render

### Prerequisites
- A [Render](https://render.com/) account
- QQ email setup with SMTP password/authorization code

### Deployment Method 1: Using render.yaml (Recommended)
This repository includes a `render.yaml` file which can be used with Render's "Blueprint" feature for easier deployment:

1. **Fork this repository** to your GitHub account
2. Go to the Render Dashboard and **click the "New" button**
3. Select **"Blueprint"**
4. Connect to your GitHub account and select your forked repository
5. **Configure the environment variables**:
   - **Important**: You MUST add your `EMAIL_PASSWORD` (QQ email SMTP password/authorization code) in the Render dashboard when prompted

The `render.yaml` file is already configured with:
```yaml
services:
  - type: web
    name: liao-wang-portfolio
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: EMAIL_PASSWORD
        sync: false  # Must be manually set in Render dashboard
      - key: PORT
        value: 10000
    autoDeploy: true
    healthCheckPath: /
```

### Deployment Method 2: Manual Setup
If you prefer to set up manually:

1. **Create a New Web Service on Render**
   - Log in to your Render account
   - Click "New" and select "Web Service"
   - Connect your GitHub repository

2. **Configure the Service**
   - **Name**: `liao-wang-portfolio` (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose the closest to your target audience
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

3. **Add Environment Variables**
   - Click on "Environment" tab and add:
     - `NODE_ENV`: `production`
     - `EMAIL_PASSWORD`: Your QQ email SMTP password/authorization code
     - `PORT`: `10000`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your site

### Verifying Deployment
1. Once deployed, Render will provide a URL (e.g., `https://liao-wang-portfolio.onrender.com`)
2. Visit the URL to confirm your site is working properly
3. Test the contact form to ensure emails are being sent correctly

### Troubleshooting Deployment
- **If deployment fails**: Check the Render logs for specific error messages
- **If emails aren't sending**: Verify your EMAIL_PASSWORD is set correctly in environment variables
- **For slow initial load**: This is normal for free tier - the service spins down after inactivity

## Custom Domain Setup (Optional)
To use your own domain name:
1. Go to your Web Service settings in Render
2. Click on "Custom Domain"
3. Follow the instructions to add and verify your domain

## Local Development
To run the website locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The site will be available at `http://localhost:3002`.

## Customization
- Update the personal information in `index.html` to reflect your details
- Replace the profile picture in the `images` folder
- Modify the projects section to showcase your own work
- Update social media links in the footer

## Visual Design
- **Color Scheme**: Based on GitHub's design language with blue accents.
- **Typography**: Clean, readable sans-serif fonts.
- **Layout**: Modern card-based design with ample white space.
- **Effects**: Subtle hover animations and smooth transitions.

## Accessibility
- Semantic HTML structure
- Accessible color contrast
- Keyboard navigable interface
- Screen reader friendly markup

## Future Improvements
- Add a dark mode toggle
- Implement language switching capability
- Enhance project details with modal dialogs
- Add a blog section

## Credits
- Font Awesome for icons
- AOS library for scroll animations
- Unsplash for stock images (where applicable)

---

© 2024 Liao Wang. All Rights Reserved. 