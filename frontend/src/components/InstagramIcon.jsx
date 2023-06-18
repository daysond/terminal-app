import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const InstagramIcon = () => {
    const profileUrl = 'https://instagram.com/seneca.engineers?igshid=NTc4MTIwNjQ2YQ=='
  return (
    <Link to={profileUrl} target="_blank" rel="noopener noreferrer">
      <FaInstagram className='footer-icon' size={24} color="#f8f8f8" />
    </Link>
  );
};

export default InstagramIcon;