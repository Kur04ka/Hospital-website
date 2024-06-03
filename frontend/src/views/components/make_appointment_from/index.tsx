import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import SpecialitySelector from './specialitySelector'
import DoctorSelector from './doctorSelector'
import React from 'react';
import DoctorScheduleDatePicker from './scheduleDatePicker'
import { useState } from 'react';
import { instance } from '../../../utils/axios';

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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Запись на прием к врачу</DialogTitle>
                <DialogContent>
                    <SpecialitySelector onSpecialityChange={setSelectedSpeciality} />
                    <DoctorSelector speciality={selectedSpeciality} onDoctorChange={setSelectedDoctor} />
                    {selectedDoctor && <DoctorScheduleDatePicker doctorName={selectedDoctor} onAppointmentSelect={handleAppointmentSelect} />}
                </DialogContent>
                <Button onClick={handleSubmit} disabled={!selectedAppointmentId}>Записаться</Button>
            </Dialog>
        </>
    )
}

export default MakeAppointmentForm;