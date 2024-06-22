import React from 'react';
import { Box } from '@mui/material';
import AppointmentItem from '../appointmentItem';
import EmptyAppointment from '../emptyAppointment';

interface AppointmentListProps {
    appointments: any[];
    selectedType: 'current' | 'archive';
    handleEditClick?: (appointmentId: number, doctorName: string) => void;
    handleDeleteClick?: (appointmentId: number) => void;
    handleMakeAppointmentFormClick: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, selectedType, handleEditClick, handleDeleteClick, handleMakeAppointmentFormClick }: AppointmentListProps) => {
    const hasAppointments = appointments.length > 0;

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
            {selectedType === 'current' ? (
                hasAppointments ? (
                    appointments.map((appointment) => (
                        <AppointmentItem
                            key={appointment.appointment_id}
                            appointment={appointment}
                            handleEditClick={handleEditClick}
                            handleDeleteClick={handleDeleteClick}
                        />
                    ))
                ) : (
                    <EmptyAppointment handleMakeAppointmentFormClick={handleMakeAppointmentFormClick} />
                )
            ) : (
                hasAppointments ? (
                    appointments.map((appointment) => (
                        <AppointmentItem key={appointment.appointment_id} appointment={appointment} isArchive />
                    ))
                ) : (
                    <EmptyAppointment handleMakeAppointmentFormClick={handleMakeAppointmentFormClick}/>
                )
            )}
        </Box>
    );
};

export default AppointmentList;