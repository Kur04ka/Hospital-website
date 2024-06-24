import { create } from 'zustand';
import { instance } from '../../utils/axios';

//TODO:  doctor store

interface Doctor {
    email: string;
    name: string;
    surname: string;
    sex: string;
    birth_date: string;
    phone_number: string;
    created_at: string;
}

interface DoctorStore {
    doctor: Doctor;
    fetchDoctor: () => void;
}

export const useDoctorStore = create<DoctorStore>((set) => ({
    doctor: {
        email: '',
        name: '',
        surname: '',
        sex: '',
        birth_date: '',
        phone_number: '',
        created_at: '',
    },
    fetchDoctor: async () => {
        try {
            const response = await instance.get<Doctor>('/user/user-details', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('jwt')
                }
            })
            set({ doctor: response.data });
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    },
}));