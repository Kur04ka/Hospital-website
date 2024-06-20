import { create } from 'zustand';
import { instance } from '../../utils/axios';

interface Appointment {
    appointment_id: number;
    doctor_name: string;
    begins_at: string;
    ends_at: string;
}

interface AppointmentStore {
    currentAppointments: Appointment[];
    archiveAppointments: Appointment[];
    fetchCurrentAppointments: () => void;
    fetchArchiveAppointments: () => void;
    updateCurrentAppointment: (old_appointment_id: number, new_appointment_id: number) => void;
    removeCurrentAppointment: (appointment_id: number) => void;
    createAppointment: (appointment_id: number) => void
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    currentAppointments: [],
    archiveAppointments: [],

    createAppointment: async (appointment_id: number) => {
        try {
            const response = await instance.post<Appointment>(`/appointments/create-new-appointment/${appointment_id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
    
            const { currentAppointments } = get();
    
            set({
                currentAppointments: [response.data, ...currentAppointments]
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
                `/appointments/patch-appointment?old_id=${old_appointment_id}&new_id=${new_appointment_id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                }
            );
            const { currentAppointments } = get();
            set({
                currentAppointments: currentAppointments.map((appointment) =>
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
            set({
                currentAppointments: currentAppointments.filter((appointment) => appointment.appointment_id !== appointment_id),
            });
        } catch (error) {
            console.error('Error removing appointment:', error);
        }
    },
}));