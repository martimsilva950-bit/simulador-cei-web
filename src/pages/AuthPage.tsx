import { FormEvent, useState } from 'react';
import { Lock, Mail, UserRound } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register';
  loading: boolean;
  notice: string;
  onSubmit?: (email: string, password: string) => void;
  onSubmitRegister?: (nome: string, email: string, password: string) => void;
  onSwitch: () => void;
}

export function AuthPage({ mode, loading, notice, onSubmit, onSubmitRegister, onSwitch }: AuthPageProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (mode === 'register') {
      onSubmitRegister?.(nome, email, password);
      return;
    }
    onSubmit?.(email, password);
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="auth-icon">{mode === 'login' ? <Lock size={24} /> : <UserRound size={24} />}</span>
        <h1>{mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta de cliente'}</h1>
        <p>{mode === 'login' ? 'Entra para aceder ao simulador técnico.' : 'Todos os novos registos entram como clientes.'}</p>

        {mode === 'register' && (
          <label>
            Nome
            <span className="input-wrap"><UserRound size={18} /><input value={nome} onChange={(event) => setNome(event.target.value)} required /></span>
          </label>
        )}

        <label>
          Endereço de email
          <span className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></span>
        </label>

        <label>
          Password
          <span className="input-wrap"><Lock size={18} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /></span>
        </label>

        {notice && <div className="notice">{notice}</div>}

        <button className="primary full" type="submit" disabled={loading}>
          {loading ? 'A processar...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button className="link-button" type="button" onClick={onSwitch}>
          {mode === 'login' ? 'Não tem conta? Crie agora' : 'Já tem conta? Entrar'}
        </button>
      </form>
    </main>
  );
}
