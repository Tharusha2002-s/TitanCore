import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { openAuthModal } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
        openAuthModal('login');
    }, [navigate, openAuthModal]);

    return null;
};

export default Login;
