import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { openAuthModal } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
        openAuthModal('register');
    }, [navigate, openAuthModal]);

    return null;
};

export default Register;
