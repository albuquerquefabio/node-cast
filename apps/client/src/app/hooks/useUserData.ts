import { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../interfaces/IUser';

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const { getUserData } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const data = await getUserData<User>();
          setUser(data);
          return;
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('authToken');
          setUser(null);
          navigate('/login');
          throw new Error('Error fetching user data.');
        }
      }
      navigate('/login');
    };

    fetchUserData();
  }, [getUserData, navigate]);

  return user;
};
