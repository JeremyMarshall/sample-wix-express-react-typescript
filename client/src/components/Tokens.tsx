import React from 'react';
import useTokenService from '../services/useTokenService';

const Tokens: React.FC<{}> = () => {
  const service = useTokenService();

  return (
    <div>
      {service.status === 'loading' && <div>Loading...</div>}
      {service.status === 'loaded' &&
        service.payload.payload.map(token => (
        <div>
          { token.instanceId }
            { token.appDefId}
          { token.signDate}
          { token.uid}
          { token.permissions}
          { token.demoMode}
          { token.siteOwnerId}
            { token.siteMemberId}
          { token.expirationDate}
          { token.loginAccountId}
          </div>
        ))}
      {service.status === 'error' && (
        <div>Error, the backend moved to the dark side.</div>
      )}
    </div>
  );
};

export default Tokens;