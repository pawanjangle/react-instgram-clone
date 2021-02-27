import React from "react";
import Ticker from 'react-ticker'
const dummy = () => {
  return (
    <div>
      <Ticker mode="smooth" speed="8">
        {({ index }) => (
          <>
            <h6 className="text-danger">This website is created only for developement purpose. Dummy login Credentials are email: pawan@gmail.com, password: 123456</h6>
          </>
        )}
      </Ticker>
    </div>
  );
};

export default dummy;
