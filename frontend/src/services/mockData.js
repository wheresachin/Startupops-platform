export const mockData = {
    startup: {
        name: "Nebula AI",
        stage: "MVP",
        problem: "Inefficient data processing for SMBs",
        solution: "AI-powered automated workflows",
        market: "$50B Global Market",
        progress: 65,
    },
    kpi: {
        totalTasks: 24,
        completedTasks: 16,
        pendingFeedback: 5,
        milestones: { total: 4, completed: 2 },
    },
    tasks: [
        { id: 1, title: 'Design Landing Page', status: 'In Progress', assignee: 'Alex', priority: 'High' },
        { id: 2, title: 'Integrate Stripe API', status: 'Todo', assignee: 'Sam', priority: 'High' },
        { id: 3, title: 'User Interview Script', status: 'Done', assignee: 'Jordan', priority: 'Medium' },
        { id: 4, title: 'Setup Analytics', status: 'Todo', assignee: 'Alex', priority: 'Low' },
    ],
    feedback: [
        { id: 1, user: 'BetaUser_01', rating: 4, comment: 'Great UI, but load time is slow.', status: 'New' },
        { id: 2, user: 'Investor_Dave', rating: 5, comment: 'Solid value prop. Pitch deck needs work.', status: 'Reviewed' },
        { id: 3, user: 'EarlyAdopter', rating: 3, comment: 'Missing dark mode.', status: 'New' },
    ],
    analytics: [
        { name: 'Mon', tasks: 2, feedback: 1 },
        { name: 'Tue', tasks: 3, feedback: 0 },
        { name: 'Wed', tasks: 5, feedback: 2 },
        { name: 'Thu', tasks: 4, feedback: 1 },
        { name: 'Fri', tasks: 6, feedback: 3 },
        { name: 'Sat', tasks: 3, feedback: 1 },
        { name: 'Sun', tasks: 1, feedback: 0 },
    ],
    team: [
        { id: 1, name: 'Alex Founder', role: 'CEO', avatar: 'AF' },
        { id: 2, name: 'Sam Tech', role: 'CTO', avatar: 'ST' },
        { id: 3, name: 'Jordan Design', role: 'Product', avatar: 'JD' },
    ]
};

const loadFeedback = () => {
    const saved = localStorage.getItem('feedback');
    return saved ? JSON.parse(saved) : mockData.feedback;
};

export const getStartupDetails = () => Promise.resolve(mockData.startup);
export const getKPIs = () => Promise.resolve(mockData.kpi);
export const getTasks = () => Promise.resolve(mockData.tasks);
export const getFeedback = () => Promise.resolve(loadFeedback());
export const getAnalytics = () => Promise.resolve(mockData.analytics);
export const getTeam = () => Promise.resolve(mockData.team);

export const addFeedback = (newFeedback) => {
    const feedback = loadFeedback();
    const feedbackItem = {
        id: Date.now(),
        ...newFeedback,
        status: 'New',
        date: new Date().toISOString()
    };
    const updatedFeedback = [feedbackItem, ...feedback];
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    return Promise.resolve(feedbackItem);
};

export const deleteFeedback = (id) => {
    const feedback = loadFeedback();
    const updatedFeedback = feedback.filter(item => item.id !== id);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    return Promise.resolve(true);
};

export const markFeedbackReviewed = (id) => {
    const feedback = loadFeedback();
    const updatedFeedback = feedback.map(item =>
        item.id === id ? { ...item, status: 'Reviewed' } : item
    );
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    return Promise.resolve(true);
};
