import React from 'react';
import Header from '../header';
import Footer from '../footer';
import ContactForm from './contact_form';
import styles from './home.module.css';
import { Container } from '@mui/material';
import { Box } from '@mui/material';
import NewsComponent from './news';
import LeavePhoneComponent from './leave_phone_form';


const Home = () => {
  return (
    <>
      <Header />
      <Box display={'flex'} flexDirection={'column'} justifyContent={'space-evenly'} padding={'3%'} gap={'4rem'}>
        <Container maxWidth="xl" fixed>
          <ContactForm />
        </Container>

        <Container maxWidth="xl" fixed>
          <NewsComponent />
        </Container>

        <Container maxWidth="xl" fixed>
          <LeavePhoneComponent />
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Home;
