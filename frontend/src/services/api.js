import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getTasks = async () => {
    const { data } = await api.get('/tasks');
    return data;
};

export const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data;
};

export const updateTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
};

export const deleteTask = async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
};

export const getKPIs = async () => {
    try {
        const { data } = await api.get('/analytics/overview');
        // Map backend response to frontend expectation
        return {
            totalTasks: data.tasks.total,
            completedTasks: data.tasks.completed,
            pendingFeedback: data.feedback ? data.feedback.total : 0,
            milestones: {
                total: data.milestones.total,
                completed: data.milestones.completed
            }
        };
    } catch (error) {
        console.error("Failed to fetch KPIs:", error);
        // Fallback or rethrow depending on how we want to handle it
        return {
            totalTasks: 0,
            completedTasks: 0,
            pendingFeedback: 0,
            milestones: { total: 0, completed: 0 }
        };
    }
};

export default api;
