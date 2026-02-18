import axios from 'axios';
import { API_URL } from '../constants/config';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export const getJourneyPlans = async () => {
    try {
        const response = await api.get('/api/journey-plans');
        return response.data;
    } catch (error) {
        console.log('Error fetching journey plans:', error);
        throw error;
    }
};

export const getCustomers = async () => {
    try {
        const response = await api.get('/api/journey-plans/customers');
        return response.data;
    } catch (error) {
        console.log('Error fetching customers:', error);
        throw error;
    }
};

export const getOptions = async () => {
    try {
        const response = await api.get('/api/journey-plans/options');
        return response.data;
    } catch (error) {
        console.log('Error fetching options:', error);
        throw error;
    }
};

export const login = async (credentials: any) => {
    try {
        const response = await api.post('/api/journey-plans/login', credentials);
        return response.data;
    } catch (error) {
        console.log('Error during login:', error);
        throw error;
    }
};

export const updateCustomerVisit = async (id: string, data: { visited: boolean, salesAmount: number, visitCompleted: boolean }) => {
    try {
        const response = await api.patch(`/api/journey-plans/customers/${id}`, data);
        return response.data;
    } catch (error) {
        console.log('Error updating customer visit:', error);
        throw error;
    }
};

export default api;
