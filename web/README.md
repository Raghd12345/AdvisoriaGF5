# SME Marketing Assistant - Frontend

Next.js 15 application with TypeScript and Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API endpoints:
```
NEXT_PUBLIC_CORE_API=https://your-core-api.execute-api.ap-southeast-1.amazonaws.com/prod
NEXT_PUBLIC_AI_API=https://your-ai-api.execute-api.ap-southeast-1.amazonaws.com/prod
```

3. Start development server:
```bash
npm run dev
```

## Features

- Business registration with logo upload
- Campaign creation and management
- AI-generated marketing ideas
- Creative content generation
- Competitor analysis
- Marketing plan visualization
- Integrated chatbot

## Pages

- `/` - Homepage with setup validation
- `/signup` - Business registration
- `/campaign/new` - Campaign creation
- `/ideas` - Marketing ideas with approval
- `/creatives` - Generated content display
- `/competition` - Competitor analysis
- `/plan` - Marketing plan with charts
- `/chat` - Dedicated chat interface

## Components

- `ChatWidget` - Floating chat widget (appears on all pages)
- Responsive design with Tailwind CSS
- Real-time API integration