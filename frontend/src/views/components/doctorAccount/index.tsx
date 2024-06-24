import React, { useEffect, useState } from 'react'
import { useAppointmentStore } from '../../../data/appointment/appointmentStore';
import { Box } from '@mui/material';
import AppointmentControls from './appointmentControls';
import AppointmentList from './appointmentList';
import Header from '../header';
import Footer from '../footer';

const DoctorAccount = () => {
    const { doctorUnmarkedAppointments,
        doctorMarkedAppointments,
        fetchDoctorUnmarkedAppointments,
        fetchDoctorMarkedAppointments } = useAppointmentStore()

    const [selectedType, setSelectedType] = useState<'unmarked' | 'marked'>('unmarked');

    const appointments = selectedType === 'unmarked' ? doctorUnmarkedAppointments || [] : doctorMarkedAppointments || []

    useEffect(() => {
        const fetchData = async () => {
            if (selectedType === 'unmarked') {
                await fetchDoctorUnmarkedAppointments();
            } else {
                await fetchDoctorMarkedAppointments();
            }
        };
        fetchData();
    }, [selectedType, fetchDoctorUnmarkedAppointments, fetchDoctorMarkedAppointments])

    const handleSelectedTypeChanged = (e: any) => {
        setSelectedType(e.target.value as 'unmarked' | 'marked')
    }

    return (
        <>
            <Header />
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} padding={'5rem'} gap={'3rem'}>
                <Box display={'flex'} flexDirection={'column'} gap={'2rem'} padding={'3rem'} border={'3px solid rgba(238, 243, 248, 1)'} sx={{ borderRadius: '3rem' }}>
                    <AppointmentControls
                        selectedType={selectedType}
                        handleChange={handleSelectedTypeChanged}
                    />
                    <AppointmentList
                        appointments={appointments}
                        selectedType={selectedType}
                    />
                </Box>
            </Box>
            <Footer />
        </>
    )
}

export default DoctorAccount;