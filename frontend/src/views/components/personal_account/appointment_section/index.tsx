import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import EditDialog from './dialogs/editDialog';
import ConfirmationDialog from './dialogs/confirmationDialog';
import MakeAppointmentForm from '../../make_appointment_form';
import AppointmentControls from './appointments/appointmentControls';
import AppointmentList from './appointments/appointmentList';
import { useAppointmentStore } from '../../../../data/appointment/appointmentStore';

const AppointmentSection = () => {
    const {
        currentAppointments,
        archiveAppointments,
        fetchCurrentAppointments,
        fetchArchiveAppointments,
    } = useAppointmentStore();

    const [selectedType, setSelectedType] = useState<'current' | 'archive'>('current');
    const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [isMakeAppointmentOpen, setMakeAppointmentOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number>(0);
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            if (selectedType === 'current') {
                await fetchCurrentAppointments();
            } else {
                await fetchArchiveAppointments();
            }
        };
        fetchData();
    }, [selectedType, fetchCurrentAppointments, fetchArchiveAppointments]);


    const handleDeleteClick = (appointmentId: number) => {
        setSelectedAppointmentId(appointmentId);
        setConfirmationDialogOpen(true);
    };

    const handleEditClick = (appointmentId: number, doctorName: string) => {
        setSelectedAppointmentId(appointmentId);
        setSelectedDoctor(doctorName);
        setEditDialogOpen(true);
    };

    const handleMakeAppointmentFormClick = () => {
        setMakeAppointmentOpen(true);
    };

    const handleChange = (event: any) => {
        setSelectedType(event.target.value as 'current' | 'archive');
    };

    const appointments = selectedType === 'current' ? currentAppointments || [] : archiveAppointments || [];

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'2rem'} padding={'3rem'} border={'3px solid rgba(238, 243, 248, 1)'} sx={{ borderRadius: '3rem' }}>
            <AppointmentControls
                selectedType={selectedType}
                handleChange={handleChange}
                handleMakeAppointmentFormClick={handleMakeAppointmentFormClick}
            />
            <AppointmentList
                appointments={appointments}
                selectedType={selectedType}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                handleMakeAppointmentFormClick={handleMakeAppointmentFormClick}
            />
            <ConfirmationDialog open={isConfirmationDialogOpen} setOpen={setConfirmationDialogOpen} appointmentId={selectedAppointmentId} />
            <EditDialog open={isEditDialogOpen} setOpen={setEditDialogOpen} old_appointmentId={selectedAppointmentId} doctorName={selectedDoctor} />
            <MakeAppointmentForm open={isMakeAppointmentOpen} setOpen={setMakeAppointmentOpen} />
        </Box>
    );
};

export default AppointmentSection;