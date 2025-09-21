# Installation & Setup Commands

## Prerequisites Installation

### 1. Install Node.js 18+
```bash
# Download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

### 2. Install AWS CLI
```bash
# Download from https://aws.amazon.com/cli/
# Configure with your credentials
aws configure
```

### 3. Install AWS SAM CLI
```bash
# Download from https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
# Verify installation
sam --version
```

## Project Setup

### 1. Frontend Setup
```bash
cd web

# Install dependencies
npm install

# Create environment file (optional - app works without it)
cp .env.example .env.local

# Start development server
npm run dev
```

**Frontend will be available at**: http://localhost:3000

### 2. Backend Core API Setup
```bash
cd backend-core

# Build SAM application
sam build

# Deploy to AWS (guided setup)
sam deploy --guided --region ap-southeast-1
```

**SAM Deploy Prompts:**
- Stack Name: `sme-marketing-core`
- AWS Region: `ap-southeast-1`
- Confirm changes before deploy: `Y`
- Allow SAM CLI to create IAM roles: `Y`
- Save parameters to samconfig.toml: `Y`

### 3. Backend AI API Setup
```bash
cd ../backend-ai

# Build SAM application
sam build

# Deploy to AWS (guided setup)
sam deploy --guided --region ap-southeast-1
```

**SAM Deploy Prompts:**
- Stack Name: `sme-marketing-ai`
- AWS Region: `ap-southeast-1`
- Confirm changes before deploy: `Y`
- Allow SAM CLI to create IAM roles: `Y`
- Save parameters to samconfig.toml: `Y`

### 4. Get API URLs and Configure Frontend
```bash
# Get Core API URL
aws cloudformation describe-stacks --stack-name sme-marketing-core --query 'Stacks[0].Outputs[?OutputKey==`CoreApiUrl`].OutputValue' --output text

# Get AI API URL
aws cloudformation describe-stacks --stack-name sme-marketing-ai --query 'Stacks[0].Outputs[?OutputKey==`AiApiUrl`].OutputValue' --output text
```

**Update `web/.env.local`:**
```
NEXT_PUBLIC_CORE_API=<paste Core API URL here>
NEXT_PUBLIC_AI_API=<paste AI API URL here>
```

## Quick Test Commands

### Test Frontend (Local)
```bash
cd web
npm run dev
# Visit http://localhost:3000
```

### Test Core API
```bash
# Replace <CORE_API_URL> with your actual URL
curl -X GET <CORE_API_URL>/items
```

### Test AI API
```bash
# Replace <AI_API_URL> with your actual URL
curl -X POST <AI_API_URL>/ideas/generate \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"test"}'
```

## Complete Demo Setup (5 minutes)

```bash
# 1. Clone/setup project
cd AdvisoriaGF5

# 2. Install frontend dependencies
cd web && npm install && cd ..

# 3. Deploy backends (takes 2-3 minutes each)
cd backend-core && sam build && sam deploy --guided --region ap-southeast-1 && cd ..
cd backend-ai && sam build && sam deploy --guided --region ap-southeast-1 && cd ..

# 4. Get API URLs and update frontend config
# (Copy URLs from SAM outputs to web/.env.local)

# 5. Start demo
cd web && npm run dev
```

## Troubleshooting

### Frontend won't start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### SAM deploy fails
```bash
# Check AWS credentials
aws sts get-caller-identity

# Clear SAM cache
rm -rf .aws-sam
sam build
```

### API calls fail
- Check CORS settings in API Gateway
- Verify Lambda function logs in CloudWatch
- Ensure proper IAM permissions

### Bedrock not available
- Enable model access in AWS Bedrock console
- App will fall back to mock responses automatically

## Development Workflow

### Frontend Development
```bash
cd web
npm run dev    # Start dev server
npm run build  # Build for production
npm run lint   # Check code quality
```

### Backend Development
```bash
# After code changes
sam build && sam deploy

# View logs
sam logs -n CoreFunction --stack-name sme-marketing-core --tail
sam logs -n AiFunction --stack-name sme-marketing-ai --tail
```

### Full Reset
```bash
# Delete AWS stacks
aws cloudformation delete-stack --stack-name sme-marketing-core
aws cloudformation delete-stack --stack-name sme-marketing-ai

# Redeploy everything
# (Follow setup commands above)
```