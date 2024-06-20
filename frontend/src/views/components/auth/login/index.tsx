import React, { useState } from 'react';
import { TextField, Button, Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import styles from "./login.module.css"
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../header';
import { instance } from '../../../../utils/axios';
import WomanWithHeart from "../../shared/womanWithHeart"

const LoginPage: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    try {

      const userData = {
        email,
        password,
      }
      const response = await instance.post('auth/sign-in', userData)
      const token = response.data

      localStorage.setItem('jwt', token)
      
      navigate('/')

    } catch (e) {
      return e
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <WomanWithHeart />
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <Typography variant="h3" component={"span"} sx={{ marginBottom: 4, textAlign: 'center' }}>Вход</Typography>

          <TextField onChange={(e) => setEmail(e.target.value)} fullWidth InputProps={{ sx: { borderRadius: "1.5rem" } }} required type='email' label="Email" placeholder="Введите ваш email" />
          <TextField onChange={(e) => setPassword(e.target.value)} fullWidth InputProps={{ sx: { borderRadius: "1.5rem" } }} required type='password' label="Пароль" placeholder="Введите ваш пароль" />

          <FormControlLabel control={<Checkbox name="checkbox" />} label={<Box>Запомнить меня</Box>} />

          <Button type='submit' className={styles.button} fullWidth variant="contained">Войти</Button>
          <Link className={styles.link} to={'/register'}>Нет аккаунта? Зарегистрироваться</Link>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;