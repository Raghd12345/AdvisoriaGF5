# Acceptance Criteria

## Frontend Pages

### Homepage (/)
- ✅ Displays "SME Marketing Assistant" title
- ✅ Shows demo persona: "Aisha the Bakery" with RM300 budget
- ✅ Two feature cards: Marketing Consultant & Competitor Tracking
- ✅ Navigation links work correctly
- ✅ Responsive design on mobile

### Business Setup (/signup)
- ✅ Form pre-filled with Aisha's Bakery demo data
- ✅ All required fields: name, industry, location, working hours
- ✅ Form submission saves business profile
- ✅ Redirects to campaign creation on success
- ✅ Error handling for failed submissions

### Campaign Creation (/campaign/new)
- ✅ Form pre-filled with bakery campaign example
- ✅ Goal, target audience, and budget fields
- ✅ Budget validation (minimum RM 50)
- ✅ Form submission creates campaign
- ✅ Redirects to ideas page on success

### Ideas Page (/ideas)
- ✅ Displays ≥6 marketing idea cards
- ✅ Each card shows title, description, platform
- ✅ Approve/Reject buttons functional
- ✅ Status updates (pending → approved/rejected)
- ✅ Counter shows approved ideas (need ≥2 to continue)
- ✅ "Generate Creatives" button enabled when criteria met

### Creatives Page (/creatives)
- ✅ Displays 3 social media captions
- ✅ Shows 2 poster images with descriptions
- ✅ Renders 1 video script (30-second format)
- ✅ Copy buttons for captions and script
- ✅ Navigation to competition and plan pages

### Competition Page (/competition)
- ✅ Shows competitor gallery (≥3 competitor cards)
- ✅ Each card displays: name, ad content, platform, budget
- ✅ "Analyze vs Our Ad" button triggers comparison
- ✅ Analysis shows scorecard (5 metrics, 1-10 scale)
- ✅ Displays critique and counter-ad strategy
- ✅ Counter-ad includes caption, poster concept, video script

### Plan Page (/plan)
- ✅ Budget pie chart with platform allocations
- ✅ Platform breakdown table with amounts and percentages
- ✅ 14-day calendar grid with scheduled posts
- ✅ Summary stats: total posts, platforms, days coverage
- ✅ Chart responsive and properly labeled

## Backend APIs

### Core API Endpoints
- ✅ POST /signup - Creates business profile
- ✅ POST /campaigns - Creates marketing campaign
- ✅ GET /items - Returns all stored items
- ✅ POST /items - Creates generic item
- ✅ POST /uploads/presign - Generates S3 upload URL
- ✅ All endpoints return proper JSON format
- ✅ CORS headers present on all responses
- ✅ Error handling with meaningful messages

### AI API Endpoints
- ✅ POST /ideas/generate - Returns ≥6 marketing ideas
- ✅ POST /creatives/generate - Returns captions, posters, video script
- ✅ POST /plan/generate - Returns budget allocation and 14-day schedule
- ✅ GET /competitors - Returns competitor ads by location
- ✅ POST /compare - Returns scorecard and counter-ad strategy
- ✅ Bedrock integration with fallback to mock responses
- ✅ All responses include success/error status

### Infrastructure
- ✅ DynamoDB table created with proper permissions
- ✅ S3 bucket configured with CORS for uploads
- ✅ Lambda functions have appropriate IAM roles
- ✅ API Gateway configured with CORS enabled
- ✅ Region set to ap-southeast-1

## Integration & Fallback

### API Integration
- ✅ Frontend calls real APIs when NEXT_PUBLIC_* env vars present
- ✅ Frontend falls back to mock data when env vars missing
- ✅ No errors when switching between real/mock modes
- ✅ Consistent data format between real and mock responses

### Mock Data Quality
- ✅ Mock data realistic for bakery business
- ✅ All JSON files properly formatted
- ✅ Ideas relevant to local KL bakery
- ✅ Competitor data includes local businesses
- ✅ Budget allocations add up to 100%
- ✅ Schedule covers 14 days with realistic posting times

## Demo Flow

### End-to-End Workflow
- ✅ Signup → Campaign → Ideas → Creatives → Competition → Plan
- ✅ Each step flows naturally to the next
- ✅ Demo completes in 2-3 minutes
- ✅ All forms pre-filled for smooth presentation
- ✅ No broken links or missing pages

### Performance
- ✅ Pages load within 2 seconds
- ✅ API calls complete within 5 seconds
- ✅ Images load properly (placeholder or real)
- ✅ No console errors in browser
- ✅ Mobile performance acceptable

## Quality Standards

### Code Quality
- ✅ TypeScript types defined for all data models
- ✅ Error boundaries and proper error handling
- ✅ Consistent code formatting
- ✅ No TODO placeholders in production code
- ✅ Comments explain complex logic

### User Experience
- ✅ Intuitive navigation and flow
- ✅ Clear loading states and feedback
- ✅ Responsive design works on mobile
- ✅ Accessible color contrast and fonts
- ✅ Professional appearance suitable for demo

### Documentation
- ✅ README files for setup instructions
- ✅ API documentation with examples
- ✅ Demo script for presentation
- ✅ Deployment guide with troubleshooting
- ✅ Clear acceptance criteria (this document)