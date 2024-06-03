import React from 'react';
import Header from '../header';
import { Button } from '@mui/material';
import { instance } from '../../../utils/axios';

const handleSubmit = async (e: { preventDefault: () => void }) => {
  e.preventDefault()

  try {

    const response = await instance.get('user/user-details', { headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt')
    }})
    
    console.log(response.data)

  } catch (e) {

    return e

  }
}

const PersonalAccount = () => {
  return (
    <div className="App">
      <Header />
      <Button type='submit' fullWidth onClick={handleSubmit} variant="contained">Войти</Button>
    </div>
  );
}

export default PersonalAccount;