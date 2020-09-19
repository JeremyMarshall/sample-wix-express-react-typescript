import { useEffect, useState } from 'react';
import { Service } from '../types/Service';
import { Token } from '../schema';
import API from '../utils/API';

export interface ITokens {
  payload: Token[];
}

type TokensService = Service<ITokens>;

const useTokenService = () => {
  const [result, setResult] = useState<TokensService>({
    status: 'loading'
  });

  useEffect(() => {
    API.axiosClient.get<ITokens>('wix/payload/instance')
      .then(response => {
        setResult({ status: 'loaded', payload: { payload: response.data.payload }  });
      })
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return result;
};

export default useTokenService;