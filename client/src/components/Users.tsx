import React from 'react';
import useUserService from '../services/useUserService';

const Users: React.FC<{}> = () => {
  const service = useUserService();

  return (
    <div>
      {service.status === 'loading' && <div>Loading...</div>}
      {service.status === 'loaded' &&
        service.payload.payload.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      {service.status === 'error' && (
        <div>Error, the backend moved to the dark side.</div>
      )}
    </div>
  );
};

export default Users;