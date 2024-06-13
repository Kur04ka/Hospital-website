import { create } from 'zustand';
import { instance } from '../../utils/axios';

// Определяем интерфейс пользователя
interface User {
    email: string;
    name: string;
    surname: string;
    sex: string;
    birth_date: string;
    phone_number: string;
    created_at: string;
}

// Определяем интерфейс для хранилища Zustand
interface UserStore {
    user: User;
    fetchUser: () => void;
}

// Создаем хранилище Zustand
export const useUserStore = create<UserStore>((set) => ({
    user: {
        email: '',
        name: '',
        surname: '',
        sex: '',
        birth_date: '',
        phone_number: '',
        created_at: '',
    },
    fetchUser: async () => {
        try {
            const response = await instance.get<User>('/user/user-details', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('jwt')
                }
            })
            set({ user: response.data });
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    },
}));