# nce Interview Landing Page

A responsive finance-themed landing page built with Next.js, TailwindCSS, and Framer Motion.

## Features

- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Clean, professional design with a finance theme
- **Animations**: Smooth animations and transitions using Framer Motion
- **Performance Optimized**: Built with Next.js for optimal performance and SEO

## Tech Stack

- **Next.js**: React framework for production
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **TypeScript**: Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js 14.6.0 or newer
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-finance.git
cd ai-finance
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values.

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js app directory
  - `components/`: React components
  - `globals.css`: Global styles
  - `layout.tsx`: Root layout component
  - `page.tsx`: Main page component

## Environment Variables

This project uses environment variables for configuration. These should be set in a `.env.local` file which is not committed to the repository for security reasons.

See `.env.example` for the required variables and format.

## Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

### Deploying to Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Set the required environment variables in the Vercel dashboard

## Customization

- Edit `tailwind.config.js` to customize the theme
- Modify components in the `app/components/` directory
- Update content in `app/page.tsx`

## License

MIT
