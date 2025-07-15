# Sanity Studio Setup

This directory contains the Sanity Studio configuration for the incoXchange project.

## Setup Instructions

1. **Environment Variables**: Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-api-token
   ```

2. **Install Dependencies**: Run `npm install` in the root directory (dependencies are shared)

3. **Start Studio**: Run `npm run studio` to start Sanity Studio

4. **Access Studio**: Open http://localhost:3333 to access the studio

## Available Scripts

- `npm run studio` - Start Sanity Studio in development mode
- `npm run studio:build` - Build Sanity Studio for production
- `npm run studio:deploy` - Deploy Sanity Studio to Sanity's hosting

## Schema Types

The following content types are available:
- Hero
- Page
- Service
- Testimonial
- BlogPost

## Configuration

The studio is configured to:
- Use the project ID from environment variables
- Use the 'production' dataset by default
- Include the Vision tool for query testing
- Use the structure tool for content management 