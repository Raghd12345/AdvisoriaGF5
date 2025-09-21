# Team Plan - 4 Developer Swimlanes

## FE1 - Frontend Core & Setup (12 tasks)
1. `web/package.json` - Initialize Next.js 15 with TypeScript, Tailwind
2. `web/tailwind.config.js` - Configure Tailwind with custom colors
3. `web/src/types.ts` - Define all TypeScript interfaces
4. `web/src/lib/api.ts` - API client with mock fallback logic
5. `web/src/components/Layout.tsx` - Main layout with navigation
6. `web/src/app/page.tsx` - Landing page with demo persona
7. `web/src/app/signup/page.tsx` - Business registration form
8. `web/src/components/FileUpload.tsx` - Logo upload component
9. `web/.env.example` - Environment variables template
10. `web/README.md` - Frontend setup instructions
11. `web/src/seed/` - Create all mock data files
12. Test signup flow with mock data

## FE2 - Campaign & Ideas Pages (13 tasks)
1. `web/src/app/campaign/new/page.tsx` - Campaign creation form
2. `web/src/app/ideas/page.tsx` - Ideas listing with approve/reject
3. `web/src/app/creatives/page.tsx` - Generated creatives display
4. `web/src/app/plan/page.tsx` - Budget pie chart and calendar
5. `web/src/components/IdeaCard.tsx` - Individual idea component
6. `web/src/components/CreativeCard.tsx` - Creative display component
7. `web/src/components/BudgetChart.tsx` - Pie chart for budget allocation
8. `web/src/components/Calendar.tsx` - 14-day posting schedule
9. `web/src/components/Button.tsx` - Reusable button component
10. `web/src/components/Modal.tsx` - Modal for confirmations
11. Test campaign creation flow
12. Test ideas approval workflow
13. Test creatives generation and display

## BE1 - Core API & Infrastructure (14 tasks)
1. `backend-core/template.yaml` - SAM template with API Gateway, Lambda, DynamoDB, S3
2. `backend-core/src/core_handler.py` - Main Lambda handler with routing
3. `backend-core/src/models.py` - Pydantic models for validation
4. `backend-core/src/storage.py` - DynamoDB operations wrapper
5. `backend-core/src/uploads.py` - S3 presigned URL generation
6. `backend-core/requirements.txt` - Python dependencies
7. Implement POST /signup endpoint
8. Implement POST /campaigns endpoint
9. Implement GET /items, POST /items endpoints
10. Implement POST /uploads/presign endpoint
11. `sam build && sam deploy --guided` - Deploy to ap-southeast-1
12. Test all endpoints with curl
13. Configure CORS for all routes
14. Add error handling and logging

## BE2 - AI API & Competitor Features (15 tasks)
1. `backend-ai/template.yaml` - SAM template with Bedrock permissions
2. `backend-ai/src/ai_handler.py` - Main AI Lambda handler
3. `backend-ai/src/prompts.py` - All prompt templates
4. `backend-ai/src/bedrock_client.py` - Bedrock integration with fallback
5. `backend-ai/requirements.txt` - Python dependencies
6. Implement POST /ideas/generate endpoint
7. Implement POST /creatives/generate endpoint
8. Implement POST /plan/generate endpoint
9. Implement GET /competitors endpoint
10. Implement POST /compare endpoint
11. `web/src/app/competition/page.tsx` - Competitor tracking page
12. `web/src/components/CompetitorCard.tsx` - Competitor ad display
13. `sam build && sam deploy --guided` - Deploy AI API
14. Test all AI endpoints with mock responses
15. Test Bedrock integration (if available)

## Shared Tasks (All developers)
- `docs/openapi.yaml` - API documentation
- `docs/demo-script.md` - Demo walkthrough
- Integration testing between frontend and backends
- Final demo preparation with Aisha the Bakery persona