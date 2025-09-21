# Troubleshooting Guide

## Common Issues & Solutions

### 1. CORS Errors

**Problem**: Browser shows CORS policy errors when calling APIs

**Solutions**:
```bash
# Check API Gateway CORS settings
aws apigateway get-resources --rest-api-id <API_ID>

# Verify Lambda returns proper headers
# Headers should include:
# 'Access-Control-Allow-Origin': '*'
# 'Access-Control-Allow-Headers': '*'
# 'Access-Control-Allow-Methods': '*'
```

**Quick Fix**: Redeploy SAM stack to reset CORS configuration

### 2. Bedrock Access Denied

**Problem**: AI API returns "Access Denied" for Bedrock calls

**Solutions**:
1. **Enable Model Access**:
   - Go to AWS Bedrock Console
   - Navigate to "Model access"
   - Request access to "Claude 3 Haiku"
   - Wait for approval (usually instant)

2. **Check IAM Permissions**:
   ```bash
   # Verify Lambda has bedrock:InvokeModel permission
   aws iam get-role-policy --role-name <LAMBDA_ROLE> --policy-name <POLICY_NAME>
   ```

3. **Fallback Behavior**: App automatically uses mock responses if Bedrock unavailable

### 3. SSO Session Expired

**Problem**: AWS CLI commands fail with authentication errors

**Solution**:
```bash
# Re-authenticate
aws sso login

# Verify credentials
aws sts get-caller-identity
```

### 4. SAM Deploy Failures

**Problem**: `sam deploy` fails with various errors

**Common Solutions**:

**Insufficient Permissions**:
```bash
# Ensure your AWS user has these permissions:
# - CloudFormation full access
# - IAM role creation
# - Lambda function management
# - API Gateway management
# - DynamoDB table creation
# - S3 bucket creation
```

**Stack Already Exists**:
```bash
# Delete existing stack
aws cloudformation delete-stack --stack-name sme-marketing-core
aws cloudformation wait stack-delete-complete --stack-name sme-marketing-core

# Redeploy
sam deploy --guided
```

**Build Failures**:
```bash
# Clear SAM cache
rm -rf .aws-sam

# Rebuild
sam build --use-container
```

### 5. Frontend API Connection Issues

**Problem**: Frontend can't connect to deployed APIs

**Diagnosis**:
```bash
# Test API directly
curl -X GET <API_URL>/items

# Check environment variables
cat web/.env.local
```

**Solutions**:
1. **Missing Environment Variables**: App falls back to mock data automatically
2. **Wrong API URLs**: Get correct URLs from CloudFormation outputs:
   ```bash
   aws cloudformation describe-stacks --stack-name sme-marketing-core --query 'Stacks[0].Outputs'
   ```
3. **API Not Deployed**: Redeploy backend stacks

### 6. DynamoDB Permission Errors

**Problem**: Core API can't read/write to DynamoDB

**Solution**:
```bash
# Check Lambda execution role has DynamoDB permissions
# Should include: DynamoDBCrudPolicy in SAM template

# Test table access
aws dynamodb scan --table-name <TABLE_NAME>
```

### 7. S3 Upload Issues

**Problem**: Presigned URL generation fails

**Solutions**:
1. **Check S3 Permissions**: Lambda needs S3WritePolicy
2. **CORS Configuration**: S3 bucket should allow PUT from any origin
3. **Test Presigned URL**:
   ```bash
   curl -X POST <CORE_API_URL>/uploads/presign \
     -H "Content-Type: application/json" \
     -d '{"fileName":"test.png","fileType":"image/png"}'
   ```

### 8. Frontend Build Errors

**Problem**: `npm run build` or `npm run dev` fails

**Solutions**:
```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (need 18+)
node --version

# Fix TypeScript errors
npm run lint
```

### 9. Mock Data Not Loading

**Problem**: Frontend shows empty data even in mock mode

**Solutions**:
1. **Check JSON Files**: Ensure all files in `src/seed/` are valid JSON
2. **Import Paths**: Verify import statements in `api.ts`
3. **Environment Check**: Confirm `NEXT_PUBLIC_*` variables are undefined for mock mode

### 10. Demo Flow Broken

**Problem**: Navigation or form submissions don't work

**Quick Fixes**:
1. **Hard Refresh**: Clear browser cache and reload
2. **Check Console**: Look for JavaScript errors in browser dev tools
3. **Restart Dev Server**: Stop and restart `npm run dev`

## Debugging Commands

### Check AWS Resources
```bash
# List CloudFormation stacks
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE

# Get stack outputs
aws cloudformation describe-stacks --stack-name sme-marketing-core

# List Lambda functions
aws lambda list-functions --query 'Functions[?contains(FunctionName, `sme-marketing`)]'
```

### View Logs
```bash
# Lambda logs
sam logs -n CoreFunction --stack-name sme-marketing-core --tail
sam logs -n AiFunction --stack-name sme-marketing-ai --tail

# API Gateway logs (if enabled)
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway/"
```

### Test Individual Components
```bash
# Test Core API endpoints
curl -X GET <CORE_API_URL>/items
curl -X POST <CORE_API_URL>/signup -H "Content-Type: application/json" -d '{...}'

# Test AI API endpoints  
curl -X POST <AI_API_URL>/ideas/generate -H "Content-Type: application/json" -d '{...}'

# Test frontend mock mode (remove .env.local temporarily)
mv web/.env.local web/.env.local.backup
cd web && npm run dev
```

## Emergency Reset

If everything is broken, complete reset:

```bash
# 1. Delete all AWS resources
aws cloudformation delete-stack --stack-name sme-marketing-core
aws cloudformation delete-stack --stack-name sme-marketing-ai

# 2. Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name sme-marketing-core
aws cloudformation wait stack-delete-complete --stack-name sme-marketing-ai

# 3. Clear local caches
rm -rf backend-core/.aws-sam
rm -rf backend-ai/.aws-sam
rm -rf web/node_modules web/.next

# 4. Redeploy everything
cd backend-core && sam build && sam deploy --guided
cd ../backend-ai && sam build && sam deploy --guided
cd ../web && npm install && npm run dev
```

## Getting Help

1. **Check AWS CloudWatch Logs** for detailed error messages
2. **Use AWS CloudFormation Console** to see stack deployment status
3. **Browser Developer Tools** for frontend debugging
4. **SAM CLI Debug Mode**: Add `--debug` flag to sam commands
5. **Mock Mode**: Remove environment variables to test with mock data

Remember: The app is designed to work with mock data, so you can always demo without AWS infrastructure!