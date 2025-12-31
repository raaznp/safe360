export const JOBS = [
    {
        id: 1,
        title: "Senior VR Developer",
        department: "Engineering",
        type: "Full-time",
        location: "Remote / London",
        description: "Lead the development of our core VR training simulations using Unity and Unreal Engine."
    },
    {
        id: 2,
        title: "UX/UI Designer",
        department: "Design",
        type: "Full-time",
        location: "Kathmandu",
        description: "Design intuitive interfaces for complex industrial safety dashboards and VR experiences."
    },
    {
        id: 3,
        title: "Safety Content Specialist",
        department: "Content",
        type: "Contract",
        location: "Remote",
        description: "Collaborate with subject matter experts to create accurate and effective safety training scenarios."
    },
    {
        id: 4,
        title: "Full Stack Engineer",
        department: "Engineering",
        type: "Full-time",
        location: "London",
        description: "Build scalable web applications and APIs to power our LMS and analytics platforms."
    },
    {
        id: 5,
        title: "Enterprise Sales Manager",
        department: "Sales",
        type: "Full-time",
        location: "New York",
        description: "Drive adoption of Safe360 solutions among Fortune 500 manufacturing and construction firms."
    }
];

export const BLOG_POSTS = [
    {
        _id: '1',
        title: 'The Rise of VR in Industrial Safety',
        slug: 'vr-industrial-safety',
        content: 'Virtual Reality is transforming how we approach hazardous environment training. By simulating dangerous scenarios in a controlled environment, workers can build muscle memory and decision-making skills without real-world risks.',
        author: 'Sarah Jenkins',
        createdAt: new Date().toISOString(),
        tags: ['VR', 'Safety', 'Industry 4.0'],
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'
    },
    {
        _id: '2',
        title: 'Why Traditional LMS is Failing',
        slug: 'traditional-lms-failing',
        content: 'Engagement rates in standard e-learning modules are at an all-time low. The "click-next" mentality of compliance training is not only boring but ineffective. Gamification and interactivity are the keys to retention.',
        author: 'Mike Ross',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        tags: ['LMS', 'EdTech', 'Engagement'],
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop'
    },
    {
        _id: '3',
        title: 'Augmented Reality: The New Assistant',
        slug: 'ar-new-assistant',
        content: 'How AR overlays are helping technicians perform complex repairs with zero errors. From highlighting components to displaying real-time schematics, AR is the ultimate on-the-job support tool.',
        author: 'David Chen',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        tags: ['AR', 'Maintenance', 'Tech'],
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'
    },
    {
        _id: '4',
        title: 'Data-Driven Safety Culture',
        slug: 'data-driven-safety',
        content: 'Moving from reactive to proactive safety management using predictive analytics. By analyzing near-miss reports and training performance data, companies can identify risks before accidents happen.',
        author: 'Emma Watson',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        tags: ['Analytics', 'Safety Culture', 'Big Data'],
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop'
    },
    {
        _id: '5',
        title: 'The ROI of Immersive Training',
        slug: 'roi-immersive-training',
        content: 'Breaking down the cost savings and productivity gains from VR/AR implementation. While the initial investment may be higher, the long-term reduction in accidents and training time pays off 10x.',
        author: 'Robert Stark',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        tags: ['ROI', 'Business', 'Training'],
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop'
    },
    {
        _id: '6',
        title: 'Remote Training in a Post-Pandemic World',
        slug: 'remote-training',
        content: 'How distributed teams are maintaining high safety standards through cloud-based simulation training. The ability to train anywhere, anytime is no longer a luxury but a necessity.',
        author: 'Lisa Chang',
        createdAt: new Date(Date.now() - 604800000).toISOString(),
        tags: ['Remote Work', 'Cloud', 'SaaS'],
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop'
    }
];
