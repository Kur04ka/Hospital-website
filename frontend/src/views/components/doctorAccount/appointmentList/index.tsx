import React from 'react';
import { Box } from '@mui/material';
import AppointmentItem from '../appointmentItem';
import EmptyAppointment from '../emptyAppointments';

interface AppointmentListProps {
    appointments: any[];
    selectedType: 'unmarked' | 'marked';
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, selectedType }: AppointmentListProps) => {
    const hasAppointments = appointments.length > 0;

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
            {selectedType === 'unmarked' ? (
                hasAppointments ? (
                    appointments.map((appointment) => (
                        <AppointmentItem key={appointment.appointment_id} appointment={appointment} />
                    ))
                ) : (
                    <EmptyAppointment />
                )
            ) : (
                hasAppointments ? (
                    appointments.map((appointment) => (
                        <AppointmentItem key={appointment.appointment_id} appointment={appointment} isMarked />
                    ))
                ) : (
                    <EmptyAppointment />
                )
            )}
        </Box>
    );
};

export default AppointmentList;