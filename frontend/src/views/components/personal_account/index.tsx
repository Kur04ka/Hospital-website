import React from 'react';
import Header from '../header';
import Footer from '../footer';
import { Box } from '@mui/material';
import UserInformation from './user_info'
import AppointmentSection from './appointment_section'


const PersonalAccount = () => {
  return (
    <>
      <Header/>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} padding={'5rem'} gap={'3rem'}>
        <UserInformation />
        <AppointmentSection />
      </Box>
      <Footer />
    </>
  );
}

export default PersonalAccount;