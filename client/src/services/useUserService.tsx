import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { IUser } from '../types/IUser';

export interface IUsers {
  results: IUser[];
}

const useUserService = () => {
  const [result, setResult] = useState<Service<IUsers>>({
    status: 'loading'
  });

  useEffect(() => {
    fetch('/api/users/all')
      .then(response=> response.json())
      .then(response => setResult({ status: 'loaded', payload: {results: response.users }}))
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default useUserService;