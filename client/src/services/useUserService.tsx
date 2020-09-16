import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { IUser } from '../types/IUser';
import axios from 'axios';

export interface IUsers {
  payload: IUser[];
}

type UsersService = Service<IUsers>;

const useUserService = () => {
  const [result, setResult] = useState<UsersService>({
    status: 'loading'
  });

  useEffect(() => {
    axios.get<IUsers>('/api/users/all')
      .then(response => {
        setResult({ status: 'loaded', payload: { payload: response.data.payload }  });
      })
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default useUserService;