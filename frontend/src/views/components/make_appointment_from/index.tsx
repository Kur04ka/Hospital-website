import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import SpecialitySelector from './specialitySelector'
import DoctorSelector from './doctorSelector'
import React from 'react';
import DoctorScheduleDatePicker from './scheduleDatePicker'
import { useState } from 'react';
import { instance } from '../../../utils/axios';
import styles from './form.module.css'

interface MakeAppointmentFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MakeAppointmentForm: React.FC<MakeAppointmentFormProps> = ({ open, setOpen }) => {
    const [selectedSpeciality, setSelectedSpeciality] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

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
                const response = await instance.post(
                    `/appointments/create-new-appointment/${selectedAppointmentId}`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        }
                    }
                );
                console.log('Appointment created successfully:', response.data);
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