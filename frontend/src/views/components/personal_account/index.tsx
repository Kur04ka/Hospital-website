import React from 'react';
import Header from '../header';
import Footer from '../footer';
import { Box } from '@mui/material';
import UserInformation from './user_info'
import { Button } from '@mui/material';
import { instance } from '../../../utils/axios';


const PersonalAccount = () => {
  return (
    <>
      {/* <Header/> */}
      <Box display={'flex'} flexDirection={'column'} padding={'5rem'}>
        <UserInformation />
      </Box>
      {/* <Footer /> */}
    </>
  );
}

export default PersonalAccount;