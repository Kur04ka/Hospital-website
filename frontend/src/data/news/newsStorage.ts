import axios from 'axios'
import { create } from 'zustand'
import { instance } from '../../utils/axios';

interface News {
    id: number;
    title: string;
    short_body: string;
    full_body: string;
    publication_date: string;
}
interface NewsStorage {
    news: News[];
    fetchNews: () => void;
}

export const useNewsStorage = create<NewsStorage>((set) => ({
    news: [],
    fetchNews: async () => {
        try {     
            const response = await instance.get<News[]>('/news/all-news');
            set({ news: response.data });
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    },
}));