import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

api.interceptors.request.use(async config => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        console.error('User is not authenticated');
        return config;
    }
        
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
    return config;
});

export default api;