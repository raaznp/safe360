const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../../models/User');
const Job = require('../../models/Job');
const BlogPost = require('../../models/BlogPost');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const jobs = [
    {
        title: 'Senior Frontend Engineer',
        type: 'Full-time',
        location: 'Remote',
        department: 'Engineering',
        description: 'We are looking for an experienced Frontend Engineer to lead our core platform development. You will be working with React, TailwindCSS, and Three.js for our web-based VR experiences.',
        requirements: [
            '5+ years of experience with React and modern JavaScript',
            'Experience with WebGL/Three.js is a huge plus',
            'Strong understanding of web performance and accessibility',
            'Experience with state management (Redux, Zustand, etc.)'
        ],
        active: true
    },
    {
        title: 'VR/AR Specialist',
        type: 'Full-time',
        location: 'London, UK',
        department: 'R&D',
        description: 'Join our R&D team to push the boundaries of immersive training. You will be developing realistic safety simulations using Unity and Unreal Engine.',
        requirements: [
            'Strong proficiency in C# and/or C++',
            'Experience with Unity or Unreal Engine',
            'Knowledge of VR SDKs (Oculus, SteamVR, OpenXR)',
            '3D modeling skills are a bonus'
        ],
        active: true
    },
    {
        title: 'Product Manager',
        type: 'Full-time',
        location: 'New York, USA',
        department: 'Product',
        description: 'Lead the vision for our enterprise safety platform. You will work closely with customers and engineering to deliver high-impact features.',
        requirements: [
            '3+ years of product management experience in B2B SaaS',
            'Strong analytical and communication skills',
            'Experience in EdTech or Safety industries is a plus',
            'Ability to translate complex requirements into user stories'
        ],
        active: true
    },
    {
        title: 'Sales Executive',
        type: 'Full-time',
        location: 'Remote',
        department: 'Sales',
        description: 'Help us bring Safe360 to more companies around the world. We need a driven sales professional to manage the full sales cycle.',
        requirements: [
            'Proven track record in B2B software sales',
            'Excellent presentation and negotiation skills',
            'Self-motivated and goal-oriented',
            'Experience with CRM tools (Salesforce, HubSpot)'
        ],
        active: true
    },
    {
        title: 'Safety Content Specialist',
        type: 'Contract',
        location: 'Remote',
        department: 'Content',
        description: 'Create engaging and accurate safety training content. You will collaborate with subject matter experts to design curriculum.',
        requirements: [
            'Background in Occupational Health & Safety or related field',
            'Experience in instructional design',
            'Strong writing and editing skills',
            'Attention to detail'
        ],
        active: true
    },
    {
        title: 'DevOps Engineer',
        type: 'Full-time',
        location: 'Remote',
        department: 'Engineering',
        description: 'Manage our cloud infrastructure and CI/CD pipelines. Ensure high availability and security for our global user base.',
        requirements: [
            'Experience with AWS or Azure',
            'Proficiency in Docker and Kubernetes',
            'Infrastructure as Code (Terraform/Ansible)',
            'Strong scripting skills (Bash/Python)'
        ],
        active: true
    },
    {
        title: 'Lead UI/UX Designer',
        type: 'Full-time',
        location: 'Kathmandu, Nepal',
        department: 'Design',
        description: 'Shape the visual identity of Safe360. You will design intuitive interfaces for our LMS and immersive experiences.',
        requirements: [
            'Strong portfolio demonstrating UI/UX skills',
            'Proficiency in Figma and Adobe Creative Suite',
            'Experience designing for VR/AR is a plus',
            'Ability to lead a design team'
        ],
        active: true
    },
    {
        title: 'Account Manager',
        type: 'Full-time',
        location: 'London, UK',
        department: 'Sales',
        description: 'Nurture relationships with our key enterprise clients. Ensure they are getting the most out of the Safe360 platform.',
        requirements: [
            'Experience in account management or customer success',
            'Strong interpersonal skills',
            'Ability to understand technical products',
            'Problem-solving mindset'
        ],
        active: true
    },
    {
        title: 'Technical Support Lead',
        type: 'Full-time',
        location: 'Kathmandu, Nepal',
        department: 'Support',
        description: 'Lead our global support team. You will handle escalations and ensure valid SLAs are met.',
        requirements: [
            'Experience in technical support leadership',
            'Excellent written and verbal communication',
            'Familiarity with ticketing systems (Zendesk/Jira)',
            'Ability to debug web application issues'
        ],
        active: true
    },
    {
        title: 'Safety Consultant',
        type: 'Part-time',
        location: 'Kathmandu, Nepal',
        department: 'Content',
        description: 'Provide local expertise on safety regulations and training needs in the South Asian market.',
        requirements: [
            'Certified Safety Professional',
            'Knowledge of local labor laws',
            'Experience delivering safety training',
            'Consulting experience'
        ],
        active: true
    },
    {
        title: 'QA Automation Engineer',
        type: 'Full-time',
        location: 'Remote',
        department: 'Engineering',
        description: 'Build automated test suites for our web and VR platforms to ensure flawless releases.',
        requirements: [
            'Experience with Cypress, Selenium, or Playwright',
            'Ability to write clean, maintainable test code',
            'Experience testing 3D/VR applications is a bonus',
            'CI/CD integration experience'
        ],
        active: true
    },
    {
        title: 'Mobile App Developer',
        type: 'Contract',
        location: 'Remote',
        department: 'Engineering',
        description: 'Help us build the companion mobile app for Safe360 using React Native.',
        requirements: [
            'Proficiency in React Native',
            'Experience publishing apps to App Store and Play Store',
            'Knowledge of native modules',
            'Offline-first architecture experience'
        ],
        active: true
    }
];

const blogPosts = [
    {
        title: 'The Future of VR in Industrial Safety',
        slug: 'future-vr-industrial-safety',
        content: 'Virtual Reality is not just for gaming anymore. In the industrial sector, VR is revolutionizing how we train employees for hazardous environments. By simulating dangerous scenarios in a safe, controlled environment, workers can build muscle memory and learn correct procedures without any real-world risk. Studies show that VR training can improve retention rates by up to 75% compared to traditional methods.',
        author: 'Sarah Jenkins',
        tags: ['VR', 'Safety', 'Industry 4.0'],
        image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-01T10:00:00')
    },
    {
        title: 'Top 5 Safety Trends for 2024',
        slug: 'top-safety-trends-2024',
        content: 'As we move into 2024, the safety landscape is evolving rapidly. From AI-driven hazard detection to wearable health monitors, technology is playing a bigger role than ever. In this post, we explore the top 5 trends that every safety manager needs to know about to keep their workforce safe and compliant.',
        author: 'Mike Ross',
        tags: ['Trends', 'Safety Management'],
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-02T10:00:00')
    },
    {
        title: 'How Gamification is Improving Training Retention',
        slug: 'gamification-training-retention',
        content: 'Boring training sessions are a thing of the past. By incorporating game-like elements such as points, leaderboards, and badges into safety training, companies are seeing a massive boost in engagement. Gamification taps into our natural desire for competition and achievement, making learning fun and more effective.',
        author: 'David Chen',
        tags: ['Gamification', 'EdTech', 'Engagement'],
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-03T10:00:00')
    },
    {
        title: 'Case Study: Reducing Accidents by 40% with Safe360',
        slug: 'case-study-reducing-accidents',
        content: 'See how a leading manufacturing firm used Safe360\'s immersive training platform to drastically reduce workplace accidents. By implementing our VR simulations and real-time analytics, they were able to identify high-risk areas and provide targeted training to their staff, resulting in a 40% drop in incidents within the first year.',
        author: 'Emily White',
        tags: ['Case Study', 'Success Story', 'Manufacturing'],
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-04T10:00:00')
    },
    {
        title: 'Mental Health in the Workplace: A New Priority',
        slug: 'mental-health-workplace',
        content: 'Safety isn\'t just physical. Mental well-being is a critical component of a safe and productive workplace. We discuss strategies for creating a supportive environment, recognizing signs of burnout, and providing resources for employees who may be struggling.',
        author: 'Dr. Alan Grant',
        tags: ['Mental Health', 'Wellness', 'Culture'],
        image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-05T10:00:00')
    },
    {
        title: 'Why Immersive Training Beats Video',
        slug: 'immersive-vs-video-training',
        content: 'Video training has been the standard for decades, but it lacks interactivity. Immersive training places the learner in the center of the action. We breakdown the cognitive science behind why doing is better than watching, and how VR activates spatial memory for better recall.',
        author: 'Raj Kumar Nepal',
        tags: ['Learning Science', 'VR', 'Training'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-06T10:00:00')
    },
    {
        title: 'Safe360 Launches New Branch in Nepal',
        slug: 'safe360-launch-nepal',
        content: 'We are excited to announce our expansion into South Asia with a new branch office in Kathmandu, Nepal. This strategic move allows us to tap into a vibrant tech talent pool and better serve our growing client base in the region. Meet our new team members and learn about our plans for the future.',
        author: 'Amrit Reule',
        tags: ['Company News', 'Expansion', 'Nepal'],
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-07T10:00:00')
    },
    {
        title: 'The ROI of Safety Investing',
        slug: 'roi-safety-investing',
        content: 'Many companies view safety training as a sunk cost, but the data suggests otherwise. Fewer accidents mean lower insurance premiums, less downtime, and higher employee morale. We analyze the financial benefits of investing in a robust safety program like Safe360.',
        author: 'Chandan Sah Kanu',
        tags: ['Business', 'ROI', 'Strategy'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-08T10:00:00')
    },
    {
        title: 'Meet the Minds: Interview with Raj Kumar Nepal',
        slug: 'meet-the-minds-raj',
        content: 'In our latest "Meet the Minds" series, we sit down with our Group Leader and Project Manager, Raj Kumar Nepal. He shares his journey from a full-stack developer to leading a global team, his vision for the future of EdTech, and what keeps him motivated every day.',
        author: 'Rabindra Dhami',
        tags: ['Interview', 'Team', 'Leadership'],
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-09T10:00:00')
    },
    {
        title: 'VR Hardware: What You Need',
        slug: 'vr-hardware-guide',
        content: 'Confused about which headset to buy for your enterprise? We compare the top contenders in the market—from the Meta Quest 3 to the Apple Vision Pro and HTC Vive—breaking down pros, cons, and best use cases for industrial training.',
        author: 'Sanjiv Rai',
        tags: ['Hardware', 'VR Headsets', 'Tech Review'],
        image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-10T10:00:00')
    },
    {
        title: 'Cloud Security for Enterprise LMS',
        slug: 'cloud-security-lms',
        content: 'Data security is paramount when hosting sensitive employee training records. Learn how Safe360 employs end-to-end encryption, regular penetration testing, and compliance certifications (SOC2, GDPR) to keep your data safe in the cloud.',
        author: 'Sarah Chen',
        tags: ['Security', 'Cloud', 'Compliance'],
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-11T10:00:00')
    },
    {
        title: '5 Steps to a Safer Warehouse',
        slug: '5-steps-safer-warehouse',
        content: 'Warehouses are bustling environments with unique safety challenges. From forklift traffic to heavy lifting, we outline five actionable steps warehouse managers can take immediately to reduce accident rates and improve operational efficiency.',
        author: 'Mike Ross',
        tags: ['Warehouse', 'Safety Tips', 'Logistics'],
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-12T10:00:00')
    },
    {
        title: 'The Role of AI in Predictive Safety',
        slug: 'ai-predictive-safety',
        content: 'Artificial Intelligence is transforming safety from reactive to proactive. By analyzing historical data and near-miss reports, AI algorithms can predict potential incidents before they happen, allowing safety teams to intervene early.',
        author: 'David Chen',
        tags: ['AI', 'Tech Trends', 'Predictive Analytics'],
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-13T10:00:00')
    },
    {
        title: 'Building a Safety Culture from Day One',
        slug: 'building-safety-culture',
        content: 'Safety equipment is important, but culture is paramount. We discuss how to instill a safety-first mindset in new hires during the onboarding process, ensuring that safety values are ingrained from their very first day on the job.',
        author: 'Emily White',
        tags: ['Culture', 'Onboarding', 'HR'],
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-14T10:00:00')
    },
    {
        title: 'VR Training for Fire Safety',
        slug: 'vr-training-fire-safety',
        content: 'Fire drills are essential, but often lack realism. VR allows employees to experience a virtual fire emergency, practice using extinguishers, and navigate evacuation routes in a high-stress but safe environment.',
        author: 'Sarah Jenkins',
        tags: ['VR', 'Fire Safety', 'Training'],
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-15T10:00:00')
    },
    {
        title: 'Ergonomics in the Modern Office',
        slug: 'ergonomics-modern-office',
        content: 'Remote work and hybrid models have changed how we work. We explore the importance of ergonomics for both home and office setups to prevent repetitive strain injuries and improve long-term employee health.',
        author: 'Dr. Alan Grant',
        tags: ['Ergonomics', 'Health', 'Remote Work'],
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-16T10:00:00')
    },
    {
        title: 'Understanding OSHA Compliance 2024',
        slug: 'osha-compliance-2024',
        content: 'Staying compliant with OSHA regulations is non-negotiable. We break down the key updates and changes in regulations for 2024 that every safety officer needs to be aware of to avoid fines and ensure worker protection.',
        author: 'Chandan Sah Kanu',
        tags: ['Updates', 'Compliance', 'Regulatory'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-17T10:00:00')
    },
    {
        title: 'The Psychology of Safety',
        slug: 'psychology-of-safety',
        content: 'Why do workers take risks? Understanding the psychological factors behind unsafe behaviors is key to prevention. We delve into behavioral safety theories and how to nudge employees towards safer choices.',
        author: 'Raj Kumar Nepal',
        tags: ['Psychology', 'Behavior', 'Safety Management'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-18T10:00:00')
    },
    {
        title: 'Heavy Machinery Safety: Best Practices',
        slug: 'heavy-machinery-safety',
        content: 'Operating heavy machinery requires skill and constant vigilance. We compile a list of best practices for crane, forklift, and excavator operators, emphasizing the importance of pre-shift inspections and communication.',
        author: 'Sanjiv Rai',
        tags: ['Construction', 'Heavy Machinery', 'Safety Tips'],
        image: 'https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-19T10:00:00')
    },
    {
        title: 'Digital Twins in Construction',
        slug: 'digital-twins-construction',
        content: 'Digital Twins are creating virtual replicas of physical sites. See how construction managers are using this technology to simulate workflows, identify hazards, and optimize site layout before breaking ground.',
        author: 'Amrit Reule',
        tags: ['Construction', 'Tech Trends', 'Digital Twins'],
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-20T10:00:00')
    },
    {
        title: 'Emergency Response Planning',
        slug: 'emergency-response-planning',
        content: 'When disaster strikes, every second counts. We guide you through the process of creating a comprehensive emergency response plan, from forming a crisis team to conducting regular drills and post-incident reviews.',
        author: 'Sarah Jenkins',
        tags: ['Emergency', 'Planning', 'Management'],
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-21T10:00:00')
    },
    {
        title: 'The Hidden Dangers of Noise Pollution',
        slug: 'hidden-dangers-noise-pollution',
        content: 'Industrial noise is more than just an annoyance—it\'s a serious health hazard. Prolonged exposure can lead to permanent hearing loss, stress, and fatigue. We look at effective hearing conservation programs and noise mitigation strategies.',
        author: 'Dr. Alan Grant',
        tags: ['Health', 'Noise', 'Occupational Safety'],
        image: 'https://images.unsplash.com/photo-1520690214124-2405c5217036?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-22T10:00:00')
    },
    {
        title: 'Ladder Safety 101',
        slug: 'ladder-safety-101',
        content: 'Falls from ladders are one of the most common workplace injuries. We go back to basics with a comprehensive guide on choosing the right ladder, inspecting it for defects, and using it safely.',
        author: 'Mike Ross',
        tags: ['Safety Tips', 'Construction', 'Training'],
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-23T10:00:00')
    },
    {
        title: 'Chemical Safety in the Workplace',
        slug: 'chemical-safety-workplace',
        content: 'Handling hazardous chemicals requires strict adherence to safety protocols. From proper labeling and storage to using the correct PPE, we cover the essential steps to prevent chemical accidents and exposure.',
        author: 'Sarah Chen',
        tags: ['Chemicals', 'HazMat', 'Safety Tips'],
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-24T10:00:00')
    },
    {
        title: 'The Benefits of a Safety Committee',
        slug: 'benefits-safety-committee',
        content: 'Empowering employees to take ownership of safety is powerful. A safety committee gives workers a voice, improves communication, and helps identify hazards that management might miss.',
        author: 'Emily White',
        tags: ['Leadership', 'Culture', 'Management'],
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-25T10:00:00')
    },
    {
        title: 'Preventing Slips, Trips, and Falls',
        slug: 'preventing-slips-trips-falls',
        content: 'Slips, trips, and falls are a leading cause of lost workdays. Simple housekeeping measures, proper lighting, and slip-resistant flooring can make a huge difference in preventing these common accidents.',
        author: 'Raj Kumar Nepal',
        tags: ['Safety Tips', 'Prevention', 'Workplace'],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-26T10:00:00')
    },
    {
        title: 'Safety Data Sheets: A Guide',
        slug: 'safety-data-sheets-guide',
        content: 'Safety Data Sheets (SDS) are the backbone of chemical safety. We explain how to read and understand these critical documents, ensuring that workers know exactly what they are handling and how to protect themselves.',
        author: 'Chandan Sah Kanu',
        tags: ['Compliance', 'Training', 'Documentation'],
        image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-27T10:00:00')
    },
    {
        title: 'The Importance of Hydration for Workers',
        slug: 'importance-hydration-workers',
        content: 'Dehydration can lead to fatigue, dizziness, and reduced cognitive function, increasing the risk of accidents. We discuss the importance of keeping workers hydrated, especially in hot environments or during physical labor.',
        author: 'Dr. Alan Grant',
        tags: ['Health', 'Wellness', 'Safety Tips'],
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-28T10:00:00')
    },
    {
        title: 'Lone Worker Safety',
        slug: 'lone-worker-safety',
        content: 'Working alone presents unique risks. We explore technologies and procedures to keep lone workers safe, such as check-in systems, panic buttons, and GPS tracking.',
        author: 'Sanjiv Rai',
        tags: ['Lone Worker', 'Technology', 'Safety Management'],
        image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-29T10:00:00')
    },
    {
        title: 'Effective Safety Signage',
        slug: 'effective-safety-signage',
        content: 'Clear and visible signage is a critical part of any safety program. We look at the different types of safety signs, their meanings, and best practices for placement to ensure they are seen and understood.',
        author: 'Amrit Reule',
        tags: ['Signage', 'Compliance', 'Visuals'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-30T10:00:00')
    },
    {
        title: 'Managing Stress in High-Risk Jobs',
        slug: 'managing-stress-high-risk-jobs',
        content: 'High-risk jobs often come with high stress. We discuss the impact of chronic stress on safety performance and offer strategies for managing stress, building resilience, and supporting mental health in the workplace.',
        author: 'Sarah Jenkins',
        tags: ['Mental Health', 'Wellness', 'Stress Management'],
        image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800',
        published: true,
        createdAt: new Date('2024-01-31T10:00:00')
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Seed Admin
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const admin = new User({
                username: 'admin',
                email: 'admin@safe360.com',
                password: 'password123', // Change this in production
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Seed Jobs
        // Check if jobs exist to avoid duplicates or clear them
        // For this task, let's clear existing jobs to ensure clean state with new data
        await Job.deleteMany({}); 
        await Job.insertMany(jobs);
        console.log(`Seeded ${jobs.length} jobs`);

        // Seed Blog Posts
        await BlogPost.deleteMany({});
        
        // Fetch the admin user to use their ID
        const adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            throw new Error('Admin user not found for seeding posts');
        }

        const postsWithAuthor = blogPosts.map(post => ({
            ...post,
            author: adminUser._id,
            visibility: 'public'
        }));

        await BlogPost.insertMany(postsWithAuthor);
        console.log(`Seeded ${blogPosts.length} blog posts with author ${adminUser.username}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
