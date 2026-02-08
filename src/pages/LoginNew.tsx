import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { login } from '../store/slices/authSlice';
import { loginSchema } from '../schemas/validationSchemas';
import type { RootState } from '../store/store';
import './Login.css';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const from = (location.state as any)?.from || '/admin/dashboard';

  const onSubmit = async (data: LoginForm) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success('Connexion réussie !');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Identifiants incorrects');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Nador Explorer</h1>
          <p>Espace Administrateur</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              {...register('username')}
            />
          </div>
          {errors.username && <span className="error-text">{errors.username.message}</span>}
          
          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Mot de passe"
              {...register('password')}
            />
          </div>
          {errors.password && <span className="error-text">{errors.password.message}</span>}
          
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p style={{marginTop: '1rem', fontSize: '0.875rem', color: '#666'}}>
          {/* Test: emilys / emilyspass */}
        </p>
      </div>
    </div>
  );
}
