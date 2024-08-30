import { CiMicrophoneOn } from 'react-icons/ci';

export const Brand = ({ local }: { local?: 'navbar' | 'login' }) => {
  const obj = {
    navbar: 'flex items-center w-full text-3xl font-bold text-[#00df9a]',
    login:
      'flex items-center mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-800',
  };

  return (
    <h1 className={obj[local ?? 'navbar']}>
      Node Cast <CiMicrophoneOn size={32} />
    </h1>
  );
};

export default Brand;
