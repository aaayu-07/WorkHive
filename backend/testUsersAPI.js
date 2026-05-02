import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const login = async () => {
  const { data } = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'ayushraj8005@gmail.com',
    password: 'Password123!' // Wait, I don't know the password
  });
  return data.token;
};
