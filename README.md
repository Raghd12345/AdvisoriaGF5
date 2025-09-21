# Advisoria

A comprehensive AI-powered marketing platform for small and medium enterprises, featuring marketing consultation and competitor analysis capabilities.

## Architecture

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend Core**: AWS SAM + Lambda + DynamoDB + S3
- **Backend AI**: AWS SAM + Lambda + Amazon Bedrock (Claude 3 Haiku)
- **Region**: ap-southeast-1

## Features

1. **Marketing Consultant**: Generate campaigns, strategies, creatives, and plans
2. **Competitor Tracking**: Analyze competitor ads and generate counter-strategies
3. **AI Chatbot**: Integrated chat support across all pages

## Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS SAM CLI
- Bedrock model access enabled

### 1. Deploy Backend Core
```bash
cd backend-core
sam build
sam deploy --guided --region ap-southeast-1
```

### 2. Deploy Backend AI
```bash
cd backend-ai
sam build
sam deploy --guided --region ap-southeast-1
```

### 3. Configure Frontend
Copy API URLs from SAM outputs to `web/.env.local`:
```
NEXT_PUBLIC_CORE_API=https://your-core-api.execute-api.ap-southeast-1.amazonaws.com/prod
NEXT_PUBLIC_AI_API=https://your-ai-api.execute-api.ap-southeast-1.amazonaws.com/prod
```

### 4. Start Frontend
```bash
cd web
npm install
npm run dev
```

## API Endpoints

### Core API
- `POST /signup` - Business registration
- `POST /campaigns` - Create campaigns
- `GET /items` - List items
- `POST /items` - Create items
- `POST /uploads/presign` - Get upload URLs

### AI API
- `POST /ideas/generate` - Generate marketing ideas
- `POST /creatives/generate` - Generate creatives
- `POST /plan/generate` - Generate marketing plans
- `GET /competitors/generate` - Generate competitor ads
- `POST /compare` - Compare and counter-analyze
- `POST /chat/complete` - Chatbot conversations

## Troubleshooting

- **CORS errors**: Check API Gateway CORS configuration
- **Bedrock access**: Enable Claude 3 Haiku model access in AWS console
- **SSO expired**: Run `aws sso login`
- **Setup Required**: Ensure environment variables are set correctly