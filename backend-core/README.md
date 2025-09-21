# SME Marketing Assistant - Core API

AWS SAM application providing core business functionality.

## Setup

1. Build and deploy:
```bash
sam build
sam deploy --guided --region ap-southeast-1
```

2. Note the API URL from outputs for frontend configuration.

## Features

- Business profile management
- Campaign CRUD operations
- File upload with presigned URLs
- Generic item storage
- DynamoDB integration
- S3 bucket for uploads

## Endpoints

- `POST /signup` - Create business profile
- `POST /campaigns` - Create campaign
- `GET /items` - List items
- `POST /items` - Create item
- `POST /uploads/presign` - Get upload URL

## Database Tables

- `business` - Business profiles (PK: businessId)
- `campaigns` - Marketing campaigns (PK: campaignId, GSI: businessId)
- `items` - Generic storage (PK: pk)
- `comparisons` - Ad comparisons (PK: comparisonId, GSI: businessId)
- `chat_sessions` - Chat sessions (PK: sessionId, GSI: businessId)
- `chat_messages` - Chat messages (PK: sessionId, SK: ts)

## Testing

```bash
# Test business signup
curl -X POST https://your-api-url/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Business","industry":"retail","country":"US","city":"New York","zipCode":"10001","workingHours":{"start":"09:00","end":"17:00"}}'

# Test presigned URL
curl -X POST https://your-api-url/uploads/presign \
  -H "Content-Type: application/json" \
  -d '{"fileName":"logo.png","fileType":"image/png"}'
```