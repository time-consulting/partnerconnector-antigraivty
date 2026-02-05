import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  PlayCircleIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  LockIcon,
  TrophyIcon,
  StarIcon,
  FileTextIcon,
  UsersIcon,
  TargetIcon,
  ShieldIcon,
  AlertTriangleIcon,
  CreditCardIcon,
  DollarSignIcon,
  TrendingUpIcon,
  SearchIcon,
  FilterIcon,
  ChevronRightIcon,
  XIcon,
  AwardIcon,
  FlameIcon,
  ZapIcon,
  RocketIcon,
  BanknoteIcon,
  PiggyBankIcon,
  BarChart3Icon,
  CalendarIcon,
  PhoneIcon,
  MessageCircleIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Removed unused framer-motion import

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'video' | 'interactive' | 'document' | 'quiz' | 'compliance';
  completed: boolean;
  locked: boolean;
  progress: number;
  points: number;
  prerequisites?: string[];
  content?: string;
  isRequired?: boolean;
  category: string;
  instructor?: string;
  rating?: number;
  enrolledCount?: number;
  lastUpdated?: string;
  tags?: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TrainingModulesProps {
  onModuleComplete: (moduleId: string) => void;
}

export default function TrainingModules({ onModuleComplete }: TrainingModulesProps) {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleStates, setModuleStates] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterByDifficulty, setFilterByDifficulty] = useState<string>('all');
  const [userProgress, setUserProgress] = useState({
    totalPoints: 1850,
    completedModules: 15,
    totalModules: 24,
    currentLevel: 'Gold Partner',
    nextLevel: 'Platinum Partner',
    pointsToNext: 1150,
    streak: 7
  });

  const categories = [
    { id: 'all', name: 'All Modules', count: 24 },
    { id: 'dojo-payments', name: 'Dojo Card Payments', count: 7 },
    { id: 'business-funding', name: 'Business Funding', count: 6 },
    { id: 'platform-usage', name: 'Platform Training', count: 5 },
    { id: 'compliance', name: 'Compliance & Legal', count: 3 },
    { id: 'advanced', name: 'Advanced Strategies', count: 2 }
  ];

  const trainingModules: TrainingModule[] = [
    {
      id: 'dojo-integration',
      title: 'Dojo Partnership Overview & Services',
      description: 'Master our featured payment partner Dojo and unlock premium commission opportunities',
      duration: '25 min',
      difficulty: 'Beginner',
      type: 'interactive',
      completed: true,
      locked: false,
      progress: 100,
      points: 150,
      isRequired: false,
      category: 'dojo-payments',
      content: `
# 🚀 Dojo Partnership Training - Complete Guide

## About Dojo - Your Premium Payment Partner

Dojo is the UK's fastest-growing payment provider, helping over 85,000+ businesses accept payments with confidence. As our featured partner, you have access to cutting-edge technology and award-winning customer service.

### Why Dojo is Perfect for Your Clients

#### Trust & Reliability
- **4.8/5 Trust Score** with over 1,200+ verified reviews
- FCA regulated and fully compliant with UK payment standards
- 24/7 customer support with award-winning service

#### Comprehensive Services
- **Card Payment Processing** - Competitive rates with transparent pricing
- **Mobile Card Readers** - Perfect for on-the-go businesses
- **POS Terminal Solutions** - Complete point-of-sale systems
- **Online Payment Gateway** - Secure e-commerce integration
- **Business Banking Integration** - Streamlined financial management
- **Inventory Management** - Built-in business tools
- **Real-time Analytics** - Comprehensive reporting dashboard

### Client Success Stories

> **Sarah Mitchell - Retail Business Owner**
> "Dojo has transformed our payment processing. The setup was seamless, rates are competitive, and their support team is outstanding. Highly recommend for any business looking to modernize their payments."
> ⭐⭐⭐⭐⭐ (Verified Review)

> **Marcus Thompson - Restaurant Owner**
> "The mobile terminals have been perfect for table service. Fast transactions, reliable connection, and the analytics help us understand our business better. Great investment."
> ⭐⭐⭐⭐⭐ (Verified Review)

### Commission Structure & LTV Methodology

#### Level 1 Commission: Upfront Revenue Share (60%)
- **Card Processing Referrals**: Commission calculated based on Lifetime Value (LTV) assessment
- **Payment Processing Setup**: Commission varies based on business profile analysis
- **Business Banking Integration**: Additional commission for connected services

#### How LTV Commission Calculation Works:
Our commission structure is based on comprehensive Lifetime Value analysis considering:
- **Product Mix**: Types of services the client will use over time
- **Equipment Requirements**: POS systems, card machines, and integrated solutions
- **Business Turnover**: Monthly processing volume and growth projections  
- **Transaction Analysis**: Average transaction values and frequency patterns
- **Card Type Split**: Debit vs credit card usage affecting processing costs
- **Industry Factors**: Specific needs and retention rates by sector

This ensures fair compensation based on the long-term value each deals brings to our partners.

### Perfect Client Types for Dojo

#### High-Success Industries:
1. **Retail Businesses** - In-store and online payment solutions
2. **Hospitality** - Restaurants, cafes, bars with mobile payment needs
3. **Professional Services** - Accountants, consultants, healthcare
4. **Healthcare** - Clinics, dental practices, wellness centers
5. **Beauty & Wellness** - Salons, spas, fitness studios
6. **Mobile Businesses** - Contractors, delivery services, events

### How to Position Dojo to Clients

#### Key Selling Points:
1. **Service Excellence** - "Award-winning customer service with UK-based support"
2. **Reliability** - "99.9% uptime with 24/7 technical support"
3. **Growth Tools** - "Built-in analytics and business management tools"
4. **Security** - "Bank-level security with full regulatory compliance"
5. **Value Assessment** - "Comprehensive cost analysis based on your business profile"

#### Opening Conversation:
*"I work with businesses like yours to ensure they have the right payment solutions for their needs. Rather than focusing solely on rates, we look at the complete picture - reliability, support, features, and total value. Would you be interested in a comprehensive review of your current payment setup to see if there are opportunities for improvement?"*

#### Important: Bill Upload for Accurate Assessment
**Always request current supplier bills for accurate LTV calculation:**
- Upload bills from your current payment processor within the last 6 months
- Include your **highest volume months** for accurate assessment
- *Note: In December, focus on bills from June onwards to capture peak trading*
- This ensures commission calculation reflects true business value

### Implementation Process

#### Step 1: Initial Discovery (5-10 minutes)
- Current payment provider and monthly volume
- Pain points with existing solution
- Business goals and growth plans

#### Step 2: Proposal Creation (Same day)
- Comprehensive value assessment based on uploaded bills
- LTV analysis considering all business factors
- Service benefits specific to their business type
- Implementation timeline and support plan

#### Step 3: Handoff to Dojo (24-48 hours)
- Warm introduction to dedicated Dojo account manager
- Technical setup consultation scheduled
- Commission tracking activated in your dashboard

### Best Practices for Success

#### Do's:
✅ Focus on cost savings and improved service
✅ Use real client testimonials and case studies
✅ Offer to review their current processing statements
✅ Emphasize the quality of Dojo's UK-based support
✅ Highlight industry-specific benefits

#### Don'ts:
❌ Oversell or make unrealistic promises
❌ Rush the discovery process
❌ Skip the needs analysis
❌ Forget to set proper expectations on implementation time

### Your Action Plan

1. **Week 1**: Review your current client base for payment processing opportunities
2. **Week 2**: Reach out to 5 prospects using the positioning scripts provided
3. **Week 3**: Schedule discovery calls and gather payment processing statements
4. **Week 4**: Submit your first Dojo deals and track commission

### Support Resources

- **Dojo Partner Portal**: Access rates, collateral, and client onboarding tools
- **Live Chat Support**: Direct line to Dojo partnership team
- **Monthly Partner Webinars**: Latest product updates and sales techniques
- **Commission Dashboard**: Real-time tracking of all your Dojo deals

Remember: Dojo isn't just a product - it's a partnership that grows with your clients' success. Focus on long-term value creation rather than quick sales.
`
    },
    {
      id: 'business-funding-intro',
      title: 'Business Funding & Merchant Cash Advances',
      description: 'Learn how to offer flexible funding solutions to help businesses grow',
      duration: '22 min',
      difficulty: 'Beginner',
      type: 'interactive',
      completed: false,
      locked: false,
      progress: 0,
      points: 180,
      isRequired: false,
      category: 'business-funding',
      instructor: 'Marcus Thompson',
      rating: 4.8,
      enrolledCount: 623,
      lastUpdated: '2025-09-12',
      tags: ['funding', 'cash-advance', 'business-growth'],
      content: `
# 💵 Business Funding Training - Complete Guide

## Introduction to Business Funding Solutions

Business funding represents significant commission opportunities through our LTV-based structure. Every business needs cash flow solutions, making this a valuable service area for building long-term client relationships.

## Types of Funding We Offer

### 1. Merchant Cash Advance (MCA)
**Best for**: Businesses with consistent card sales
**Funding Range**: Available for various business needs
**Repayment**: Flexible daily percentage based on card sales
**Approval Time**: 24-48 hours
**Commission**: Calculated using LTV methodology based on funding amount and business profile

#### How It Works:
1. Business receives lump sum upfront
2. Repays through daily card sales deductions
3. Higher sales days = higher repayments
4. Lower sales days = lower repayments
5. Flexible and cash-flow friendly

### 2. Unsecured Business Loans
**Best for**: Established businesses with good credit
**Funding Range**: Suitable for various business requirements
**Term**: Flexible terms available
**Structure**: Competitive rates based on business assessment
**Commission**: LTV-based calculation considering loan value and business factors

### 3. Asset-Based Lending
**Best for**: Businesses with valuable equipment/property
**Funding Range**: Substantial funding available for established businesses
**Security**: Secured against business assets
**Commission**: Higher LTV calculations due to secured nature and larger amounts

## Perfect Funding Candidates

### High-Success Businesses:
1. **Restaurants & Hospitality**
   - Seasonal cash flow needs
   - Equipment upgrades
   - Expansion opportunities

2. **Retail Businesses**
   - Stock purchases
   - Seasonal inventory
   - Store renovations

3. **Healthcare Practices**
   - Equipment financing
   - Practice expansion
   - Staff hiring

4. **Professional Services**
   - Office setup
   - Technology upgrades
   - Marketing campaigns

### Red Flags to Avoid:
❌ New businesses (< 6 months trading)
❌ Declining revenue trends
❌ Multiple existing funding arrangements
❌ Poor credit history (for unsecured loans)
❌ Cash-only businesses

## Qualification Process

### Initial Questions:
1. "How long have you been trading?"
2. "What's your monthly turnover?"
3. "Do you currently have any business funding?"
4. "What would you use the funding for?"
5. "Do you take card payments?"

### Required Information & Bill Upload Process:
- **Trading History**: Minimum 6 months
- **Monthly Revenue**: Assessment varies by product type
- **Current Supplier Bills**: **Upload highest bills from last 6 months** for accurate LTV assessment
- **Bank Statements**: Last 3 months
- **ID & Address Proof**: Directors
- **Business Information**: Company house details

#### Critical: Upload Current Supplier Bills
**For accurate commission calculation, always request:**
- Upload bills from current funding provider (if any)
- Focus on **highest volume/cost months** within 6 months
- *Seasonal tip: In December, emphasize bills from June onwards*
- This ensures LTV calculation reflects true business funding needs

## Positioning & Sales Scripts

### Opening Approach:
*"I help businesses like yours access growth capital quickly and easily. Most business owners don't realize there are funding options that don't require personal guarantees or lengthy approval processes. Are you looking at any growth opportunities that could benefit from additional working capital?"*

### Merchant Cash Advance Positioning:
*"This isn't a traditional loan - it's a cash advance against your future card sales. So if you have a quiet day, you pay less back. If you have a busy day, you pay more. It flexes with your business, and there's no set monthly payment to worry about."*

### Benefits to Emphasize:
✅ **Quick Approval**: Decisions within 24-48 hours
✅ **Flexible Repayments**: Based on actual sales performance
✅ **No Personal Guarantees**: For most MCA products
✅ **Use for Anything**: Equipment, stock, expansion, cash flow
✅ **UK-Based Team**: Direct support throughout the process

## Commission Structure & LTV Methodology

### How Funding Commissions Are Calculated:
Using our £250 per £10,000 base rate, commissions are calculated through LTV analysis:

#### LTV Factors for Business Funding:
- **Funding Amount**: Base £250 per £10,000 structure  
- **Business Profile**: Industry, trading history, growth potential
- **Product Type**: MCA, loans, or asset-based lending
- **Repayment Terms**: Longer terms = higher LTV value
- **Cross-sell Potential**: Payment processing, insurance, equipment
- **Risk Assessment**: Security, credit profile, business stability

#### Commission Levels:
- **Level 1 (Direct)**: 60% of calculated LTV commission
- **Level 2 (Team)**: 20% ongoing from team member success
- **Level 3 (Network)**: 10% ongoing from extended network

### Building Monthly Income:
While direct funding deals provide upfront commissions, focus on team building to create consistent monthly income through the 20% and 10% ongoing structure.

## Real Client Success Stories

### Case Study 1: Italian Restaurant
**Challenge**: Needed funding for kitchen refurbishment
**Solution**: Merchant Cash Advance tailored to their needs
**Outcome**: Kitchen upgraded, 40% increase in covers, cross-sold payment processing
**Result**: Upfront commission plus ongoing monthly income from payment processing

### Case Study 2: Dental Practice
**Challenge**: Equipment purchase for digital scanner
**Solution**: Asset-based lending with competitive terms
**Outcome**: Reduced treatment times, increased capacity, equipment financing package
**Result**: Substantial commission reflecting LTV of large equipment financing plus growth potential

### Case Study 3: Online Retailer
**Challenge**: Stock purchase for seasonal peak
**Solution**: Unsecured loan with flexible terms
**Outcome**: 200% sales increase during peak season, added payment processing
**Result**: Commission based on LTV methodology plus ongoing income from increased payment processing

## Objection Handling

**"Interest rates seem high"**
→ "You're right to consider the cost, but let's look at the return on investment. If this funding helps you increase revenue by even 20%, the ROI is significant. Plus, with our flexible products, you're only paying when you're earning."

**"We'll speak to our bank first"**
→ "Absolutely, you should explore all options. What I find is that traditional banks can take 6-12 weeks and often require extensive security. We can get you an approval in principle within 24 hours at no cost, so you can compare properly."

**"We don't want debt"**
→ "I understand that completely. Our merchant cash advance isn't actually debt - it's purchasing your future sales at a discount. You're in complete control of repayments through your sales volume."

## Your Action Plan

### Week 1-2: Learning & Setup
- Complete this module and quiz
- Review client qualification criteria
- Practice positioning scripts
- Identify 20 potential prospects

### Week 3-4: Prospecting & Qualification
- Contact 10 warm prospects
- Qualify 5 serious opportunities
- Submit 2 applications
- Track results in your dashboard

### Monthly Target:
- **Conversations**: 40 qualified prospects
- **Applications**: 8 submitted
- **Approvals**: 3-4 (37.5% conversion rate)
- **Commission Earned**: £3,600-4,800

Remember: Business funding solves real problems and helps businesses grow. You're not selling debt - you're providing growth capital that can transform a business.
`
    },
    {
      id: 'platform-dashboard-navigation',
      title: 'Platform Dashboard & Navigation Mastery',
      description: 'Complete guide to using the PartnerConnector platform effectively',
      duration: '15 min',
      difficulty: 'Beginner',
      type: 'interactive',
      completed: true,
      locked: false,
      progress: 100,
      points: 100,
      isRequired: false,
      category: 'platform-usage',
      instructor: 'Platform Team',
      rating: 4.7,
      enrolledCount: 1205,
      lastUpdated: '2025-09-13',
      tags: ['dashboard', 'navigation', 'platform-basics'],
      content: `
# 📊 Platform Dashboard Training

## Dashboard Overview

Your PartnerConnector dashboard is your command center for managing deals, tracking commissions, and building your partner network.

### Key Dashboard Sections:

#### 1. Performance Overview
- **Monthly Earnings**: Real-time commission tracking
- **Active Deals**: Pipeline management
- **Team Performance**: Monitor your network's success
- **Achievement Progress**: Track training and milestones

#### 2. Referral Management
- **Submit New Deal**: Quick deals submission
- **Track Status**: Real-time deals progress
- **Commission Calculator**: Estimate earnings
- **Client Communication**: Built-in messaging system

#### 3. Team Building
- **Invite Partners**: Send team invitations
- **Team Analytics**: Monitor team performance
- **Commission Overrides**: Track level 2 & 3 earnings
- **Training Progress**: See team development

### Navigation Tips:

✅ **Bookmarks**: Save frequently used pages
✅ **Quick Actions**: Use keyboard shortcuts
✅ **Mobile App**: Access on-the-go
✅ **Notifications**: Enable key alerts
✅ **Export Data**: Download reports for analysis
`
    },
    {
      id: 'deals-submission-process',
      title: 'Referral Submission & Tracking System',
      description: 'Step-by-step guide to submitting and managing client deals',
      duration: '12 min',
      difficulty: 'Beginner',
      type: 'interactive',
      completed: false,
      locked: false,
      progress: 0,
      points: 120,
      isRequired: true,
      category: 'platform-usage',
      instructor: 'Sarah Mitchell',
      rating: 4.9,
      enrolledCount: 987,
      lastUpdated: '2025-09-11',
      tags: ['deals', 'submission', 'tracking'],
      content: `
# 📈 Referral Submission Training

## The Complete Referral Process

### Step 1: Client Discovery & Qualification
**Before submitting any deals**, ensure the client meets our criteria:

#### Dojo Card Payments:
✅ Currently taking card payments OR planning to
✅ Monthly turnover £1,000+
✅ UK-based business
✅ Trading for 3+ months

#### Business Funding:
✅ Trading 6+ months
✅ Monthly revenue £5,000+
✅ Takes card payments (for MCA)
✅ Clear funding purpose

### Step 2: Information Gathering

#### Required Information:
- **Business Details**: Name, address, company number
- **Contact Information**: Decision maker details
- **Current Situation**: Existing providers, pain points
- **Requirements**: Specific needs and timeline
- **Financial Info**: Turnover, transaction volume

### Step 3: Referral Submission

#### Using the Dashboard:
1. Click "Submit New Deal"
2. Select service type (Dojo/Funding/Insurance)
3. Complete client information form
4. Add notes about client needs
5. Set follow-up reminders
6. Submit for processing

#### Quality Checklist:
✓ All required fields completed
✓ Contact details verified
✓ Client expectations set
✓ Service match confirmed
✓ Warm introduction scheduled

### Step 4: Handoff Process

#### What Happens Next:
1. **Automatic Acknowledgment**: You receive confirmation
2. **Partner Assignment**: Specialist assigned within 2 hours
3. **Client Contact**: Initial contact within 4 hours
4. **Progress Updates**: Real-time status updates
5. **Outcome Notification**: Final result within 48-72 hours

### Step 5: Tracking & Follow-up

#### Dashboard Tracking:
- **Status Updates**: Real-time deals progress
- **Communication Log**: All client interactions
- **Commission Tracking**: Estimated and confirmed earnings
- **Next Actions**: Your follow-up tasks

#### Status Definitions:
- **Submitted**: Awaiting assignment
- **In Progress**: Active discussion with client
- **Documentation**: Gathering required information
- **Approved**: Client approved for service
- **Live**: Service activated, commission due
- **Declined**: Client not suitable/interested

### Commission Payment Timeline:

#### Dojo Card Payments:
- **Commission Confirmed**: When client goes live
- **Payment Processing**: Monthly on 15th
- **Typical Timeline**: 4-6 weeks from deals

#### Business Funding:
- **Commission Confirmed**: When funds are drawn
- **Payment Processing**: Within 7 days
- **Typical Timeline**: 2-3 weeks from deals

### Best Practices for Success:

#### Do's:
✅ **Pre-qualify thoroughly** - saves everyone time
✅ **Set clear expectations** with clients
✅ **Provide complete information** in deals form
✅ **Stay engaged** throughout the process
✅ **Follow up promptly** on any requests

#### Don'ts:
❌ Don't submit unqualified deals
❌ Don't promise specific rates or terms
❌ Don't go silent after submission
❌ Don't bypass the deals system
❌ Don't submit duplicates

### Troubleshooting Common Issues:

**"Client isn't responding to our calls"**
→ Contact the client yourself to re-engage, then provide updated contact details

**"Referral was declined"**
→ Review feedback and understand why - use this learning for future deals

**"Commission amount seems wrong"**
→ Check the commission calculator and contact support if there's a discrepancy

**"Client wants to work directly with you"**
→ All business must go through the platform to ensure commission tracking

### Your Success Metrics:

#### Quality Indicators:
- **Approval Rate**: Target 60%+ (industry average: 35%)
- **Response Rate**: Target 80%+ client engagement
- **Processing Time**: Average 48 hours to outcome
- **Commission Value**: Average £400+ per deals

#### Weekly Goals:
- **Qualified Conversations**: 10 potential clients
- **Referral Submissions**: 3-4 quality deals
- **Follow-up Actions**: Complete all dashboard tasks
- **Success Rate**: 2-3 approvals per week

Remember: Quality over quantity. One well-qualified, properly submitted deals is worth more than five poor-quality submissions.
`
    },
    {
      id: 'gdpr-compliance',
      title: 'GDPR Data Protection Training',
      description: 'Essential GDPR compliance training for handling client data (REQUIRED)',
      duration: '20 min',
      difficulty: 'Beginner',
      type: 'compliance',
      completed: true,
      locked: false,
      progress: 100,
      points: 100,
      isRequired: true,
      category: 'compliance',
      content: `
# GDPR Data Protection Training

## What is GDPR?
The General Data Protection Regulation (GDPR) is EU legislation that governs how organizations handle personal data. As a partner dealing with client information, you must understand and comply with these regulations.

## Key Principles of GDPR

### 1. Lawfulness, Fairness, and Transparency
- Personal data must be processed lawfully, fairly, and transparently
- Individuals must be informed about how their data is used
- Data collection must have a clear legal basis

### 2. Purpose Limitation
- Data can only be collected for specified, explicit, and legitimate purposes
- Data cannot be used for purposes incompatible with the original purpose
- Business deals data must only be used for processing applications

### 3. Data Minimization
- Only collect data that is necessary for the specified purpose
- Avoid collecting excessive or irrelevant information
- Regularly review and delete unnecessary data

### 4. Accuracy
- Personal data must be accurate and kept up to date
- Incorrect data must be corrected or deleted without delay
- Implement processes to verify data accuracy

### Your Responsibilities as a Partner:

#### Data Collection:
✅ Only collect information necessary for deals
✅ Explain why you need each piece of information
✅ Get explicit consent before collecting sensitive data
✅ Store information securely (encrypted, password-protected)

#### Data Sharing:
✅ Only share with authorized PartnerConnector systems
✅ Use secure transmission methods
✅ Never share data with unauthorized third parties
✅ Delete local copies once deals is submitted

#### Client Rights:
Clients have the right to:
- Know what data you're collecting
- Access their personal data
- Correct inaccurate information
- Request data deletion
- Withdraw consent at any time

#### Compliance Best Practices:

1. **Minimal Data Collection**: Only ask for what you need
2. **Clear Communication**: Explain your privacy policy
3. **Secure Storage**: Use encrypted, password-protected systems
4. **Regular Deletion**: Remove old data you no longer need
5. **Incident Reporting**: Report any data breaches immediately

*Completion of this module is required before you can submit deals.*

### 5. Storage Limitation
- Data should not be kept longer than necessary
- Establish retention periods for different types of data
- Implement secure deletion procedures

### 6. Integrity and Confidentiality
- Implement appropriate security measures
- Protect against unauthorized access, loss, or damage
- Use encryption and secure transmission methods

## Your Responsibilities as a Partner

### Data Collection
- Only collect data necessary for processing deals
- Obtain proper consent from clients
- Clearly explain how data will be used
- Provide privacy notices and terms

### Data Storage
- Store data securely using our platform
- Never store client data on personal devices
- Use strong passwords and two-factor authentication
- Report any data breaches immediately

### Data Sharing
- Only share data with authorized PartnerConnector staff
- Never share client data with third parties without consent
- Use secure communication channels
- Follow our data sharing protocols

### Client Rights
Under GDPR, clients have the right to:
- Access their personal data
- Correct inaccurate data
- Delete their data (right to be forgotten)
- Restrict processing
- Data portability
- Object to processing

## Data Breach Procedures

### If You Suspect a Data Breach:
1. **Immediately** notify PartnerConnector security team
2. Document what happened and when
3. Do not attempt to fix the issue yourself
4. Preserve evidence for investigation
5. Follow all instructions from our security team

### What Constitutes a Data Breach:
- Unauthorized access to client data
- Accidental sharing of confidential information
- Loss of devices containing client data
- Cyber attacks or security incidents
- System failures exposing data

## Compliance Checklist

### Before Collecting Data:
□ Verify you have a legal basis for collection
□ Ensure data is necessary for the deals process
□ Provide clear privacy notice to the client
□ Obtain proper consent where required

### During Data Processing:
□ Only access data necessary for your work
□ Keep data secure and confidential
□ Report any issues immediately
□ Follow our data handling procedures

### Data Retention:
□ Do not keep data longer than necessary
□ Follow our retention schedules
□ Securely delete data when no longer needed
□ Document data disposal

## Penalties for Non-Compliance

GDPR violations can result in:
- Fines up to €20 million or 4% of annual turnover
- Criminal charges in severe cases
- Suspension of partner privileges
- Legal liability for damages
- Reputational damage

## Best Practices for Partners

### Data Security:
- Use only company-approved systems
- Enable two-factor authentication
- Use strong, unique passwords
- Lock devices when not in use
- Work in private, secure locations

### Communication:
- Use encrypted email for sensitive data
- Verify recipient identities before sharing data
- Avoid discussing client data in public
- Use secure phone lines for sensitive calls

### Documentation:
- Keep records of consent obtained
- Document data processing activities
- Record any data subject requests
- Maintain audit trails

## Partner Certification Requirements

To become GDPR certified, you must:
1. Read this entire training module
2. Acknowledge understanding of each section
3. Pass the GDPR compliance quiz
4. Agree to follow all GDPR procedures
5. Complete annual refresher training

Failure to maintain GDPR compliance may result in:
- Suspension of partner privileges
- Termination of partnership agreement
- Legal action for damages
- Reporting to data protection authorities

## Contact Information

For GDPR questions or to report issues:
- **Data Protection Officer**: dpo@partnerconnector.co.uk
- **Security Team**: security@partnerconnector.co.uk
- **Emergency Hotline**: +44 (0) 800 123 4567

Remember: When in doubt, ask! It's better to check than risk a data breach.
      `
    },
    {
      id: 'getting-started',
      title: 'Getting Started with PartnerConnector',
      description: 'Learn the basics of our platform and how to start earning commissions',
      duration: '15 min',
      difficulty: 'Beginner',
      type: 'interactive',
      completed: true,
      locked: false,
      progress: 100,
      points: 50,
      category: 'platform-usage',
      content: `
# Getting Started with PartnerConnector

## Welcome to PartnerConnector!

Congratulations on joining our partner network! You're now part of a professional community that helps businesses access essential financial services while earning substantial commissions.

## Platform Overview

### What We Do
PartnerConnector specializes in connecting businesses with:
- Payment processing solutions (card machines, online payments)
- Business funding and merchant cash advances
- Financial technology services
- Banking and business accounts

### Your Role as a Partner
As a PartnerConnector partner, you will:
- Identify businesses that need our services
- Submit deals through our platform
- Earn commissions on successful applications
- Build long-term relationships with clients
- Access ongoing training and support

## Commission Structure

### Level 1 Partners (Bronze)
- **Payment Processing**: Upfront commissions on successful deals
- **Business Funding**: £300-£1,500 per successful deals
- **Minimum Requirements**: Complete training modules

### Level 2 Partners (Silver)
- **Payment Processing**: 20% ongoing commission from team members
- **Business Funding**: £400-£2,000 per successful deals
- **Requirements**: 10+ successful deals, advanced certification

### Level 3 Partners (Gold/Extended Network)
- **Payment Processing**: 10% ongoing commission from extended network
- **Business Funding**: £500-£2,500 per successful deals
- **Requirements**: 25+ successful deals, master certification

## Getting Your First Referral

### Step 1: Identify Opportunities
Look for businesses that:
- Accept card payments
- Have high transaction volumes
- Need funding for growth
- Are unhappy with current providers
- Want better rates or service

### Step 2: Initial Conversation
- Introduce yourself as a PartnerConnector partner
- Ask about their current payment processing setup
- Identify pain points or opportunities
- Explain how we can help
- Gauge their interest level

### Step 3: Submit the Deal
- Use our online deals form
- Provide complete business information
- Include contact details and best times to call
- Add notes about their specific needs
- Upload any supporting documents

### Step 4: Follow Up
- Stay in touch with your client
- Support them through the application process
- Address any questions or concerns
- Celebrate successful approvals!

## Platform Features

### Dashboard
- View your deals pipeline
- Track commission earnings
- Monitor application statuses
- Access training materials

### Referral System
- Easy-to-use submission forms
- Document upload capability
- Automated status updates
- Commission tracking

### Resources
- Sales materials and brochures
- Email templates
- Pricing guides
- Training videos

### Support
- Dedicated partner support team
- Live chat assistance
- Phone support during business hours
- Comprehensive knowledge base

## Best Practices for Success

### Building Relationships
- Focus on helping businesses, not just making sales
- Listen to their specific needs and challenges
- Provide value through your expertise
- Maintain regular contact with clients

### Professional Approach
- Always present yourself professionally
- Use our branded materials and resources
- Be knowledgeable about our services
- Set realistic expectations

### Time Management
- Plan your prospecting activities
- Follow up consistently
- Use our CRM tools effectively
- Track your progress and results

## Next Steps

1. **Complete this training module**
2. **Take the platform tour**
3. **Review our service offerings**
4. **Download sales materials**
5. **Submit your first deals**

Ready to start earning? Let's move on to learning about our payment processing solutions!
      `
    },
    {
      id: 'payment-processing',
      title: 'Payment Processing Solutions',
      description: 'Understand card machines, online payments, and processing rates',
      duration: '25 min',
      difficulty: 'Beginner',
      type: 'interactive',
      completed: true,
      locked: false,
      progress: 100,
      points: 75,
      category: 'dojo-payments',
      content: `
# Payment Processing Solutions Training

## Introduction to Payment Processing

Payment processing is the backbone of modern business transactions. Understanding how it works and the solutions we offer is crucial for your success as a partner.

## Types of Payment Processing

### Card Present Transactions
- **Chip & PIN**: Most secure for in-person transactions
- **Contactless**: Fast and convenient for small amounts
- **Magnetic Stripe**: Legacy technology, being phased out
- **Mobile Wallets**: Apple Pay, Google Pay, Samsung Pay

### Card Not Present Transactions
- **Online Payments**: E-commerce websites
- **Phone Orders**: Mail Order/Telephone Order (MOTO)
- **Recurring Payments**: Subscriptions and memberships
- **Invoice Payments**: Pay-by-link solutions

## Our Payment Solutions

### Card Machines
**Portable Solutions**:
- PAX A920: Full-featured Android terminal
- Ingenico Move/5000: Reliable and robust
- Battery life: 8+ hours of continuous use
- 4G connectivity with WiFi backup

**Countertop Solutions**:
- PAX A77: High-performance terminal
- Ingenico Desk/5000: Traditional reliability
- Ethernet and WiFi connectivity
- Integrated receipt printing

**Mobile Solutions**:
- SumUp Air: Bluetooth card reader
- Square Reader: Simple smartphone integration
- Zettle Reader: Compact and affordable
- Perfect for mobile businesses

### Online Payment Gateways
**Features Include**:
- Secure payment pages
- Multiple payment methods
- Fraud protection
- Real-time reporting
- API integration
- Recurring billing

**Supported Payment Methods**:
- All major credit/debit cards
- Digital wallets (PayPal, Apple Pay, Google Pay)
- Buy now, pay later (Klarna, Clearpay)
- Bank transfers and direct debits

## Processing Rates and Fees

### Card Present Rates
- **Debit Cards**: 0.20% + 1p per transaction
- **UK Credit Cards**: 0.60% + 1p per transaction
- **Commercial Cards**: 1.10% + 1p per transaction
- **International Cards**: 2.30% + 1p per transaction

### Card Not Present Rates
- **Online Transactions**: Add 0.30% to card present rates
- **Phone/Mail Orders**: Add 0.50% to card present rates
- **High-risk Industries**: Custom pricing available

### Additional Fees
- **Monthly Minimum**: £15 per month
- **PCI Compliance**: £5 per month
- **Chargeback Fee**: £15 per incident
- **Terminal Rental**: £15-£25 per month

## Commission Opportunities

### Card Machine Placements
- **Installation Commission**: £100-£200 per machine
- **Monthly Residuals**: 20-40% of processing fees
- **Lifetime Value**: £2,000-£5,000 per client

### Online Gateway Setup
- **Setup Commission**: £150-£300 per client
- **Monthly Residuals**: 25-50% of processing fees
- **High-volume merchants**: £5,000+ per year potential

## Identifying Opportunities

### Target Businesses
**High-Volume Merchants**:
- Restaurants and cafes
- Retail stores
- Service businesses
- E-commerce sites
- Professional services

**Pain Points to Identify**:
- High processing fees
- Poor customer service
- Outdated equipment
- Limited payment options
- No online capabilities

### Qualifying Questions
1. "What payment methods do you currently accept?"
2. "How much do you process in card payments monthly?"
3. "What are you paying in processing fees?"
4. "Are you happy with your current provider?"
5. "Do you accept online payments?"

## Competitive Advantages

### Our Strengths
- **Competitive Rates**: Often 20-30% lower than incumbents
- **No Setup Fees**: We cover all installation costs
- **24/7 Support**: UK-based technical support
- **Same-Day Setup**: Fast deployment available
- **Transparent Pricing**: No hidden fees

### Common Objections and Responses

**"We're happy with our current provider"**
Response: "That's great to hear! Many of our best clients said the same thing before discovering they could save £200-£500 per month while getting better service. Would you be interested in a free review to confirm you're getting the best deal?"

**"We don't want to change systems"**
Response: "I completely understand. The good news is we make the transition seamless. We handle all the technical setup, and you can keep your existing processes. Most clients are surprised how easy it is."

**"We're locked into a contract"**
Response: "No problem at all. We can review your current contract and often help with any early termination fees because the savings are so significant. Many clients find they're actually out of their minimum term."

## Sales Process

### Initial Consultation
1. **Research the business** before your visit
2. **Identify their current provider** and equipment
3. **Calculate their likely processing volume**
4. **Prepare relevant case studies**

### Needs Assessment
1. **Current payment methods** and volumes
2. **Processing costs** and fee structure
3. **Equipment age** and reliability
4. **Customer payment preferences**
5. **Growth plans** and future needs

### Proposal Development
1. **Rate comparison** with current provider
2. **Equipment recommendations**
3. **Implementation timeline**
4. **Cost-benefit analysis**
5. **Support and service benefits**

### Closing the Deal
1. **Address all objections** professionally
2. **Provide references** from similar businesses
3. **Offer trial periods** where appropriate
4. **Make the next steps** clear and simple

## Implementation Process

### Once a Client Says Yes
1. **Complete application** with business details
2. **Submit to underwriting** team
3. **Schedule installation** appointment
4. **Provide training** on new equipment
5. **Follow up** to ensure satisfaction

### Timeline
- **Application to approval**: 1-3 business days
- **Equipment delivery**: 2-5 business days
- **Installation and training**: 30-60 minutes
- **Go-live**: Same day as installation

## Ongoing Relationship Management

### Monthly Check-ins
- Review processing volumes and fees
- Identify additional opportunities
- Address any service issues
- Discuss business growth plans

### Upselling Opportunities
- Additional terminals for busy periods
- Online payment gateway setup
- Point of sale system integration
- Business funding for expansion

Remember: Payment processing is just the beginning of a long-term partnership. Focus on building relationships and providing ongoing value to maximize your commission potential.
      `
    },
    {
      id: 'business-funding',
      title: 'Business Funding & Merchant Cash Advance',
      description: 'Learn about funding options and how to qualify businesses',
      duration: '30 min',
      difficulty: 'Intermediate',
      type: 'interactive',
      completed: false,
      locked: false,
      progress: 0,
      points: 100,
      category: 'business-funding',
      content: `
# Business Funding & Merchant Cash Advance Training

## Introduction to Business Funding

Business funding is one of our highest-commission services, with potential earnings of £300-£2,500 per successful deals. Understanding how to identify, qualify, and present funding opportunities is essential for maximizing your income.

## Types of Business Funding We Offer

### Merchant Cash Advance (MCA)
**How it works:**
- Advance against future card sales
- Repaid through daily card processing
- Flexible repayment based on sales volume
- No fixed monthly payments

**Typical Terms:**
- Amount: £5,000 - £500,000
- Factor Rate: 1.2 - 1.4 (equivalent to 20-40% total cost)
- Repayment: 10-25% of daily card sales
- Term: 3-18 months depending on sales volume

### Business Loans
**Traditional term loans:**
- Fixed monthly payments
- Lower cost than MCA
- Longer repayment terms
- Requires stronger credit

**Typical Terms:**
- Amount: £10,000 - £250,000
- Interest Rate: 8-25% APR
- Term: 6 months - 5 years
- Fixed monthly payments

### Invoice Finance
**For B2B businesses:**
- Advance against outstanding invoices
- Immediate cash flow improvement
- Customers pay invoices normally
- We collect payment directly

### Equipment Finance
**For specific equipment purchases:**
- Machinery and equipment funding
- Vehicle financing
- Technology and software
- Equipment serves as collateral

## Commission Structure

### Merchant Cash Advance
- **Small advances** (£5k-£25k): £300-£600 commission
- **Medium advances** (£25k-£75k): £600-£1,200 commission
- **Large advances** (£75k+): £1,200-£2,500 commission

### Business Loans
- **0.5-1.5%** of funded amount
- **Minimum**: £250 per deal
- **Maximum**: £2,000 per deal

### Recurring Revenue
- **Trail commission**: 0.1-0.3% on renewals
- **Lifetime value**: £500-£3,000 per client

## Qualifying Businesses for Funding

### Ideal MCA Candidates
**Business Profile:**
- Trading for 6+ months
- Monthly card sales: £8,000+
- Consistent revenue patterns
- Seasonal businesses welcome

**Industries that work well:**
- Restaurants and cafes
- Retail stores
- Beauty salons
- Professional services
- E-commerce businesses

### Credit Requirements
**For MCA:**
- Personal credit score: 500+
- No recent bankruptcies
- Current on existing obligations
- Minimal credit requirements

**For Traditional Loans:**
- Personal credit score: 650+
- Strong business financials
- Collateral may be required
- Detailed financial history

## The Funding Process

### Initial Assessment
1. **Monthly Revenue**: What's their monthly turnover?
2. **Card Processing**: How much via card payments?
3. **Time in Business**: How long operating?
4. **Funding Need**: What's the money for?
5. **Credit History**: Any major issues?

### Application Process
1. **Submit application** with basic business info
2. **Provide bank statements** (3-6 months)
3. **Credit check** (soft pull initially)
4. **Review and underwriting** (24-48 hours)
5. **Offer presentation** and acceptance
6. **Funding** (24-48 hours after acceptance)

### Documentation Required
**For MCA:**
- Bank statements (3 months minimum)
- Processing statements (if applicable)
- Business license/registration
- Photo ID of business owner

**For Traditional Loans:**
- Financial statements (P&L, Balance Sheet)
- Tax returns (business and personal)
- Bank statements (6 months)
- Business plan (for larger amounts)

## Identifying Funding Opportunities

### Warning Signs of Cash Flow Issues
- Slow-paying customers
- Seasonal business fluctuations
- Equipment breakdowns
- Expansion opportunities
- Marketing campaign needs
- Inventory requirements
- Staff hiring needs

### Conversation Starters
"I noticed you're quite busy - are you looking at expanding?"
"How's business been? Any plans for growth this year?"
"I work with a lot of businesses like yours who need capital for expansion..."
"Have you ever looked into business funding for equipment or growth?"

### Qualifying Questions
1. "What would you do with an extra £25,000 in your business?"
2. "How much do you process in card payments monthly?"
3. "Have you applied for business funding before?"
4. "What's your biggest challenge in growing the business?"
5. "How quickly would you need access to funds?"

## Overcoming Common Objections

### "Interest rates are too high"
**Response**: "I understand cost is important. Let's look at the return on investment. If this £25,000 helps you generate an extra £5,000 per month in revenue, the cost becomes much more reasonable. Plus, you only pay when you're making money through card sales."

### "We don't need funding right now"
**Response**: "That's actually the best time to secure funding - when you don't desperately need it. Having access to capital when opportunities arise can be the difference between growing and staying stagnant. Would you like to know what you'd qualify for, just to have the option?"

### "Banks turned us down"
**Response**: "That's exactly why alternative funding exists. Banks have very strict criteria and slow processes. Our lenders specialize in working with businesses like yours and can often approve deals that banks won't touch. The application is simple and there's no obligation."

### "We're worried about daily payments"
**Response**: "I understand that concern. The beauty of merchant cash advance is that payments automatically adjust to your sales. Busy day = slightly higher payment. Slow day = lower payment. It's designed to work with your cash flow, not against it."

## Calculating Funding Potential

### MCA Quick Calculator
**Daily sales method:**
Average daily card sales × 30 = Monthly card sales
Monthly card sales × 10 = Potential funding amount

**Example:**
£800 daily card sales × 30 = £24,000 monthly
£24,000 × 10 = £240,000 potential funding

### Affordability Assessment
**Comfortable payment rate: 8-12% of daily sales**
**Maximum payment rate: 15-20% of daily sales**

**Example with £800 daily sales:**
- Comfortable: £64-£96 daily payment
- Maximum: £120-£160 daily payment

## Best Practices for Funding Sales

### Building Trust
- Be transparent about costs and terms
- Explain how the process works clearly
- Provide references from similar businesses
- Show examples of successful funding cases

### Professional Presentation
- Use our funding calculators and materials
- Present multiple options when available
- Show clear benefit analysis
- Provide detailed term sheets

### Follow-up Strategy
- Check in during application process
- Help gather required documents
- Address concerns promptly
- Celebrate successful funding

### Relationship Management
- Monitor business performance post-funding
- Identify additional funding needs
- Refer for other services
- Ask for deals to other businesses

## Red Flags to Avoid

### Business Red Flags
- Declining sales trends
- Legal issues or disputes
- Poor credit with no explanation
- Unrealistic funding expectations
- Unwillingness to provide documentation

### Personal Red Flags
- Recent bankruptcy (under 2 years)
- Multiple recent credit inquiries
- Defaulted business loans
- Criminal financial fraud history

## Advanced Strategies

### Cross-selling Opportunities
- Start with payment processing
- Identify funding needs during setup
- Present funding as natural next step
- Bundle services for higher commissions

### Referral Networks
- Build relationships with accountants
- Connect with business brokers
- Partner with equipment suppliers
- Network with commercial real estate agents

### Market Specialization
- Focus on specific industries
- Become expert in their needs
- Build case studies and testimonials
- Develop industry-specific materials

Remember: Business funding changes lives and businesses. You're not just earning commission - you're helping businesses grow, hire staff, and achieve their dreams. Approach every opportunity with professionalism and genuine desire to help.
      `
    },
    {
      id: 'sales-techniques',
      title: 'Effective Sales Techniques',
      description: 'Master the art of consultative selling and building trust',
      duration: '35 min',
      difficulty: 'Intermediate',
      type: 'interactive',
      completed: false,
      locked: false,
      progress: 60,
      points: 125,
      category: 'advanced',
      content: `
# Effective Sales Techniques Training

## Introduction to Consultative Selling

As a PartnerConnector partner, you're not just selling products - you're solving business problems and building long-term relationships. This training will teach you proven techniques to increase your success rate and commission earnings.

## The Consultative Selling Process

### 1. Research and Preparation
**Before any meeting:**
- Research the business online
- Check their current payment processing setup
- Understand their industry challenges
- Prepare relevant case studies
- Set clear meeting objectives

### 2. Building Rapport
**First impressions matter:**
- Dress professionally
- Arrive on time
- Show genuine interest in their business
- Ask about their background and experience
- Find common ground

### 3. Needs Discovery
**Ask the right questions:**
- "Tell me about your business..."
- "What are your biggest challenges?"
- "How do you currently handle payments?"
- "What would ideal service look like?"
- "What keeps you up at night about your business?"

### 4. Solution Presentation
**Focus on benefits, not features:**
- Address specific needs identified
- Use their language and terminology
- Provide relevant examples
- Quantify the value proposition
- Make it about them, not you

### 5. Handling Objections
**Welcome objections as buying signals:**
- Listen completely before responding
- Acknowledge their concerns
- Ask clarifying questions
- Provide evidence and proof
- Check for understanding

### 6. Closing the Sale
**Natural progression, not pressure:**
- Summarize agreed benefits
- Ask for the business directly
- Provide clear next steps
- Handle final concerns
- Get commitment and timeline

## Advanced Questioning Techniques

### Open-Ended Questions
Use these to gather information:
- "How does your current system work?"
- "What prompted you to look at alternatives?"
- "Describe your ideal solution..."
- "What would need to happen for this to work?"

### Probing Questions
Use these to go deeper:
- "Can you give me an example?"
- "What else is important to you?"
- "How is that affecting your business?"
- "What have you tried before?"

### Trial Closing Questions
Use these to test readiness:
- "How does that sound so far?"
- "What questions do you have about this?"
- "Which option appeals to you more?"
- "What would your partners think about this?"

### Commitment Questions
Use these to secure agreement:
- "Based on what we've discussed, does this make sense?"
- "Are you ready to move forward with this?"
- "What's the next step from your perspective?"
- "When would you like to get started?"

## Body Language and Communication

### Reading Buying Signals
**Positive signals:**
- Leaning forward
- Note-taking
- Asking detailed questions
- Discussing implementation
- Relaxed posture

**Negative signals:**
- Crossed arms
- Looking at watch/phone
- Avoiding eye contact
- Short responses
- Fidgeting

### Effective Communication
**Voice and tone:**
- Speak clearly and confidently
- Match their pace and energy
- Use appropriate volume
- Vary your tone for emphasis
- Pause for impact

**Body language:**
- Maintain appropriate eye contact
- Use open gestures
- Mirror their posture subtly
- Stay engaged and alert
- Use confident handshakes

## Building Trust and Credibility

### Establishing Expertise
- Share relevant experience
- Provide industry insights
- Offer valuable advice (even if not product-related)
- Show knowledge of their sector
- Reference similar successful clients

### Demonstrating Integrity
- Be honest about limitations
- Don't oversell or make unrealistic promises
- Admit when you don't know something
- Follow through on commitments
- Put their interests first

### Social Proof
- Share success stories from similar businesses
- Provide references and testimonials
- Show industry awards and certifications
- Mention well-known clients (with permission)
- Use case studies and data

## Handling Different Personality Types

### The Analytical Decision Maker
**Characteristics:**
- Wants detailed information
- Focuses on data and facts
- Takes time to decide
- Asks many questions

**How to sell to them:**
- Provide comprehensive documentation
- Use charts, graphs, and statistics
- Give them time to analyze
- Be prepared for detailed questions
- Follow up with additional information

### The Driver Decision Maker
**Characteristics:**
- Wants bottom-line results
- Makes quick decisions
- Values efficiency
- Dislikes small talk

**How to sell to them:**
- Get straight to the point
- Focus on results and ROI
- Present clear options
- Respect their time
- Ask for decision quickly

### The Expressive Decision Maker
**Characteristics:**
- Enjoys relationship building
- Likes to talk about vision
- Values recognition
- Makes emotional decisions

**How to sell to them:**
- Build strong rapport
- Focus on status and prestige
- Use success stories
- Show enthusiasm
- Make them feel important

### The Amiable Decision Maker
**Characteristics:**
- Values relationships
- Seeks consensus
- Avoids conflict
- Takes time to decide

**How to sell to them:**
- Build trust gradually
- Provide reassurance
- Show low-risk options
- Give testimonials from peers
- Offer trial periods

## Common Selling Mistakes to Avoid

### 1. Talking Too Much
- Listen more than you speak
- Ask questions and wait for answers
- Let them tell their story
- Avoid interrupting
- Use silence effectively

### 2. Leading with Price
- Establish value first
- Understand their needs completely
- Show ROI before cost
- Compare total cost of ownership
- Position price as investment

### 3. Making Assumptions
- Don't assume budget limitations
- Ask about decision-making process
- Verify understanding regularly
- Check their priorities
- Confirm next steps

### 4. Pressuring for Quick Decisions
- Respect their timeline
- Provide enough information
- Allow time for consideration
- Offer to answer additional questions
- Follow up appropriately

### 5. Not Following Up
- Send promised information promptly
- Check in regularly
- Provide additional value
- Stay top of mind
- Be persistent but respectful

## Advanced Closing Techniques

### The Assumptive Close
"When would you like to schedule the installation?"
"Should we set up the direct debit for the 1st or 15th?"
"I'll need your business banking details to get this started..."

### The Alternative Close
"Would you prefer the countertop terminal or the portable one?"
"Should we start with one location or roll out to all sites?"
"Do you want to begin next week or the week after?"

### The Summary Close
"So you like the competitive rates, the 24/7 support, and the quick setup. Based on everything we've discussed, does it make sense to move forward?"

### The Urgency Close
"I can hold this rate for you until Friday..."
"We have one terminal left in stock for next week delivery..."
"This promotion ends at month-end..."

### The Trial Close
"How about we start with a 30-day trial?"
"Would you like to test this with your busiest location first?"
"What if we could guarantee your satisfaction?"

## Objection Handling Framework

### Step 1: Listen
- Let them express their concern completely
- Don't interrupt or get defensive
- Take notes if appropriate
- Show you're taking it seriously

### Step 2: Acknowledge
- "I understand your concern..."
- "That's a valid point..."
- "I can see why that would worry you..."
- "Others have asked about that too..."

### Step 3: Clarify
- "Just to make sure I understand..."
- "Are you concerned about...?"
- "Is cost the only issue, or...?"
- "What specifically worries you about...?"

### Step 4: Respond
- Address the specific concern
- Provide evidence or proof
- Share relevant examples
- Offer alternatives if needed

### Step 5: Confirm
- "Does that address your concern?"
- "How does that sound?"
- "What other questions do you have?"
- "Are you comfortable moving forward now?"

## Building Long-Term Relationships

### Post-Sale Follow-Up
- Check satisfaction after installation
- Ensure they're getting expected results
- Address any issues promptly
- Look for additional opportunities
- Ask for deals

### Ongoing Value Creation
- Share industry insights
- Provide business advice
- Make valuable introductions
- Offer new services as appropriate
- Remember personal details

### Referral Generation
- Ask satisfied clients for deals
- Offer deals incentives
- Stay connected on social media
- Attend industry events together
- Build your professional network

Remember: The best salespeople are problem-solvers who genuinely care about their clients' success. Focus on helping businesses grow and thrive, and the sales will follow naturally.
      `
    }
  ];

  const handleModuleClick = (module: TrainingModule) => {
    if (module.locked) {
      toast({
        title: "Module Locked",
        description: "Complete the prerequisite modules first.",
        variant: "destructive",
      });
      return;
    }
    setSelectedModule(module.id);
  };

  const handleCompleteModule = (moduleId: string) => {
    // Handle GDPR compliance specially
    if (moduleId === 'gdpr-compliance') {
      const acknowledgments = moduleStates[moduleId]?.acknowledgments || {};
      const requiredSections = [
        'dataProtection',
        'clientRights', 
        'breachProcedures',
        'bestPractices',
        'penalties'
      ];
      
      const allAcknowledged = requiredSections.every(section => acknowledgments[section]);
      
      if (!allAcknowledged) {
        toast({
          title: "Acknowledgment Required",
          description: "You must acknowledge understanding of all GDPR sections before completing this module.",
          variant: "destructive",
        });
        return;
      }
    }

    onModuleComplete(moduleId);
    setSelectedModule(null);
    
    toast({
      title: "Module Completed!",
      description: `You've earned ${trainingModules.find(m => m.id === moduleId)?.points} points!`,
    });
  };

  const handleGDPRAcknowledgment = (section: string, checked: boolean) => {
    setModuleStates(prev => ({
      ...prev,
      'gdpr-compliance': {
        ...prev['gdpr-compliance'],
        acknowledgments: {
          ...prev['gdpr-compliance']?.acknowledgments,
          [section]: checked
        }
      }
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircleIcon className="w-5 h-5 text-red-600" />;
      case 'interactive': return <BookOpenIcon className="w-5 h-5 text-blue-600" />;
      case 'document': return <FileTextIcon className="w-5 h-5 text-green-600" />;
      case 'quiz': return <TargetIcon className="w-5 h-5 text-purple-600" />;
      case 'compliance': return <ShieldIcon className="w-5 h-5 text-orange-600" />;
      default: return <BookOpenIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderModuleContent = (module: TrainingModule) => {
    if (module.id === 'gdpr-compliance') {
      return (
        <div className="space-y-6">
          <ScrollArea className="h-96 border rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              {module.content?.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.substring(4)}</h3>;
                }
                if (line.startsWith('□ ')) {
                  return <div key={index} className="flex items-center space-x-2 my-2"><div className="w-4 h-4 border border-gray-400"></div><span>{line.substring(2)}</span></div>;
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4">{line.substring(2)}</li>;
                }
                if (line.trim() === '') {
                  return <br key={index} />;
                }
                return <p key={index} className="mb-2">{line}</p>;
              })}
            </div>
          </ScrollArea>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
                GDPR Compliance Acknowledgment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You must acknowledge that you understand and will comply with each section below:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="dataProtection" 
                    checked={moduleStates['gdpr-compliance']?.acknowledgments?.dataProtection || false}
                    onCheckedChange={(checked) => handleGDPRAcknowledgment('dataProtection', !!checked)}
                    data-testid="checkbox-data-protection"
                  />
                  <label htmlFor="dataProtection" className="text-sm font-medium leading-relaxed">
                    I understand the principles of data protection and will only collect, store, and process personal data in accordance with GDPR regulations.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="clientRights" 
                    checked={moduleStates['gdpr-compliance']?.acknowledgments?.clientRights || false}
                    onCheckedChange={(checked) => handleGDPRAcknowledgment('clientRights', !!checked)}
                    data-testid="checkbox-client-rights"
                  />
                  <label htmlFor="clientRights" className="text-sm font-medium leading-relaxed">
                    I understand client rights under GDPR and will respond appropriately to requests for access, correction, deletion, or restriction of processing.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="breachProcedures" 
                    checked={moduleStates['gdpr-compliance']?.acknowledgments?.breachProcedures || false}
                    onCheckedChange={(checked) => handleGDPRAcknowledgment('breachProcedures', !!checked)}
                    data-testid="checkbox-breach-procedures"
                  />
                  <label htmlFor="breachProcedures" className="text-sm font-medium leading-relaxed">
                    I understand data breach procedures and will immediately report any suspected breaches to the PartnerConnector security team.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="bestPractices" 
                    checked={moduleStates['gdpr-compliance']?.acknowledgments?.bestPractices || false}
                    onCheckedChange={(checked) => handleGDPRAcknowledgment('bestPractices', !!checked)}
                    data-testid="checkbox-best-practices"
                  />
                  <label htmlFor="bestPractices" className="text-sm font-medium leading-relaxed">
                    I will follow all data security best practices including using secure systems, strong passwords, and protecting confidential information.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="penalties" 
                    checked={moduleStates['gdpr-compliance']?.acknowledgments?.penalties || false}
                    onCheckedChange={(checked) => handleGDPRAcknowledgment('penalties', !!checked)}
                    data-testid="checkbox-penalties"
                  />
                  <label htmlFor="penalties" className="text-sm font-medium leading-relaxed">
                    I understand the serious penalties for GDPR non-compliance and acknowledge that violations may result in termination of my partnership agreement.
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Regular module content
    return (
      <ScrollArea className="h-96">
        <div className="prose prose-sm max-w-none p-4">
          {module.content?.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.substring(4)}</h3>;
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={index} className="font-semibold mb-2">{line.substring(2, line.length - 2)}</p>;
            }
            if (line.startsWith('- ')) {
              return <li key={index} className="ml-4">{line.substring(2)}</li>;
            }
            if (line.trim() === '') {
              return <br key={index} />;
            }
            return <p key={index} className="mb-2">{line}</p>;
          })}
        </div>
      </ScrollArea>
    );
  };

  if (selectedModule) {
    const module = trainingModules.find(m => m.id === selectedModule);
    if (!module) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedModule(null)}
            data-testid="button-back-to-modules"
          >
            ← Back to Modules
          </Button>
          {module.isRequired && (
            <Badge className="bg-red-600">Required</Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              {getTypeIcon(module.type)}
              <div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{module.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {module.duration}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    {module.points} points
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">{module.description}</p>
            
            {renderModuleContent(module)}

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Progress value={module.progress} className="flex-1 mr-4" />
              <Button 
                onClick={() => handleCompleteModule(module.id)}
                disabled={module.completed}
                data-testid={`button-complete-${module.id}`}
              >
                {module.completed ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Complete Module
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProgress.completedModules}</div>
              <div className="text-sm text-gray-600">Completed Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProgress.currentLevel}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userProgress.pointsToNext}</div>
              <div className="text-sm text-gray-600">Points to {userProgress.nextLevel}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingModules.map((module) => (
          <Card 
            key={module.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              module.locked ? 'opacity-60' : ''
            } ${module.isRequired ? 'border-red-200 bg-red-50' : ''}`}
            onClick={() => handleModuleClick(module)}
            data-testid={`card-module-${module.id}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(module.type)}
                  <div>
                    <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{module.difficulty}</Badge>
                      {module.isRequired && <Badge className="bg-red-600">Required</Badge>}
                    </div>
                  </div>
                </div>
                {module.locked ? (
                  <LockIcon className="w-5 h-5 text-gray-400" />
                ) : module.completed ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                ) : (
                  <PlayCircleIcon className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {module.description}
              </p>
              
              <div className="space-y-3">
                <Progress value={module.progress} />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {module.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4" />
                      {module.points} pts
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {module.progress}% complete
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}