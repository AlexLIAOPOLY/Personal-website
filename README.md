# Personal Portfolio Website

This is a personal portfolio website built with Node.js and Express.

## Features

- Responsive design
- Contact form with email notification
- Modern UI/UX
- Portfolio showcase

## Prerequisites

- Node.js >= 14.0.0
- npm

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Personal-website
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file in the root directory and add your environment variables:
```
EMAIL_PASSWORD=your_email_password
NODE_ENV=production
PORT=10000
```

## Development

To run the development server:
```bash
npm run dev
```

## Production

To run the production server:
```bash
npm start
```

## Deployment on Render

This project is configured for deployment on Render.com. The deployment configuration is specified in `render.yaml`.

### Deployment Steps

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Render will automatically detect the configuration from `render.yaml`
4. Add the following environment variables in Render dashboard:
   - `EMAIL_PASSWORD`: Your email authorization code
   - `NODE_ENV`: Set to "production"
   - `PORT`: Will be automatically set by Render

### Important Notes

- The server runs on port 10000 by default
- Make sure to set up the email password in Render's environment variables
- The health check endpoint is configured at the root path "/"

## License

MIT

## Author

Liao Wang
 
