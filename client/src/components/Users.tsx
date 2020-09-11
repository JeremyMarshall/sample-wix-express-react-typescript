import React from 'react';
import useUserService from '../services/useUserService';

const Users: React.FC<{}> = () => {
  const service = useUserService();

  return (
    <div>
      {service.status === 'loading' && <div>Loading...</div>}
      {service.status === 'loaded' &&
        // console.log(service.payload) &&
        service.payload.results.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      {service.status === 'error' && (
        <div>Error, the backend moved to the dark side.</div>
      )}
    </div>
  );
};

export default Users;