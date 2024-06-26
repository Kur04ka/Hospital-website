import { create } from 'zustand';
import { instance } from '../../utils/axios';

export interface Appointment {
    appointment_id: number;
    patient_name: string;
    doctor_name: string;
    begins_at: string;
    ends_at: string;
    status: string;
}

// TODO: добавить фильтрацию при добавлении записей

interface AppointmentStore {
    currentAppointments: Appointment[];
    archiveAppointments: Appointment[];
    fetchCurrentAppointments: () => Promise<void>;
    fetchArchiveAppointments: () => Promise<void>;
    updateCurrentAppointment: (old_appointment_id: number, new_appointment_id: number) => Promise<void>;
    removeCurrentAppointment: (appointment_id: number) => Promise<void>;
    createAppointment: (appointment_id: number) => Promise<void>;

    doctorUnmarkedAppointments: Appointment[];
    doctorMarkedAppointments: Appointment[];
    fetchDoctorUnmarkedAppointments: () => Promise<void>;
    fetchDoctorMarkedAppointments: () => Promise<void>;
    updateUnmarkedAppointment: (id: number, status: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    currentAppointments: [],
    archiveAppointments: [],
    doctorUnmarkedAppointments: [],
    doctorMarkedAppointments: [],

    fetchDoctorUnmarkedAppointments: async () => {
        try {
            const response = await instance.get<Appointment[]>('/appointments/get-unmarked-appointments-by-uuid', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            set({ doctorUnmarkedAppointments: response.data });
        } catch (error) {
            console.error('Error fetching unmarked appointments:', error);
        }
    },

    fetchDoctorMarkedAppointments: async () => {
        try {
            const response = await instance.get<Appointment[]>('/appointments/get-marked-appointments-by-uuid', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            set({ doctorMarkedAppointments: response.data });
        } catch (error) {
            console.error('Error fetching marked appointments:', error);
        }
    },

    updateUnmarkedAppointment: async (id: number, status: string) => {
        try {
            await instance.patch<Appointment>(
                `/appointments/change-appointment-status?id=${id}&status=${status}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                }
            );
            
            const { doctorUnmarkedAppointments } = get();
            const updatedDoctorUnmarkedAppointments = Array.isArray(doctorUnmarkedAppointments) ? doctorUnmarkedAppointments : [];
    
            set({
                doctorUnmarkedAppointments: updatedDoctorUnmarkedAppointments.filter((appointment) => appointment.appointment_id !== id),
            });
        } catch (error) {
            console.error('Error updating appointment status:', error);
        }
    },
    

    createAppointment: async (appointment_id: number) => {
        try {
            const response = await instance.post<Appointment>(`/appointments/create-new-appointment/${appointment_id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });

            const { currentAppointments } = get();
            const updatedCurrentAppointments = Array.isArray(currentAppointments) ? currentAppointments : [];

            set({
                currentAppointments: [response.data, ...updatedCurrentAppointments]
            });
        } catch (error) {
            console.error('Error creating appointment:', error);
        }
    },

    fetchCurrentAppointments: async () => {
        try {
            const response = await instance.get<Appointment[]>('/appointments/current-appointments-by-uuid', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            set({ currentAppointments: response.data });
        } catch (error) {
            console.error('Error fetching current appointments:', error);
        }
    },

    fetchArchiveAppointments: async () => {
        try {
            const response = await instance.get<Appointment[]>('/appointments/archieve-appointments-by-uuid', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            set({ archiveAppointments: response.data });
        } catch (error) {
            console.error('Error fetching archive appointments:', error);
        }
    },

    updateCurrentAppointment: async (old_appointment_id: number, new_appointment_id: number) => {
        try {
            const response = await instance.patch<Appointment>(
                `/appointments/change-appointment?old_id=${old_appointment_id}&new_id=${new_appointment_id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                }
            );
            const { currentAppointments } = get();
            const updatedCurrentAppointments = Array.isArray(currentAppointments) ? currentAppointments : [];
            set({
                currentAppointments: updatedCurrentAppointments.map((appointment) =>
                    appointment.appointment_id === old_appointment_id ? response.data : appointment
                ),
            });
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    },

    removeCurrentAppointment: async (appointment_id: number) => {
        try {
            await instance.delete(`/appointments/delete-appointment/${appointment_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            const { currentAppointments } = get();
            const updatedCurrentAppointments = Array.isArray(currentAppointments) ? currentAppointments : [];
            set({
                currentAppointments: updatedCurrentAppointments.filter((appointment) => appointment.appointment_id !== appointment_id),
            });
        } catch (error) {
            console.error('Error removing appointment:', error);
        }
    },
}));