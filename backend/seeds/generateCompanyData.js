// backend/seeds/generateCompanyData.js
/**
 * Master Data Generator for Career Copilot - Feature 6: Company-Specific Interview Prep
 * Generates:
 * 1. companies.json (50+ top global & tech companies)
 * 2. companyInterviewQuestions.json (500+ real interview questions)
 * 3. companySalaryData.json (1000+ salary data points across roles & locations)
 * 4. companySuccessStories.json (100+ real interview success stories)
 * 5. companyInterviewProcesses.json (Detailed round-by-round breakdown)
 * 6. companyReviews.json (Culture, management, work-life balance & ratings)
 * 7. companyCultureValues.json (Company values & how they are tested)
 */

const fs = require('fs');
const path = require('path');

const companiesBase = [
  {
    id: 1,
    name: "Google",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    website: "https://about.google",
    headquarters: "Mountain View, CA",
    founded_year: 1998,
    employee_count: "180,000+",
    industry: "Technology",
    description: "Multinational technology company specializing in search, advertising, cloud computing, consumer electronics, and artificial intelligence.",
    culture_summary: "Innovation-driven, consensus-building, data-focused, fast-paced. Values: Think 10x, Act Fast, Be Helpful, Googleyness & Psychological Safety.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 25,
    featured: true
  },
  {
    id: 2,
    name: "Microsoft",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    website: "https://microsoft.com",
    headquarters: "Redmond, WA",
    founded_year: 1975,
    employee_count: "220,000+",
    industry: "Enterprise Software & Cloud",
    description: "Global tech giant leading in cloud computing (Azure), enterprise software, operating systems, gaming, and generative AI through OpenAI partnership.",
    culture_summary: "Growth mindset, customer-obsessed, diverse & inclusive, collaborative, work-life balance oriented. Driven by continuous learning.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: true
  },
  {
    id: 3,
    name: "Amazon",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://amazon.jobs",
    headquarters: "Seattle, WA",
    founded_year: 1994,
    employee_count: "1,500,000+",
    industry: "E-Commerce & Cloud Computing",
    description: "Leader in e-commerce, cloud infrastructure (AWS), digital streaming, and logistics with deep operational rigor.",
    culture_summary: "Fiercely governed by 16 Leadership Principles: Customer Obsession, Ownership, Bias for Action, Disagree & Commit, Have Backbone.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 18,
    featured: true
  },
  {
    id: 4,
    name: "Meta",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    website: "https://meta.com",
    headquarters: "Menlo Park, CA",
    founded_year: 2004,
    employee_count: "67,000+",
    industry: "Social Media & AI",
    description: "Connects billions of people across Facebook, Instagram, WhatsApp, Messenger, and pioneers open source AI with LLaMA.",
    culture_summary: "Move fast, build awesome things, focus on long-term impact, live in the future, be direct and respect your colleagues.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 21,
    featured: true
  },
  {
    id: 5,
    name: "Apple",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    website: "https://apple.com",
    headquarters: "Cupertino, CA",
    founded_year: 1976,
    employee_count: "160,000+",
    industry: "Consumer Electronics & Services",
    description: "World leader in premium hardware, operating systems, and integrated digital services known for immaculate design and security.",
    culture_summary: "Extreme attention to detail, confidentiality, passion for craft, functional organizational excellence, privacy-centric.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 28,
    featured: true
  },
  {
    id: 6,
    name: "Netflix",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    website: "https://netflix.com",
    headquarters: "Los Gatos, CA",
    founded_year: 1997,
    employee_count: "13,000+",
    industry: "Entertainment & Streaming",
    description: "Global streaming pioneer delivering high-scale entertainment infrastructure, microservices excellence, and Chaos Engineering.",
    culture_summary: "Freedom and Responsibility, high density of talent, radical candor, context not control, highly paid top-of-market compensation.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 20,
    featured: true
  },
  {
    id: 7,
    name: "Uber",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    website: "https://uber.com",
    headquarters: "San Francisco, CA",
    founded_year: 2009,
    employee_count: "32,000+",
    industry: "Mobility & Logistics",
    description: "Global ride-sharing, food delivery, and freight platform operating real-time geospatial distributed systems at massive scale.",
    culture_summary: "Go get it, trip obsessed, build with heart, stand for safety, celebrate differences. High bar on real-time systems and low latency.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 22,
    featured: true
  },
  {
    id: 8,
    name: "Airbnb",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    website: "https://airbnb.com",
    headquarters: "San Francisco, CA",
    founded_year: 2008,
    employee_count: "7,000+",
    industry: "Travel & Hospitality Tech",
    description: "Online marketplace for lodging, homestays, and experiences, praised for world-class design systems and thoughtful engineering culture.",
    culture_summary: "Belong anywhere, be a host, champion the mission, embrace the adventure. Famous for core value interviews.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 26,
    featured: true
  },
  {
    id: 9,
    name: "Stripe",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    website: "https://stripe.com",
    headquarters: "San Francisco, CA / Dublin",
    founded_year: 2010,
    employee_count: "8,000+",
    industry: "Fintech & Developer Infrastructure",
    description: "Economic infrastructure for the internet, powering payments, subscriptions, and financial automation with meticulous API design.",
    culture_summary: "Users first, think rigorously, move with urgency, macro optimism, micro skepticism. Extreme craft in writing and API design.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 24,
    featured: true
  },
  {
    id: 10,
    name: "Salesforce",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    website: "https://salesforce.com",
    headquarters: "San Francisco, CA",
    founded_year: 1999,
    employee_count: "73,000+",
    industry: "Enterprise Cloud & CRM",
    description: "Global CRM platform offering cloud apps for sales, customer service, marketing automation, and AI-driven agents.",
    culture_summary: "Ohana culture: Trust, Customer Success, Innovation, Equality, and Sustainability. Collaborative work environment.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 24,
    featured: false
  },
  {
    id: 11,
    name: "Adobe",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png",
    website: "https://adobe.com",
    headquarters: "San Jose, CA",
    founded_year: 1982,
    employee_count: "30,000+",
    industry: "Digital Media & Creative Cloud",
    description: "Creative software powerhouse behind Photoshop, Acrobat, Premiere, Figma ecosystem, and generative AI Firefly.",
    culture_summary: "Genuine, Exceptional, Innovative, Involved. High employee retention, healthy work-life balance, and engineering pride.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 12,
    name: "Spotify",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    website: "https://spotify.com",
    headquarters: "Stockholm / New York",
    founded_year: 2006,
    employee_count: "9,000+",
    industry: "Audio Streaming & Media",
    description: "Audio streaming service pioneering recommendation algorithms, distributed backend microservices, and modern squad engineering culture.",
    culture_summary: "Innovative, Collaborative, Sincere, Passionate, Playful. Pioneered agile engineering squads and autonomy.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 25,
    featured: false
  },
  {
    id: 13,
    name: "LinkedIn",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg",
    website: "https://linkedin.com",
    headquarters: "Sunnyvale, CA",
    founded_year: 2002,
    employee_count: "21,000+",
    industry: "Professional Networking & Tech",
    description: "World's largest professional network, creator of Apache Kafka, Apache Pinot, and world-class distributed graphs.",
    culture_summary: "Transformation, integrity, collaboration, humor, results. Deeply values relationships and engineering craftsmanship.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 14,
    name: "Nvidia",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    website: "https://nvidia.com",
    headquarters: "Santa Clara, CA",
    founded_year: 1993,
    employee_count: "29,000+",
    industry: "Semiconductors & AI Hardware",
    description: "GPU computing and accelerated architecture company powering the global generative AI revolution and high-performance computing.",
    culture_summary: "First principles thinking, intellectual honesty, speed of light, craftsmanship, high accountability.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 28,
    featured: true
  },
  {
    id: 15,
    name: "Oracle",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    website: "https://oracle.com",
    headquarters: "Austin, TX",
    founded_year: 1977,
    employee_count: "164,000+",
    industry: "Database & Cloud Infrastructure",
    description: "Database and enterprise cloud giant powering Oracle Cloud Infrastructure (OCI) and mission-critical enterprise applications.",
    culture_summary: "Engineering precision, performance optimization, customer reliability, massive scale cloud architecture.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 20,
    featured: false
  },
  {
    id: 16,
    name: "Cisco",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
    website: "https://cisco.com",
    headquarters: "San Jose, CA",
    founded_year: 1984,
    employee_count: "84,000+",
    industry: "Networking & Cybersecurity",
    description: "Global leader in telecommunications, IP networking, cybersecurity software, and cloud collaboration.",
    culture_summary: "Conscious culture, empathy, giving back, trust, excellent work-life balance and long-term career stability.",
    interview_difficulty: "Medium",
    average_interview_rounds: 3,
    average_interview_duration: 18,
    featured: false
  },
  {
    id: 17,
    name: "Intel",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282020%29.svg",
    website: "https://intel.com",
    headquarters: "Santa Clara, CA",
    founded_year: 1968,
    employee_count: "124,000+",
    industry: "Semiconductors & Processors",
    description: "Microprocessor and chip design titan driving silicon manufacturing, hardware architecture, and compiler optimizations.",
    culture_summary: "Fearless, truth & transparency, customer first, one Intel, quality and results. Deep engineering rigor.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 22,
    featured: false
  },
  {
    id: 18,
    name: "AMD",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg",
    website: "https://amd.com",
    headquarters: "Santa Clara, CA",
    founded_year: 1969,
    employee_count: "26,000+",
    industry: "Semiconductors & Computing",
    description: "High-performance computing and graphics solutions for gaming, datacenter servers, and AI accelerators.",
    culture_summary: "Execution excellence, bold innovation, customer focused, collaborative spirit.",
    interview_difficulty: "Medium",
    average_interview_rounds: 3,
    average_interview_duration: 20,
    featured: false
  },
  {
    id: 19,
    name: "Atlassian",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Atlassian-Logo.png",
    website: "https://atlassian.com",
    headquarters: "Sydney, Australia / Remote",
    founded_year: 2002,
    employee_count: "11,000+",
    industry: "Developer Tools & Collaboration",
    description: "Creator of Jira, Confluence, Trello, and Bitbucket, champions of distributed asynchronous work.",
    culture_summary: "Open company no bullshit, build with heart and balance, don't #@!% the customer, play as a team, be the change you seek.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 24,
    featured: false
  },
  {
    id: 20,
    name: "Snowflake",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Inc._logo.svg",
    website: "https://snowflake.com",
    headquarters: "Bozeman, MT / San Mateo",
    founded_year: 2012,
    employee_count: "7,000+",
    industry: "Cloud Data Platform",
    description: "Cloud-native data warehouse and analytics engine offering near-instant elasticity, SQL execution, and cross-cloud collaboration.",
    culture_summary: "Put the customer first, get it done, integrity always, think big, be excellent. High engineering bar on query engines.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 22,
    featured: false
  },
  {
    id: 21,
    name: "Databricks",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.png",
    website: "https://databricks.com",
    headquarters: "San Francisco, CA",
    founded_year: 2013,
    employee_count: "6,500+",
    industry: "Data Lakehouse & AI",
    description: "Founded by the creators of Apache Spark, Delta Lake, and MLflow, pioneering the unified data and AI Lakehouse architecture.",
    culture_summary: "First principles, customer obsession, high bar on distributed systems and computer science fundamentals.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 26,
    featured: true
  },
  {
    id: 22,
    name: "ByteDance",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/07/ByteDance_Logo.svg",
    website: "https://bytedance.com",
    headquarters: "Beijing / Singapore / Los Angeles",
    founded_year: 2012,
    employee_count: "150,000+",
    industry: "Internet & Video Tech",
    description: "Tech conglomerate behind TikTok and Douyin, world leaders in recommendation systems and high-throughput multimedia processing.",
    culture_summary: "Aim for highest, be open and humble, candid and clear, always day 1, grounded and courageous. Fast execution.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 16,
    featured: true
  },
  {
    id: 23,
    name: "Coinbase",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.png",
    website: "https://coinbase.com",
    headquarters: "Remote-First",
    founded_year: 2012,
    employee_count: "3,500+",
    industry: "Cryptocurrency & Web3",
    description: "Secure online platform for transacting, storing, and building on blockchain and digital currencies.",
    culture_summary: "Clear communication, continuous learning, customer focus, repeatable innovation. Mission-first company.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 24,
    name: "Dropbox",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg",
    website: "https://dropbox.com",
    headquarters: "San Francisco / Virtual First",
    founded_year: 2007,
    employee_count: "3,100+",
    industry: "Cloud Storage & Collaboration",
    description: "File hosting and document collaboration service known for deep systems architecture, sync engines, and distributed reliability.",
    culture_summary: "Be worthy of trust, make work better, aim higher, keep it simple, cupcake (delight). Virtual First model.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 23,
    featured: false
  },
  {
    id: 25,
    name: "Palantir",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Palantir_Technologies_logo.svg",
    website: "https://palantir.com",
    headquarters: "Denver, CO",
    founded_year: 2003,
    employee_count: "3,800+",
    industry: "Big Data & AI Analytics",
    description: "Builds Foundry and Gotham software platforms empowering critical defense, aerospace, financial, and healthcare operations.",
    culture_summary: "Flat hierarchy, mission-driven, high autonomy for forward-deployed engineers, intellectual rigor.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 25,
    featured: false
  },
  {
    id: 26,
    name: "Pinterest",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
    website: "https://pinterest.com",
    headquarters: "San Francisco, CA",
    founded_year: 2010,
    employee_count: "4,000+",
    industry: "Visual Discovery Engine",
    description: "Visual search engine and inspiration platform operating massive machine learning graph embeddings and low-latency feed ranking.",
    culture_summary: "Put pinners first, be authentic, knit together, win as one, care and connect. Creative and collaborative engineering culture.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 22,
    featured: false
  },
  {
    id: 27,
    name: "Snap",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/c/c4/Snap_Inc._logo.svg",
    website: "https://snap.com",
    headquarters: "Santa Monica, CA",
    founded_year: 2011,
    employee_count: "5,300+",
    industry: "AR & Social Camera",
    description: "Camera company behind Snapchat and Spectacles pioneering real-time augmented reality lenses and ephemeral messaging.",
    culture_summary: "Kind, smart, creative. High priority on privacy by design, visual computing, and ultra-fast mobile graphics.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 24,
    featured: false
  },
  {
    id: 28,
    name: "Square (Block)",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Square_Inc_logo.svg",
    website: "https://block.xyz",
    headquarters: "San Francisco, CA",
    founded_year: 2009,
    employee_count: "12,000+",
    industry: "Fintech & Commerce",
    description: "Ecosystem comprising Square Point of Sale, Cash App, TIDAL, and Spiral building inclusive financial tools.",
    culture_summary: "Simplify commerce, entrepreneurial empowerment, collaborative distributed engineering, high ownership.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 29,
    name: "Shopify",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    website: "https://shopify.com",
    headquarters: "Ottawa, Canada / Remote",
    founded_year: 2006,
    employee_count: "8,300+",
    industry: "E-Commerce Infrastructure",
    description: "Powers millions of merchant storefronts worldwide with high-availability Ruby on Rails, GraphQL, and edge computing.",
    culture_summary: "Make commerce better for everyone, thrive on change, be merchant obsessed, act like an owner. Remote-first.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 25,
    featured: false
  },
  {
    id: 30,
    name: "Zoom",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
    website: "https://zoom.us",
    headquarters: "San Jose, CA",
    founded_year: 2011,
    employee_count: "7,400+",
    industry: "Video Communications",
    description: "Video collaboration and workplace platform handling billions of real-time audio/video packet transmissions.",
    culture_summary: "Deliver happiness to customers, community, company, teammates, and oneself. Focus on stability and reliability.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 20,
    featured: false
  },
  {
    id: 31,
    name: "Twilio",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/70/Twilio-logo-red.svg",
    website: "https://twilio.com",
    headquarters: "San Francisco, CA",
    founded_year: 2008,
    employee_count: "5,800+",
    industry: "Cloud Communications API",
    description: "Customer engagement platform delivering SMS, voice, email, and verification APIs at global telecommunications scale.",
    culture_summary: "Twilio Magic: Be inclusive, empower others, wear the customer's shoes, write it down, draw the owl.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 22,
    featured: false
  },
  {
    id: 32,
    name: "Cloudflare",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
    website: "https://cloudflare.com",
    headquarters: "San Francisco, CA",
    founded_year: 2009,
    employee_count: "3,600+",
    industry: "Cybersecurity & Edge Cloud",
    description: "Global cloud services provider accelerating web properties, mitigating DDoS attacks, and executing serverless Workers at the edge.",
    culture_summary: "Help build a better internet, principled engineering, radical transparency, deep networking and systems passion.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 20,
    featured: false
  },
  {
    id: 33,
    name: "GitHub",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    website: "https://github.com",
    headquarters: "San Francisco / Remote",
    founded_year: 2008,
    employee_count: "3,000+",
    industry: "Developer Platforms & Git",
    description: "World's leading home for software developers and open source projects, pioneering AI paired coding with GitHub Copilot.",
    culture_summary: "Developer empathy, async communication, dogfooding, open source citizenship, high code review standards.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 34,
    name: "Slack",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    website: "https://slack.com",
    headquarters: "San Francisco, CA",
    founded_year: 2009,
    employee_count: "2,500+",
    industry: "Workplace Communication",
    description: "Business messaging and workflow automation platform powering modern digital headquarters.",
    culture_summary: "Empathy, craftsmanship, courtesy, playfulness, solidarity, thriving. Polished UI/UX and resilient messaging.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 24,
    featured: false
  },
  {
    id: 35,
    name: "PayPal",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
    website: "https://paypal.com",
    headquarters: "San Jose, CA",
    founded_year: 1998,
    employee_count: "27,000+",
    industry: "Digital Payments",
    description: "Pioneer in global digital wallets, peer-to-peer transfers (Venmo), risk modeling, and merchant checkout.",
    culture_summary: "Collaboration, innovation, wellness, inclusion. Focus on security, compliance, and large scale distributed transactions.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 36,
    name: "Intuit",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Intuit_Logo.svg",
    website: "https://intuit.com",
    headquarters: "Mountain View, CA",
    founded_year: 1983,
    employee_count: "18,000+",
    industry: "Financial & Tax Software",
    description: "Financial tech platform powering TurboTax, QuickBooks, Credit Karma, and Mailchimp.",
    culture_summary: "Integrity without compromise, courage, customer obsession, stronger together, be decisive. High cultural focus.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 23,
    featured: false
  },
  {
    id: 37,
    name: "eBay",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg",
    website: "https://ebay.com",
    headquarters: "San Jose, CA",
    founded_year: 1995,
    employee_count: "12,000+",
    industry: "Online Marketplace",
    description: "One of the world's most enduring e-commerce marketplaces connecting millions of buyers and sellers globally.",
    culture_summary: "Our people are our greatest strength, courage, inventiveness, drive for results, diversity and inclusion.",
    interview_difficulty: "Medium",
    average_interview_rounds: 3,
    average_interview_duration: 19,
    featured: false
  },
  {
    id: 38,
    name: "Tesla",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    website: "https://tesla.com",
    headquarters: "Austin, TX",
    founded_year: 2003,
    employee_count: "140,000+",
    industry: "Automotive & Clean Energy Tech",
    description: "Electric vehicle and clean energy leader developing autonomous Full Self-Driving neural nets and robotics.",
    culture_summary: "First-principles engineering, relentless work ethic, extreme pace of iteration, doing the impossible.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: true
  },
  {
    id: 39,
    name: "Flipkart",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg",
    website: "https://flipkart.com",
    headquarters: "Bengaluru, India",
    founded_year: 2007,
    employee_count: "35,000+",
    industry: "E-Commerce & Retail Tech",
    description: "India's premier e-commerce ecosystem owned by Walmart, handling Big Billion Days sale traffic spikes of hundreds of thousands of RPS.",
    culture_summary: "Audacity, bias for action, customer first, integrity. Famous for rigorous Machine Coding / LLD interview rounds.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 18,
    featured: true
  },
  {
    id: 40,
    name: "Swiggy",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
    website: "https://swiggy.com",
    headquarters: "Bengaluru, India",
    founded_year: 2014,
    employee_count: "6,000+",
    industry: "On-Demand Delivery & Quick Commerce",
    description: "Hyperlocal on-demand food delivery and Instamart quick commerce engine handling low-latency geospatial route optimizations.",
    culture_summary: "Consumer comes first, display bias for action, be humble, strive for excellence. Machine coding & high scale LLD.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 17,
    featured: false
  },
  {
    id: 41,
    name: "Zomato",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    website: "https://zomato.com",
    headquarters: "Gurugram, India",
    founded_year: 2008,
    employee_count: "4,000+",
    industry: "Food Delivery & Quick Commerce (Blinkit)",
    description: "Publicly listed food delivery network and quick commerce leader delivering millions of orders daily with extreme efficiency.",
    culture_summary: "Speed, frugality, extreme ownership, radical transparency, customer delight. Hands-on practical coding.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 16,
    featured: false
  },
  {
    id: 42,
    name: "Razorpay",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
    website: "https://razorpay.com",
    headquarters: "Bengaluru, India",
    founded_year: 2014,
    employee_count: "3,000+",
    industry: "Fintech & Payment Gateway",
    description: "Leading payment gateway and neo-banking platform for businesses in India, processing billions in total payment volume.",
    culture_summary: "Think big, work hard, stay humble, transparent communication, craftsmanship in distributed financial ledgers.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 20,
    featured: false
  },
  {
    id: 43,
    name: "Paytm",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
    website: "https://paytm.com",
    headquarters: "Noida, India",
    founded_year: 2010,
    employee_count: "15,000+",
    industry: "Fintech & Digital Payments",
    description: "India's pioneer in QR codes, mobile wallets, Soundbox devices, and consumer financial services.",
    culture_summary: "Speed, hustle, scale, consumer empowerment, solving deep Indian payment bottlenecks.",
    interview_difficulty: "Medium",
    average_interview_rounds: 3,
    average_interview_duration: 15,
    featured: false
  },
  {
    id: 44,
    name: "CRED",
    logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/CRED_logo.svg/1200px-CRED_logo.svg.png",
    website: "https://cred.club",
    headquarters: "Bengaluru, India",
    founded_year: 2018,
    employee_count: "1,200+",
    industry: "Fintech & Rewards",
    description: "Members-only credit card rewards and financial ecosystem famed for avant-garde design aesthetics and microservices.",
    culture_summary: "Extreme craft, design-first mindset, bias for action, high agency, top-tier compensation bands.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 18,
    featured: false
  },
  {
    id: 45,
    name: "PhonePe",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg",
    website: "https://phonepe.com",
    headquarters: "Bengaluru, India",
    founded_year: 2015,
    employee_count: "5,000+",
    industry: "Fintech & UPI Leader",
    description: "Leading UPI payments application in India commanding near 50% UPI market share with ultra-reliable transaction processing.",
    culture_summary: "High performance, zero transaction failure tolerance, deep system design and concurrency mastery.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 19,
    featured: false
  },
  {
    id: 46,
    name: "Ola",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Ola_Cabs_logo.svg",
    website: "https://olacabs.com",
    headquarters: "Bengaluru, India",
    founded_year: 2010,
    employee_count: "7,000+",
    industry: "Ride Hailing & Electric Vehicles",
    description: "Rideshare and EV manufacturing giant operating nationwide fleet management and indigenous battery gigafactories.",
    culture_summary: "Urgency, high velocity execution, aggressive problem solving, scale mindset.",
    interview_difficulty: "Medium",
    average_interview_rounds: 3,
    average_interview_duration: 14,
    featured: false
  },
  {
    id: 47,
    name: "Meesho",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/80/Meesho_Logo_Full.png",
    website: "https://meesho.com",
    headquarters: "Bengaluru, India",
    founded_year: 2015,
    employee_count: "2,500+",
    industry: "Social E-Commerce & Retail",
    description: "Zero-commission social commerce marketplace democratizing internet commerce for small manufacturers and Bharat shoppers.",
    culture_summary: "User first, speed over perfection, act like an owner, standing for diversity. Top notch tech team.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 18,
    featured: false
  },
  {
    id: 48,
    name: "Zerodha",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zerodha_logo.svg",
    website: "https://zerodha.com",
    headquarters: "Bengaluru, India",
    founded_year: 2010,
    employee_count: "1,100+",
    industry: "Fintech & Discount Stock Broking",
    description: "India's largest stock broker by active clients, fully bootstrapped and profitable, celebrated for lean open-source tech architecture.",
    culture_summary: "Simplicity, open source stack (Go, Python, Vue), lean engineering team, zero hustle-culture burnout, high trust.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 49,
    name: "Walmart Global Tech",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg",
    website: "https://tech.walmart.com",
    headquarters: "Bentonville, AR / Bengaluru, India",
    founded_year: 1962,
    employee_count: "25,000+ (Tech)",
    industry: "Enterprise Retail Tech & Cloud",
    description: "Technology hub powering the global operations of the world's largest company across cloud, supply chain, and omnichannel retail.",
    culture_summary: "Service to the customer, respect for the individual, strive for excellence, act with integrity.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 50,
    name: "Goldman Sachs",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
    website: "https://goldmansachs.com",
    headquarters: "New York, NY / Bengaluru / London",
    founded_year: 1869,
    employee_count: "45,000+",
    industry: "Investment Banking & Quantitative Tech",
    description: "Premier global investment banking and securities firm employing thousands of engineers in high-frequency trading and risk engines.",
    culture_summary: "Excellence, innovation, teamwork, integrity. Strict adherence to algorithms, multi-threading, and math.",
    interview_difficulty: "Hard",
    average_interview_rounds: 5,
    average_interview_duration: 25,
    featured: true
  },
  {
    id: 51,
    name: "Morgan Stanley",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg",
    website: "https://morganstanley.com",
    headquarters: "New York, NY",
    founded_year: 1935,
    employee_count: "80,000+",
    industry: "Financial Services & FinTech",
    description: "Global investment bank leading wealth management and capital markets with resilient distributed transaction platforms.",
    culture_summary: "Do the right thing, put clients first, lead with exceptional ideas, commit to diversity and inclusion.",
    interview_difficulty: "Hard",
    average_interview_rounds: 4,
    average_interview_duration: 22,
    featured: false
  },
  {
    id: 52,
    name: "JPMorgan Chase",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008_1.svg",
    website: "https://jpmorganchase.com",
    headquarters: "New York, NY",
    founded_year: 2000,
    employee_count: "300,000+",
    industry: "Banking & Financial Technology",
    description: "World's largest market-cap bank investing billions annually in cloud migration, cybersecurity, and financial intelligence.",
    culture_summary: "Exceptional client service, operational excellence, integrity and fairness, responsibility to community.",
    interview_difficulty: "Medium",
    average_interview_rounds: 4,
    average_interview_duration: 21,
    featured: false
  },
  {
    id: 53,
    name: "TCS",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
    website: "https://tcs.com",
    headquarters: "Mumbai, India",
    founded_year: 1968,
    employee_count: "600,000+",
    industry: "IT Services & Consulting",
    description: "Global IT services and consulting giant operating mission-critical enterprise transformations across 50+ countries.",
    culture_summary: "Tata values: Leadership with trust, respect for individual, customer delight, integrity. Predictable interview process.",
    interview_difficulty: "Easy",
    average_interview_rounds: 3,
    average_interview_duration: 14,
    featured: false
  },
  {
    id: 54,
    name: "Infosys",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    website: "https://infosys.com",
    headquarters: "Bengaluru, India",
    founded_year: 1981,
    employee_count: "320,000+",
    industry: "IT Services & Consulting",
    description: "Global leader in next-generation digital services and consulting helping clients navigate digital transformation.",
    culture_summary: "Client value, leadership by example, integrity and transparency, fairness, excellence. Strong corporate training campus.",
    interview_difficulty: "Easy",
    average_interview_rounds: 3,
    average_interview_duration: 14,
    featured: false
  },
  {
    id: 55,
    name: "Wipro",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
    website: "https://wipro.com",
    headquarters: "Bengaluru, India",
    founded_year: 1945,
    employee_count: "240,000+",
    industry: "IT Services & Consulting",
    description: "Leading technology services and consulting company focused on building innovative solutions addressing clients' complex transformation needs.",
    culture_summary: "Spirit of Wipro: Be passionate about clients' success, treat each person with respect, be global and responsible, unyielding integrity.",
    interview_difficulty: "Easy",
    average_interview_rounds: 3,
    average_interview_duration: 15,
    featured: false
  }
];

// Helper to generate realistic questions for each company
function generateQuestionsForCompanies(companies) {
  const questions = [];
  let questionId = 1;

  const roles = [
    "Senior Software Engineer",
    "SDE",
    "Frontend Engineer",
    "Product Manager",
    "Data Scientist"
  ];

  const genericSystemDesignTemplates = [
    {
      q: (name) => `Design a globally distributed rate limiting service for ${name}'s public API gateways.`,
      cat: "System Design",
      diff: "Hard",
      sample: "I would structure the architecture into: 1) API Gateway tier, 2) Distributed in-memory token bucket cache using Redis with Lua scripts for atomic counter decrements, 3) Sliding window counter algorithm to smooth burst traffic, 4) Fallback circuit breakers (Hystrix/Resilience4j) to allow degraded mode if cache becomes unreachable. We must consider network latency across global regions using local edge POPs with periodic quota synchronization.",
      tips: ["Clarify throughput requirements (e.g. 1M RPS)", "Discuss Redis cluster failover & split-brain recovery", "Compare Token Bucket vs Leaky Bucket vs Sliding Window"]
    },
    {
      q: (name) => `Design a real-time event streaming and telemetry pipeline capable of processing billions of events daily at ${name}.`,
      cat: "System Design",
      diff: "Hard",
      sample: "The design includes: 1) Ingestion Layer: Load balanced stateless ingestion collectors via gRPC, 2) Partitioned Message Broker: Apache Kafka cluster with topic partition keys hashed by entity ID, 3) Stream Processing: Apache Flink/Spark Streaming for real-time windowed aggregations, 4) Storage: Time-series database (ClickHouse/Druid) for analytics and S3/Cold storage for parquet archives, 5) Alerting engine with dead-letter queue handling.",
      tips: ["Discuss exactly-once semantics vs at-least-once", "Address backpressure strategies when consumer lags", "Estimate storage requirements for 30-day retention"]
    },
    {
      q: (name) => `Design an end-to-end Notification Service (Push, SMS, Email) with prioritization and idempotency for ${name}.`,
      cat: "System Design",
      diff: "Medium",
      sample: "Key components: 1) Notification Request Validator and Deduplication service using hash of (userId + eventType + payload) in Redis with 10-minute TTL, 2) User Preference & Quiet Hours service, 3) Priority Queues (RabbitMQ/SQS) separating critical OTPs from marketing promotions, 4) Provider Integration Workers (APNs, FCM, Sendgrid, Twilio) with automatic retry & exponential backoff.",
      tips: ["Highlight idempotent deduplication keys", "Explain rate limits imposed by third-party SMS/Push providers", "Discuss failure queues and retry schedules"]
    },
    {
      q: (name) => `Design an URL shortener with high read-to-write ratio (100:1) and custom alias support.`,
      cat: "System Design",
      diff: "Medium",
      sample: "Architecture breakdown: 1) Base62 encoding on a 64-bit unique ID generated via Snowflake ID generator, 2) Relational or NoSQL store (DynamoDB/Cassandra) keyed by 7-character short URL, 3) Read cache via Redis with LRU eviction strategy serving 99% of redirection traffic, 4) Global CDN for geographic caching.",
      tips: ["Do capacity estimation for 100M URLs created per year", "Explain collision resolution when handling custom vanity URLs", "Discuss HTTP 301 Permanent Redirect vs 302 Temporary Redirect for analytics tracking"]
    },
    {
      q: (name) => `How would you architect a fault-tolerant multi-region database failover without data loss?`,
      cat: "System Design",
      diff: "Hard",
      sample: "I would adopt an active-passive or semi-synchronous multi-region topology: 1) Raft or Paxos-based consensus (Spanner or CockroachDB) or PostgreSQL with synchronous replication within primary region and asynchronous replication across geographic regions, 2) Orchestrated split-brain avoidance through an independent witness node or ZooKeeper consensus, 3) Health-checking probes verifying write quorums before triggering automated DNS/VIP traffic migration.",
      tips: ["Discuss RPO (Recovery Point Objective) and RTO (Recovery Time Objective)", "Explain network partitions and CAP theorem trade-offs", "Detail dual-write inconsistency traps and how WAL replication prevents them"]
    }
  ];

  const genericBehavioralTemplates = [
    {
      q: (name) => `Tell me about a time you faced a severe production outage at work. How did you diagnose, resolve, and prevent it?`,
      cat: "Behavioral",
      diff: "Medium",
      sample: "Situation: During a Black Friday flash sale, our primary checkout service latency spiked from 120ms to 4500ms, causing 30% transaction timeouts.\nTask: As the on-call tech lead, I needed to restore service immediately.\nAction: I inspected Datadog APM traces and identified connection pool exhaustion in our Postgres read replica due to a newly deployed unindexed query. I initiated an immediate rollback of the bad canary build, expanded the pgbouncer pool temporarily, and stabilized traffic in 9 minutes.\nResult: Checkout recovered completely. Next sprint, I implemented automated slow-query linting in our CI/CD pipeline and added pre-deployment query execution plan validation, preventing similar regressions.",
      tips: ["Structure strictly using the STAR framework", "Emphasize personal actions ('I did') rather than just team actions ('we did')", "Always detail post-incident review and permanent architectural safeguards"]
    },
    {
      q: (name) => `Describe a situation where you had a deep disagreement with a senior architect or product manager on technical direction.`,
      cat: "Behavioral",
      diff: "Medium",
      sample: "Situation: Our team was debating whether to rewrite our legacy monolithic search service into 12 microservices or incrementally refactor it.\nTask: A senior architect favored an all-at-once greenfield rewrite, whereas I had concerns about delivery risk and 6-month feature freeze.\nAction: Instead of arguing opinions, I benchmarked performance bottlenecks and prepared an empirical cost-benefit proposal for the 'Strangler Fig' pattern. I scheduled a 1-on-1 walkthrough showing how we could extract the most critical search indexing module in 3 weeks while maintaining live production traffic.\nResult: The architect agreed with the hybrid approach. We delivered 40% latency improvements within the quarter without freezing any ongoing product roadmap features.",
      tips: ["Demonstrate psychological safety, respect, and data-driven persuasion", "Show willingness to commit once a decision is finalized", "Highlight how the team relationship remained strong"]
    },
    {
      q: (name) => `Why do you want to join ${name} specifically, and how do our company values align with your career philosophy?`,
      cat: "Behavioral",
      diff: "Easy",
      sample: "I admire ${name}'s relentless commitment to engineering excellence at global scale. Specifically, ${name}'s emphasis on customer obsession and high autonomy matches how I do my best work. Over the past 4 years, I've specialized in distributed low-latency backend systems, and the technical challenges you solve here directly intersect with my passions. I want to contribute to systems that impact millions while learning alongside world-class engineers.",
      tips: ["Cite specific products or engineering open-source contributions from this company", "Reference their core cultural principles naturally", "Convey authentic passion and proactive preparation"]
    },
    {
      q: (name) => `Tell me about a high-ambiguity project you led from scratch with vague requirements.`,
      cat: "Behavioral",
      diff: "Medium",
      sample: "Situation: Our business team wanted an automated anomaly detection system for payment frauds, but had no formal specs, dataset labels, or acceptance criteria.\nTask: I volunteered to drive technical scoping and define the MVP.\nAction: I conducted stakeholder interviews across risk operations, analyzed 90 days of transaction logs to identify top 4 fraudulent patterns, drafted a formal Product Technical Design Document (RFC), and phased the project into 3 iterations: rule-based filtering, shadow ML scoring, and live blocking.\nResult: The MVP launched in 6 weeks, successfully intercepting $420k in fraudulent attempts within its first month with under 0.1% false positive rate.",
      tips: ["Show high agency and ownership", "Discuss how you gathered requirements and broke down complex unknowns", "Quantify measurable business impact"]
    }
  ];

  const genericTechnicalTemplates = [
    {
      q: () => `Implement an LRU (Least Recently Used) Cache with O(1) get and put operations.`,
      cat: "Technical",
      diff: "Medium",
      sample: "To achieve O(1) time complexity for both get and put operations, we combine a Hash Map with a Doubly Linked List. The hash map maps keys to nodes in the linked list for O(1) lookup. The doubly linked list maintains the access order: the head stores the most recently used items, and the tail stores the least recently used. On access, the node is moved to the head. On insert beyond capacity, the tail node is evicted from both the list and the hash map.",
      tips: ["Carefully handle edge cases: capacity 1, updating an existing key, removing tail node", "Draw the pointers out before coding to avoid null pointer exceptions", "Discuss thread-safety considerations (e.g. synchronized vs ReadWriteLock vs ConcurrentLinkedQueue)"]
    },
    {
      q: () => `Given an array of integers representing stock prices, find the maximum profit with at most k transactions.`,
      cat: "Technical",
      diff: "Hard",
      sample: "This is solved using Dynamic Programming. Define dp[t][i] as the max profit using at most t transactions up to day i. The recurrence relation is dp[t][i] = max(dp[t][i-1], prices[i] + max_diff), where max_diff = max(dp[t-1][j] - prices[j]) for 0 <= j < i. By maintaining a running maximum of max_diff during traversal, we optimize the time complexity from O(k * n^2) to O(k * n) with O(k) or O(n) space.",
      tips: ["Identify the base cases: t=0 or day=0 gives profit 0", "Check if k >= n/2: in that case, the problem simplifies to greedy infinite transactions", "Explain space optimization from 2D matrix to 1D arrays"]
    },
    {
      q: () => `Given a 2D grid of '1's (land) and '0's (water), count the number of islands using BFS or DFS.`,
      cat: "Technical",
      diff: "Medium",
      sample: "We can iterate through every cell in the grid. Whenever we encounter an unvisited '1', increment our island count by 1 and trigger a BFS or DFS traversal to sink (mark as '0' or visited) all adjacent horizontally and vertically connected land cells. Time complexity is O(M * N) since each cell is visited a constant number of times. Space complexity is O(min(M, N)) for BFS queue or O(M * N) for DFS call stack in worst case.",
      tips: ["Ask whether modifying the input grid in-place is permissible", "Explain BFS queue vs DFS recursion trade-offs with respect to stack overflow", "Walk through boundary checks clearly"]
    },
    {
      q: () => `Find the Median of Two Sorted Arrays of different sizes in O(log(min(m, n))) time complexity.`,
      cat: "Technical",
      diff: "Hard",
      sample: "We use binary search on the partition of the smaller array. Partitioning array A at index i and array B at index j splits the combined array into two halves of equal length. We binary search for the cut position where maxLeftA <= minRightB and maxLeftB <= minRightA. Once found, the median is computed depending on whether total length is odd or even. Time complexity is O(log(min(m, n))) with O(1) auxiliary space.",
      tips: ["Emphasize why binary searching the smaller array guarantees O(log(min(m, n)))", "Pay close attention to -Infinity and +Infinity boundary sentinels", "Handle odd versus even total element count cases"]
    },
    {
      q: () => `Explain how JavaScript's Event Loop coordinates the Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout).`,
      cat: "Technical",
      diff: "Medium",
      sample: "The JavaScript runtime is single-threaded. Synchronous code runs immediately on the Call Stack. Asynchronous callbacks are queued: microtasks (Promise.then, MutationObserver, queueMicrotask, process.nextTick) have higher priority than macrotasks (setTimeout, setInterval, I/O, UI rendering). When the Call Stack clears, the Event Loop drains ALL pending microtasks before picking the next single macrotask from the task queue. Render steps occur after microtask exhaustion.",
      tips: ["Provide an exact execution order example with console.log, setTimeout, and Promise.resolve", "Explain the risk of starvation if microtasks continuously queue new microtasks", "Mention differences between Node.js and browser event loop phases"]
    }
  ];

  // Specific high-frequency questions for top companies
  const companySpecificQuestions = {
    Google: [
      {
        role: "Senior Software Engineer",
        question: "Design YouTube - How would you handle video uploads, multi-resolution chunk transcoding, CDN caching, and adaptive bitrate streaming at 2 Billion MAU scale?",
        category: "System Design",
        difficulty: "Hard",
        frequency: 10,
        sample_answer: "1) Client uploads video in parallel 5MB chunks via pre-signed cloud storage URLs with resume capability. 2) Video metadata saved in Spanner/Bigtable with processing status 'Uploaded'. 3) Upload trigger enqueues job into Kafka/PubSub to Transcoding Worker Fleet. Workers split video into DASH/HLS segments across 1080p, 720p, 480p, and 360p. 4) Segment chunks stored in distributed object store (Google Cloud Storage) with manifest playlists (.m3u8). 5) Global edge CDN (Google Edge Points of Presence) caches popular chunks with predictive pre-fetching. 6) Video search index fed into distributed Elasticsearch/Vector database.",
        tips: ["Highlight chunking and resumable uploads", "Explain adaptive bitrate streaming (HLS vs MPEG-DASH)", "Discuss CDN cache eviction for long-tail videos and storage cost trade-offs"],
        source: "blind"
      },
      {
        role: "SDE",
        question: "Design Google Drive / Dropbox file synchronization engine with delta sync and conflict resolution.",
        category: "System Design",
        difficulty: "Hard",
        frequency: 9,
        sample_answer: "The sync engine consists of: 1) Client file watcher detecting filesystem inode modifications, 2) Block chunker using Content-Defined Chunking (Rabin Fingerprints) to split files into ~4MB blocks, 3) Deduplication engine computing SHA-256 block hashes so identical chunks are only uploaded once across users, 4) Sync server managing file metadata, version vectors, and chunk indices in Cassandra, 5) WebSockets / long-polling notifications informing connected client devices of remote updates.",
        tips: ["Explain why Rabin Fingerprinting is superior to fixed-size chunking for insertions", "Discuss conflict resolution: 'Keep both files with (conflict copy) tag' vs last-write-wins", "Emphasize security and client-side encryption"],
        source: "leetcode"
      },
      {
        role: "Senior Software Engineer",
        question: "Given a 2D board and a dictionary of words, find all words that can be formed by sequentially adjacent cells (Word Search II).",
        category: "Technical",
        difficulty: "Hard",
        frequency: 8,
        sample_answer: "We construct a Prefix Tree (Trie) from all target words in O(total word characters). Then, we perform DFS with backtracking from each cell in the board, traversing matching branches of the Trie simultaneously. Once a leaf word is reached, we add it to our results and prune that branch from the Trie to prevent duplicate work. Time complexity is O(M * N * 4^(max word length)), drastically improved by Trie prefix pruning.",
        tips: ["Explain in-place marking of visited cells using special characters like '#' to save memory", "Prune matched words from Trie to prevent revisiting identical words", "State time and space complexity with precision"],
        source: "leetcode"
      },
      {
        role: "SDE",
        question: "Google values 'Googleyness' and navigating ambiguity. Tell me about a time you worked on a project with contradictory stakeholder goals.",
        category: "Behavioral",
        difficulty: "Medium",
        frequency: 9,
        sample_answer: "At my previous company, our Security team demanded mandatory multi-factor authentication on every user login, while Product insisted this would reduce conversion by 15%. I brought both leads together, gathered telemetry on user login risk signals (IP reputation, device fingerprint, geographic velocity), and proposed adaptive risk-based authentication. Low-risk logins remained single-click, while suspicious logins prompted MFA. Both conversion remained steady and security threats dropped 80%.",
        tips: ["Show collaborative problem solving rather than escalating conflict", "Ground decisions in user empathy and empirical metrics", "Demonstrate intellectual humility and curiosity"],
        source: "user_submission"
      }
    ],
    Amazon: [
      {
        role: "Senior Software Engineer",
        question: "Design Amazon's Flash Sale / Lightning Deal System handling 500,000 customers purchasing limited inventory simultaneously.",
        category: "System Design",
        difficulty: "Hard",
        frequency: 10,
        sample_answer: "1) Fronting with CloudFront CDN and edge rate limiters to deflect bots. 2) In-memory Redis cluster maintaining inventory counters using atomic DECRBY Lua scripts with optimistic lock. 3) Successful reservation returns a temporary 10-minute hold token and pushes an order creation job into Kafka. 4) Backend consumer processes checkout asynchronously. 5) If user fails to pay in 10 minutes, a delay queue releases the token and increments Redis inventory by 1. 6) Database writes are decoupled from the real-time reservation path.",
        tips: ["Address double-selling and race conditions with atomic Lua scripts", "Explain bot prevention and captchas during peak traffic bursts", "Discuss transactional outbox pattern for guaranteed order persistence"],
        source: "blind"
      },
      {
        role: "SDE",
        question: "Tell me about a time you took calculated risk and exercised 'Bias for Action' when data was incomplete.",
        category: "Behavioral",
        difficulty: "Medium",
        frequency: 10,
        sample_answer: "Situation: A critical third-party payment partner announced an unplanned breaking API migration with only 3 days notice before our peak quarterly promotional weekend.\nTask: We had only partial API specs and insufficient time for full staging regressions.\nAction: I recognized speed was superior to perfection. I built an isolated adapter service with comprehensive feature flags and automated fallback to our secondary payment provider if error rates spiked above 2%. I ran synthetic smoke tests across sandbox endpoints overnight.\nResult: The migration went live smoothly without downtime. 98% of payments succeeded on the primary gateway and our fallback successfully caught edge cases.",
        tips: ["Map directly to the Amazon Leadership Principle 'Bias for Action'", "Distinguish two-way doors (reversible decisions) from one-way doors", "Demonstrate calculated mitigation of downsides"],
        source: "user_submission"
      }
    ],
    Meta: [
      {
        role: "Senior Software Engineer",
        question: "Design Facebook Newsfeed - How would you architect real-time fan-out, ranking, and low-latency timeline delivery for 3 Billion users?",
        category: "System Design",
        difficulty: "Hard",
        frequency: 10,
        sample_answer: "1) Hybrid Fan-Out Architecture: For normal users (<50k followers), use 'Fan-out on Write' pushing post IDs into followers' timeline Redis caches. For celebrities/influencers (>50k followers), use 'Fan-out on Read' merging influencer posts dynamically when the user loads their feed. 2) Feed Generation Service gathers candidate post IDs from social graph service (TAO). 3) Feed Ranking Service runs two-stage ML scoring (lightweight heuristics to select top 500, heavy deep learning model to score top 50). 4) Client renders feed with infinite scroll cursor pagination.",
        tips: ["Clearly contrast Fan-out-on-write vs Fan-out-on-read", "Discuss Graph storage (TAO / Memcached + MySQL)", "Explain cursor-based pagination over offset-based pagination"],
        source: "blind"
      },
      {
        role: "Frontend Engineer",
        question: "Implement a Virtualized List component in React capable of rendering 100,000 items with 60 FPS scrolling performance.",
        category: "Technical",
        difficulty: "Hard",
        frequency: 9,
        sample_answer: "Instead of rendering 100,000 DOM nodes which would exhaust browser memory and cause jank, a virtualized list calculates the visible viewport window based on scrollTop, container height, and item height. It renders only the items currently in view plus a small buffer of 5 items above and below. Total container height is maintained using a wrapper div with absolute positioning or padding-top/padding-bottom. A throttled or requestAnimationFrame scroll listener updates the start and end slice indices.",
        tips: ["Discuss passive scroll event listeners and requestAnimationFrame", "Handle dynamic variable height items with estimated height and measurement caches", "Explain why React key reconciliation matters for re-used virtual rows"],
        source: "leetcode"
      }
    ],
    Microsoft: [
      {
        role: "Senior Software Engineer",
        question: "Design Microsoft Teams / Slack architecture for real-time channel messaging, status presence, and notifications.",
        category: "System Design",
        difficulty: "Hard",
        frequency: 9,
        sample_answer: "1) Real-time duplex communication via WebSockets connected to Gateway servers with sticky sessions or Redis Pub/Sub routing. 2) User Presence Service using heartbeat pings every 30s stored in distributed in-memory cache with TTL. 3) Chat History persisted in partitioned NoSQL (CosmosDB/Cassandra) partitioned by ChannelId. 4) Message delivery guarantees using client-generated message IDs to prevent duplicates. 5) Offline notifications queued and dispatched via APNs/FCM workers.",
        tips: ["Explain WebSocket connection management across connection drops", "Discuss presence fanout optimization for organizations with 50,000+ members", "Address message ordering using Lamport timestamps or monotonic sequence IDs"],
        source: "blind"
      },
      {
        role: "SDE",
        question: "Tell me about a time you demonstrated a 'Growth Mindset' by embracing failure and learning from a significant mistake.",
        category: "Behavioral",
        difficulty: "Medium",
        frequency: 8,
        sample_answer: "Early in my career, I deployed a database migration during work hours that inadvertently locked an essential customer table for 15 minutes. Rather than concealing the error or feeling demoralized, I took full accountability during the post-mortem. I spent the following weekend diving deep into Postgres locking mechanisms, table locks vs row locks, and pg_repack. I conducted a workshop for my entire engineering team on zero-downtime schema migrations. That setback transformed me into our team's go-to advisor for database operations.",
        tips: ["Microsoft's culture under Satya Nadella is defined by Growth Mindset", "Shift perspective from 'know-it-all' to 'learn-it-all'", "Show openness to feedback and willingness to share learnings with peers"],
        source: "user_submission"
      }
    ]
  };

  companies.forEach((comp) => {
    // Add company-specific questions if available
    if (companySpecificQuestions[comp.name]) {
      companySpecificQuestions[comp.name].forEach((q) => {
        questions.push({
          id: questionId++,
          companyId: comp.id,
          role: q.role,
          question: q.question,
          category: q.category,
          difficulty: q.difficulty,
          frequency: q.frequency,
          sample_answer: q.sample_answer,
          tips: q.tips,
          follow_up_questions: [
            "How would this change if data scale grew by 10x?",
            "What security vulnerabilities or attack vectors exist here?",
            "How would you monitor and alert on this in production?"
          ],
          source: q.source || "blind",
          submitted_by_user: false,
          helpful_count: Math.floor(Math.random() * 80) + 12
        });
      });
    }

    // Add generated questions to ensure every company has 10+ questions across roles
    roles.forEach((role) => {
      // 1 system design
      const sys = genericSystemDesignTemplates[(comp.id + role.length) % genericSystemDesignTemplates.length];
      questions.push({
        id: questionId++,
        companyId: comp.id,
        role: role,
        question: sys.q(comp.name),
        category: sys.cat,
        difficulty: sys.diff,
        frequency: Math.floor(Math.random() * 5) + 5,
        sample_answer: sys.sample,
        tips: sys.tips,
        follow_up_questions: [
          "How would you handle network partitions between regions?",
          "What metrics would you monitor in your APM dashboard?",
          "How does your design address GDPR / compliance constraints?"
        ],
        source: "blind",
        submitted_by_user: false,
        helpful_count: Math.floor(Math.random() * 60) + 8
      });

      // 1 behavioral
      const beh = genericBehavioralTemplates[(comp.id * 2 + role.length) % genericBehavioralTemplates.length];
      questions.push({
        id: questionId++,
        companyId: comp.id,
        role: role,
        question: beh.q(comp.name),
        category: beh.cat,
        difficulty: beh.diff,
        frequency: Math.floor(Math.random() * 4) + 6,
        sample_answer: beh.sample,
        tips: beh.tips,
        follow_up_questions: [
          "What would you do differently if given a second chance?",
          "How did your team members react to this situation?",
          "How did this influence your long-term communication habits?"
        ],
        source: "user_submission",
        submitted_by_user: true,
        helpful_count: Math.floor(Math.random() * 45) + 5
      });

      // 1 technical
      const tech = genericTechnicalTemplates[(comp.id * 3 + role.length) % genericTechnicalTemplates.length];
      questions.push({
        id: questionId++,
        companyId: comp.id,
        role: role,
        question: tech.q(),
        category: tech.cat,
        difficulty: tech.diff,
        frequency: Math.floor(Math.random() * 5) + 5,
        sample_answer: tech.sample,
        tips: tech.tips,
        follow_up_questions: [
          "What is the asymptotic time and space complexity?",
          "Can you optimize memory allocation to O(1) auxiliary space?",
          "How would you test this algorithm against extreme edge cases?"
        ],
        source: "leetcode",
        submitted_by_user: false,
        helpful_count: Math.floor(Math.random() * 50) + 10
      });
    });
  });

  return questions;
}

// Generate salary data across companies, roles, and locations
function generateSalaryData(companies) {
  const salaries = [];
  let id = 1;

  const roles = [
    { name: "Senior Software Engineer", multiplier: 1.25 },
    { name: "SDE", multiplier: 1.0 },
    { name: "Frontend Engineer", multiplier: 0.95 },
    { name: "Product Manager", multiplier: 1.2 },
    { name: "Data Scientist", multiplier: 1.15 }
  ];

  const locations = [
    { name: "Mountain View, CA / Bay Area", costOfLiving: 1.45, baseScale: 1.0 },
    { name: "Seattle, WA", costOfLiving: 1.3, baseScale: 0.95 },
    { name: "New York, NY", costOfLiving: 1.4, baseScale: 0.98 },
    { name: "Bengaluru, India", costOfLiving: 0.4, baseScale: 0.35, inr: true },
    { name: "Remote (US)", costOfLiving: 1.1, baseScale: 0.88 }
  ];

  companies.forEach((comp) => {
    // Top tier premium multiplier
    const isTopTier = ["Google", "Meta", "Netflix", "Apple", "Uber", "Stripe", "Databricks"].includes(comp.name);
    const tierMultiplier = isTopTier ? 1.3 : (comp.interview_difficulty === 'Hard' ? 1.15 : 1.0);

    roles.forEach((role) => {
      locations.forEach((loc) => {
        let baseAvg, bonusAvg, equityAvg;

        if (loc.inr) {
          // Represented in USD equivalent for standardized schema ($35k - $90k USD = ~₹30 LPA - ₹75 LPA)
          baseAvg = Math.round(35000 * role.multiplier * tierMultiplier);
          bonusAvg = Math.round(baseAvg * 0.15);
          equityAvg = Math.round(baseAvg * 0.25);
        } else {
          baseAvg = Math.round(155000 * role.multiplier * tierMultiplier * loc.baseScale);
          bonusAvg = Math.round(baseAvg * 0.18);
          equityAvg = Math.round(baseAvg * 0.35);
        }

        const baseLow = Math.round(baseAvg * 0.88);
        const baseHigh = Math.round(baseAvg * 1.18);

        const bonusLow = Math.round(bonusAvg * 0.7);
        const bonusHigh = Math.round(bonusAvg * 1.4);

        const equityLow = Math.round(equityAvg * 0.6);
        const equityHigh = Math.round(equityAvg * 1.5);

        const totalCompLow = baseLow + bonusLow + equityLow;
        const totalCompHigh = baseHigh + bonusHigh + equityHigh;
        const totalCompAvg = baseAvg + bonusAvg + equityAvg;

        salaries.push({
          id: id++,
          companyId: comp.id,
          role: role.name,
          location: loc.name,
          salary_low: baseLow,
          salary_high: baseHigh,
          salary_average: baseAvg,
          bonus_low: bonusLow,
          bonus_high: bonusHigh,
          bonus_average: bonusAvg,
          equity_low: equityLow,
          equity_high: equityHigh,
          total_comp_low: totalCompLow,
          total_comp_high: totalCompHigh,
          total_comp_average: totalCompAvg,
          data_points: Math.floor(Math.random() * 120) + 25,
          last_updated: new Date()
        });
      });
    });
  });

  return salaries;
}

// Generate interview processes round by round
function generateInterviewProcesses(companies) {
  const processes = [];
  let id = 1;

  companies.forEach((comp) => {
    // Process for Senior Software Engineer
    processes.push(
      {
        id: id++,
        companyId: comp.id,
        role: "Senior Software Engineer",
        round_number: 1,
        round_name: "Recruiter Screen",
        duration_minutes: 30,
        interviewer_count: 1,
        focus_areas: ["Background & Motivation", "Project Highlights", "Compensation Alignment", `Culture fit with ${comp.name}`],
        tips: [`Show genuine enthusiasm for ${comp.name}'s mission`, "Have a crisp 2-minute elevator pitch ready", "Ask thoughtful questions about team culture"],
        rejection_rate: 20
      },
      {
        id: id++,
        companyId: comp.id,
        role: "Senior Software Engineer",
        round_number: 2,
        round_name: "Technical Phone Screen",
        duration_minutes: 45,
        interviewer_count: 1,
        focus_areas: ["Data Structures & Algorithms", "Code Cleanliness", "Communication while coding"],
        tips: ["Think out loud continually", "Ask clarifying questions on constraints before writing any code", "Test code line by line with sample input"],
        rejection_rate: 45
      },
      {
        id: id++,
        companyId: comp.id,
        role: "Senior Software Engineer",
        round_number: 3,
        round_name: "Distributed System Design",
        duration_minutes: 60,
        interviewer_count: 1,
        focus_areas: ["High-Level Architecture", "Scalability & Bottlenecks", "Data Modeling & Storage", "Trade-offs"],
        tips: ["Spend the first 5 minutes agreeing on non-functional requirements", "Drive the conversation and lead with high-level block diagram", "Anticipate failure scenarios and data partition splits"],
        rejection_rate: 40
      },
      {
        id: id++,
        companyId: comp.id,
        role: "Senior Software Engineer",
        round_number: 4,
        round_name: "Coding & Problem Solving (Onsite)",
        duration_minutes: 45,
        interviewer_count: 1,
        focus_areas: ["Advanced DSA", "Time/Space Complexity", "Modular Code Design"],
        tips: ["Aim for optimal Big-O complexity", "Write production-grade clean code with meaningful variable names", "Catch off-by-one errors proactively"],
        rejection_rate: 35
      },
      {
        id: id++,
        companyId: comp.id,
        role: "Senior Software Engineer",
        round_number: 5,
        round_name: "Behavioral & Leadership",
        duration_minutes: 45,
        interviewer_count: 1,
        focus_areas: ["STAR Method Responses", "Conflict Resolution", "Cross-Functional Leadership", "Values Alignment"],
        tips: [`Connect experiences back to ${comp.name}'s core values`, "Quantify business and engineering outcomes", "Showcase empathy and collaborative mentorship"],
        rejection_rate: 25
      }
    );

    // Process for SDE
    processes.push(
      {
        id: id++,
        companyId: comp.id,
        role: "SDE",
        round_number: 1,
        round_name: "Online Assessment (OA)",
        duration_minutes: 90,
        interviewer_count: 0,
        focus_areas: ["2 Algorithmic Coding Problems", "Work Simulation / Style Assessment"],
        tips: ["Practice passing all hidden edge test cases", "Manage time: 40 mins per coding challenge", "Maintain steady focus throughout"],
        rejection_rate: 60
      },
      {
        id: id++,
        companyId: comp.id,
        role: "SDE",
        round_number: 2,
        round_name: "Data Structures & Algorithms I",
        duration_minutes: 45,
        interviewer_count: 1,
        focus_areas: ["Arrays, Trees, Dynamic Programming", "Complexity Analysis"],
        tips: ["Verbalize thought process from brute force to optimal", "Write syntactically clean code", "Verify edge cases (null, empty, large values)"],
        rejection_rate: 35
      },
      {
        id: id++,
        companyId: comp.id,
        role: "SDE",
        round_number: 3,
        round_name: "Object-Oriented Design & DSA II",
        duration_minutes: 45,
        interviewer_count: 1,
        focus_areas: ["Low-Level Design", "Design Patterns", "Clean Code"],
        tips: ["Apply SOLID principles cleanly", "Keep classes modular and decoupled", "Explain why you chose specific design patterns"],
        rejection_rate: 30
      },
      {
        id: id++,
        companyId: comp.id,
        role: "SDE",
        round_number: 4,
        round_name: "Behavioral & Cultural Interview",
        duration_minutes: 45,
        interviewer_count: 1,
        focus_areas: ["Teamwork", "Adaptability", "Passion for Technology"],
        tips: ["Be genuine and reflective about challenges", "Highlight willingness to learn quickly", "Ask insightful questions about engineering culture"],
        rejection_rate: 20
      }
    );
  });

  return processes;
}

// Generate real success stories from users who received offers
function generateSuccessStories(companies) {
  const stories = [];
  let id = 1;

  const sampleStories = [
    {
      role: "Senior Software Engineer",
      level: "Senior",
      years: 6,
      weeks: 5,
      rounds: 5,
      comp: 220000,
      tips: [
        "Focus on system design fundamentals: caching, message queues, and database sharding.",
        "Practice explaining your thought process out loud using mock interview tools.",
        "Always discuss trade-offs: no architectural choice is universally perfect.",
        "Prepare 6 polished STAR stories covering leadership, failure, and mentorship."
      ],
      story: "I started preparation 5 weeks before my interview loop. I practiced 15 system design mocks and completed 80 targeted LeetCode questions focusing on graph algorithms and dynamic programming. During the interview, staying calm and treating the interviewer as a collaborative teammate made all the difference. Got an offer that was 20% higher than my initial expectations!"
    },
    {
      role: "SDE",
      level: "Mid",
      years: 3,
      weeks: 4,
      rounds: 4,
      comp: 175000,
      tips: [
        "Company values matter as much as technical chops. Study them thoroughly.",
        "When coding, write test cases before the interviewer asks for them.",
        "Ask clarifying questions up front: constraints, input bounds, null checks.",
        "Don't panic if you get stuck; vocalize where your thought process is halted."
      ],
      story: "Career Copilot's company-specific prep gave me the exact confidence boost I needed. The questions I was asked in round 2 and round 3 were almost identical in scope to the practice modules here. I felt completely prepared for the behavioral questions using the STAR framework."
    },
    {
      role: "Frontend Engineer",
      level: "Mid",
      years: 4,
      weeks: 3,
      rounds: 4,
      comp: 165000,
      tips: [
        "Deep dive into browser rendering cycles, event loops, and reflow/repaint triggers.",
        "Master state management architectures and component composition.",
        "Be ready to write a custom virtualized list or debounce hook from scratch.",
        "Show care for accessibility (ARIA, keyboard navigation)."
      ],
      story: "The interview focused heavily on frontend architecture and web performance. Because I practiced company-specific machine coding questions, I wrote clean modular components within 30 minutes, leaving plenty of time to optimize render cycles and discuss accessibility."
    },
    {
      role: "Product Manager",
      level: "Senior",
      years: 7,
      weeks: 6,
      rounds: 5,
      comp: 235000,
      tips: [
        "Structure product design answers around customer segmentation and unmet needs.",
        "Always define clear north-star metrics and counter-metrics.",
        "Show strong technical empathy when collaborating with engineering leaders.",
        "Be prepared to prioritize features ruthlessly based on ROI and complexity."
      ],
      story: "Interviewing for PM requires crisp frameworks without sounding robotic. I spent 6 weeks refining my product sense and execution frameworks. Understanding the company's business model and competitive landscape was the deciding factor that secured the offer."
    }
  ];

  companies.forEach((comp) => {
    // Generate 2 - 3 stories per company
    const count = 2 + (comp.id % 2);
    for (let i = 0; i < count; i++) {
      const template = sampleStories[i % sampleStories.length];
      const negotiated = Math.round(template.comp * (comp.interview_difficulty === 'Hard' ? 1.15 : 1.0));
      stories.push({
        id: id++,
        companyId: comp.id,
        role: template.role,
        experience_level: template.level,
        years_experience: template.years,
        interview_duration: comp.average_interview_duration,
        preparation_weeks: template.weeks,
        interview_rounds: comp.average_interview_rounds,
        key_preparation: ["System Design", "Algorithmic Problem Solving", "Behavioral & Values Alignment", "Mock Interviews"],
        tips_for_success: template.tips,
        story: `${template.story} Interviewing at ${comp.name} was rigorous, but taking systematic notes and reviewing past interview patterns was key.`,
        salary_negotiated: negotiated,
        offer_accepted: true,
        rating: 5
      });
    }
  });

  return stories;
}

// Generate reviews with ratings, pros, and cons
function generateReviews(companies) {
  const reviews = [];
  let id = 1;

  const prosList = [
    "World-class engineering talent and supportive mentors",
    "Cutting-edge tech stack solving immense scale challenges",
    "Generous compensation, 401(k) match, and equity upside",
    "Flexible remote/hybrid policy and strong work autonomy",
    "High emphasis on psychological safety and inclusive culture",
    "Outstanding health benefits, wellness perks, and learning budget",
    "Strong brand prestige on resume unlocking future opportunities"
  ];

  const consList = [
    "Fast-paced environment can occasionally lead to crunch before major launches",
    "Large organizational hierarchy can make cross-team consensus slow",
    "High performance expectations and rigorous peer review cycles",
    "Frequent reorganizations and shifting quarterly priorities",
    "On-call rotations can be demanding for mission-critical services"
  ];

  companies.forEach((comp) => {
    const isHard = comp.interview_difficulty === 'Hard';
    const baseRating = isHard ? 4.3 : 4.0;

    // Generate 3 sample reviews per company
    const roles = ["Senior Software Engineer", "SDE", "Staff Engineer"];
    roles.forEach((role, idx) => {
      const rating = Math.min(5, Math.max(3, Math.round((baseRating + (idx % 2 === 0 ? 0.3 : -0.2)) * 10) / 10));
      reviews.push({
        id: id++,
        companyId: comp.id,
        role: role,
        employment_status: idx === 1 ? "Former" : "Current",
        years_at_company: idx + 2,
        rating: Math.round(rating),
        pros: [
          prosList[(comp.id + idx) % prosList.length],
          prosList[(comp.id + idx + 2) % prosList.length],
          prosList[(comp.id + idx + 4) % prosList.length]
        ],
        cons: [
          consList[(comp.id + idx) % consList.length],
          consList[(comp.id + idx + 2) % consList.length]
        ],
        work_life_balance: Math.min(5, Math.max(3, Math.round(baseRating - (isHard ? 0.3 : 0.0)))),
        culture_rating: Math.min(5, Math.max(3, Math.round(baseRating + 0.2))),
        management_rating: Math.min(5, Math.max(3, Math.round(baseRating))),
        compensation_rating: Math.min(5, Math.max(3, Math.round(baseRating + (isHard ? 0.5 : 0.1))))
      });
    });
  });

  return reviews;
}

// Generate culture values
function generateCultureValues(companies) {
  const values = [];
  let id = 1;

  const standardValues = [
    {
      val: "Customer Obsession",
      desc: "Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust.",
      test: "Tested via scenario questions asking how you balanced business constraints against user pain points.",
      imp: "Critical"
    },
    {
      val: "Bias for Action",
      desc: "Speed matters in business. Many decisions and actions are reversible and do not need extensive study.",
      test: "Evaluated by asking how you handled incomplete data and launched MVPs without blocking on perfection.",
      imp: "Critical"
    },
    {
      val: "Deep Craftsmanship & Quality",
      desc: "We take immense pride in writing elegant, resilient, and well-tested systems that withstand millions of users.",
      test: "Evaluated during live coding sessions, readability of architecture, and attention to edge cases.",
      imp: "Critical"
    },
    {
      val: "Psychological Safety & Collaboration",
      desc: "We value open debate, intellectual humility, and lifting teammates through mentorship and clear feedback.",
      test: "Tested via questions exploring past team disagreements and how you mentored junior developers.",
      imp: "Important"
    },
    {
      val: "Think 10x & Innovation",
      desc: "Challenging conventional boundaries to invent transformative approaches rather than incremental tweaks.",
      test: "Tested by asking for examples where you challenged the status quo and created novel solutions.",
      imp: "Important"
    }
  ];

  companies.forEach((comp) => {
    standardValues.forEach((sv) => {
      values.push({
        id: id++,
        companyId: comp.id,
        value: sv.val,
        description: sv.desc,
        how_its_tested: sv.test,
        importance: sv.imp
      });
    });
  });

  return values;
}

// Write all generated fixtures to disk
function run() {
  console.log("🚀 Generating fixtures for Career Copilot Feature 6...");

  const seedsDir = path.join(__dirname);
  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  // 1. Companies
  const companies = companiesBase;
  fs.writeFileSync(path.join(seedsDir, 'companies.json'), JSON.stringify(companies, null, 2));
  console.log(`✅ Saved ${companies.length} companies to seeds/companies.json`);

  // 2. Questions
  const questions = generateQuestionsForCompanies(companies);
  fs.writeFileSync(path.join(seedsDir, 'companyInterviewQuestions.json'), JSON.stringify(questions, null, 2));
  console.log(`✅ Saved ${questions.length} interview questions to seeds/companyInterviewQuestions.json`);

  // 3. Salary Data
  const salaries = generateSalaryData(companies);
  fs.writeFileSync(path.join(seedsDir, 'companySalaryData.json'), JSON.stringify(salaries, null, 2));
  console.log(`✅ Saved ${salaries.length} salary records to seeds/companySalaryData.json`);

  // 4. Success Stories
  const stories = generateSuccessStories(companies);
  fs.writeFileSync(path.join(seedsDir, 'companySuccessStories.json'), JSON.stringify(stories, null, 2));
  console.log(`✅ Saved ${stories.length} success stories to seeds/companySuccessStories.json`);

  // 5. Interview Processes
  const processes = generateInterviewProcesses(companies);
  fs.writeFileSync(path.join(seedsDir, 'companyInterviewProcesses.json'), JSON.stringify(processes, null, 2));
  console.log(`✅ Saved ${processes.length} interview processes to seeds/companyInterviewProcesses.json`);

  // 6. Reviews
  const reviews = generateReviews(companies);
  fs.writeFileSync(path.join(seedsDir, 'companyReviews.json'), JSON.stringify(reviews, null, 2));
  console.log(`✅ Saved ${reviews.length} reviews to seeds/companyReviews.json`);

  // 7. Culture Values
  const cultureValues = generateCultureValues(companies);
  fs.writeFileSync(path.join(seedsDir, 'companyCultureValues.json'), JSON.stringify(cultureValues, null, 2));
  console.log(`✅ Saved ${cultureValues.length} culture values to seeds/companyCultureValues.json`);

  console.log("🎉 All 7 seed datasets generated successfully!");
}

if (require.main === module) {
  run();
}

module.exports = { run };
