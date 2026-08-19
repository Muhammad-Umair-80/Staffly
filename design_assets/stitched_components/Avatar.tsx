import React from 'react';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt = 'avatar', size = 40 }) => {
  const s = `${size}px`;
  return (
    <img src={src} alt={alt} style={{ width: s, height: s, borderRadius: '9999px' }} className="object-cover" />
  );
};

export default Avatar;
