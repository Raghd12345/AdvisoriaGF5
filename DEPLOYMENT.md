# Deployment Guide

## Prerequisites

- AWS CLI configured with appropriate permissions
- AWS SAM CLI installed
- Node.js 18+ installed

## Step-by-Step Deployment

### 1. Deploy Core API

```bash
cd backend-core
sam build
sam deploy --guided --region ap-southeast-1
```

**SAM Deploy Parameters:**
- Stack Name: `sme-marketing-core`
- AWS Region: `ap-southeast-1`
- Confirm changes: `Y`
- Allow SAM to create IAM roles: `Y`
- Save parameters to config: `Y`

### 2. Deploy AI API

```bash
cd ../backend-ai
sam build
sam deploy --guided --region ap-southeast-1
```

**SAM Deploy Parameters:**
- Stack Name: `sme-marketing-ai`
- AWS Region: `ap-southeast-1`
- Confirm changes: `Y`
- Allow SAM to create IAM roles: `Y`
- Save parameters to config: `Y`

### 3. Configure Frontend

Copy API URLs from SAM outputs:

```bash
# Get Core API URL
aws cloudformation describe-stacks --stack-name sme-marketing-core --query 'Stacks[0].Outputs[?OutputKey==`CoreApiUrl`].OutputValue' --output text

# Get AI API URL  
aws cloudformation describe-stacks --stack-name sme-marketing-ai --query 'Stacks[0].Outputs[?OutputKey==`AiApiUrl`].OutputValue' --output text
```

Create `web/.env.local`:
```
NEXT_PUBLIC_CORE_API=<Core API URL>
NEXT_PUBLIC_AI_API=<AI API URL>
```

### 4. Start Frontend

```bash
cd web
npm install
npm run dev
```

## Testing Endpoints

### Core API Tests

```bash
# Test signup
curl -X POST <CORE_API_URL>/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Bakery","industry":"bakery","country":"Malaysia","city":"KL","zipCode":"50200","workingHours":{"start":"06:00","end":"20:00"}}'

# Test campaign creation
curl -X POST <CORE_API_URL>/campaigns \
  -H "Content-Type: application/json" \
  -d '{"businessId":"business-1","goal":"Test goal","targetAudience":"Test audience","budget":300,"status":"draft"}'

# Test items
curl -X GET <CORE_API_URL>/items

# Test presigned upload
curl -X POST <CORE_API_URL>/uploads/presign \
  -H "Content-Type: application/json" \
  -d '{"fileName":"logo.png","fileType":"image/png"}'
```

### AI API Tests

```bash
# Test ideas generation
curl -X POST <AI_API_URL>/ideas/generate \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"campaign-1"}'

# Test creatives generation
curl -X POST <AI_API_URL>/creatives/generate \
  -H "Content-Type: application/json" \
  -d '{"ideaIds":["idea-1","idea-2"]}'

# Test plan generation
curl -X POST <AI_API_URL>/plan/generate \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"campaign-1"}'

# Test competitors
curl -X GET "<AI_API_URL>/competitors?industry=bakery&city=Kuala%20Lumpur"

# Test comparison
curl -X POST <AI_API_URL>/compare \
  -H "Content-Type: application/json" \
  -d '{"competitorId":"comp-1","ourCreativeId":"creative-1"}'
```

## Acceptance Criteria

### Frontend Pages
- ✅ Homepage displays demo persona and navigation
- ✅ Signup form saves business profile (mock or real API)
- ✅ Campaign form creates campaign and redirects to ideas
- ✅ Ideas page shows ≥6 cards with approve/reject buttons
- ✅ Creatives page renders 2 images, 3 captions, 1 video script
- ✅ Competition page shows competitor cards and analysis
- ✅ Plan page displays budget pie chart and 14-day calendar

### Backend APIs
- ✅ All endpoints return proper JSON responses
- ✅ CORS enabled for all routes
- ✅ Error handling with meaningful messages
- ✅ Mock responses when Bedrock unavailable
- ✅ DynamoDB storage working
- ✅ S3 presigned URLs generated

### Integration
- ✅ Frontend calls real APIs when env vars present
- ✅ Frontend falls back to mock data when APIs missing
- ✅ End-to-end demo flow works smoothly
- ✅ Mobile responsive design

## Troubleshooting

### CORS Issues
- Check API Gateway CORS configuration
- Verify `Access-Control-Allow-Origin: *` in Lambda responses

### Bedrock Access
- Enable Bedrock in AWS Console (Model access)
- Check IAM permissions for `bedrock:InvokeModel`
- Fallback to mock responses if unavailable

### SSO Expired
```bash
aws sso login
```

### SAM Build Failures
- Check Python version (3.11 required)
- Verify requirements.txt dependencies
- Clear `.aws-sam` directory and rebuild