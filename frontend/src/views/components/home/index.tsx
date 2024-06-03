import React from 'react';
import Header from '../header';
import Footer from '../footer';
import ContactForm from './contact_form';
import styles from './home.module.css';
import { Container } from '@mui/material';
import NewsComponent from './news';
import LeavePhoneComponent from './leave_phone_form';


const Home = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Container maxWidth="xl" fixed>  
          <ContactForm />
        </Container>

        <Container maxWidth="xl" fixed>  
          <NewsComponent />
        </Container>

        <Container maxWidth="xl" fixed>  
          <LeavePhoneComponent />
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default Home;
