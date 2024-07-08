import React from 'react';

function Footer() {
  return (
    <footer className="text-sky-600 font-semibold p-4 mt-auto">
    <div className="container mx-auto text-center">
      &copy; {new Date().getFullYear()} VoteIt. All rights reserved.
    </div>
  </footer>
  
  );
}

export default Footer;
