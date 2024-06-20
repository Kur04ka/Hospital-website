import React, { useState } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import { Typography, Button, Box, DialogTitle } from '@mui/material';
import styles from './form.module.css'
import DoctorSelector from './doctorSelector'
import SpecialitySelector from './specialitySelector'
import DoctorScheduleDatePicker from './scheduleDatePicker'
import { useAppointmentStore } from '../../../data/appointment/appointmentStore';

interface MakeAppointmentFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MakeAppointmentForm: React.FC<MakeAppointmentFormProps> = ({ open, setOpen }) => {
    const [selectedSpeciality, setSelectedSpeciality] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

    const { createAppointment } = useAppointmentStore();

    const handleAppointmentSelect = (appointmentId: number) => {
        setSelectedAppointmentId(appointmentId);
    };

    const handleClose = () => {
        setSelectedSpeciality('');
        setSelectedDoctor('');
        setSelectedAppointmentId(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (selectedAppointmentId !== null) {
            try {
                createAppointment(selectedAppointmentId)
                handleClose();
            } catch (error) {
                console.error('Error creating appointment:', error);
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} PaperProps={{ style: { borderRadius: '3rem', padding: '2.5rem' } }}>
                <DialogTitle className={styles.title}>
                    <Typography variant="h4" gutterBottom className={styles.typography}>Записаться на прием</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box display={'flex'} flexDirection={'column'} gap={'2rem'}>
                        <SpecialitySelector onSpecialityChange={setSelectedSpeciality} />
                        <DoctorSelector speciality={selectedSpeciality} onDoctorChange={setSelectedDoctor} />
                        {selectedDoctor && <DoctorScheduleDatePicker doctorName={selectedDoctor} onAppointmentSelect={handleAppointmentSelect} />}

                        <Button type='submit' className={styles.button} fullWidth onClick={handleSubmit} disabled={!selectedAppointmentId} variant="contained">Записаться</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MakeAppointmentForm;