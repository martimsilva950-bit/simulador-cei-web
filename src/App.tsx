import { useEffect, useState } from 'react';
import { CheckCircle2, Gauge, LogOut, Menu, ShieldCheck, UserRound, X } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { demoProfiles } from './lib/demoData';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { Profile, Role } from './types';
import './styles.css';

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'simulador';

function pageFromPath(): Page {
  const path = window.location.pathname;
  if (path === '/login') return 'login';
  if (path === '/register') return 'register';
  if (path === '/simulador') return 'simulador';
  if (path === '/cliente' || path === '/admin') return 'dashboard';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromPath);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = Boolean(profile);
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    async function loadSession() {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      await loadProfile(data.user.id, data.user.email || '', data.user.user_metadata?.nome);
    }

    loadSession();
  }, []);

  function navigate(nextPage: Page) {
    const paths: Record<Page, string> = {
      home: '/',
      login: '/login',
      register: '/register',
      dashboard: isAdmin ? '/admin' : '/cliente',
      simulador: '/simulador',
    };

    window.history.pushState({}, '', paths[nextPage]);
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function loadProfile(userId: string, email: string, nome?: string) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    let profileData = data;

    if (error || !profileData) {
      const fallbackProfile = {
        id: userId,
        nome: nome || email.split('@')[0] || 'Cliente',
        email,
        role: 'cliente',
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(fallbackProfile)
        .select()
        .single();

      if (createError || !createdProfile) {
        setNotice(`Login feito, mas não foi possível carregar o perfil: ${createError?.message || error?.message || 'erro desconhecido'}`);
        return null;
      }

      profileData = createdProfile;
    }

    const nextProfile: Profile = {
      id: profileData.id,
      nome: profileData.nome || email,
      email,
      role: profileData.role,
    };

    setProfile(nextProfile);
    setPage('dashboard');
    window.history.replaceState({}, '', nextProfile.role === 'admin' ? '/admin' : '/cliente');
    return nextProfile;
  }

  async function handleLogin(email: string, password: string) {
    setLoading(true);
    setNotice('');

    if (!isSupabaseConfigured || !supabase) {
      const demoProfile = demoProfiles[email.toLowerCase()] || {
        id: 'cliente-local',
        nome: email.split('@')[0] || 'Cliente',
        email,
        role: email.toLowerCase() === 'admin@cei.com' ? 'admin' : 'cliente',
      };
      setProfile(demoProfile);
      setLoading(false);
      navigate('dashboard');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setNotice(`Não foi possível entrar: ${error?.message || 'confirma o email e a password.'}`);
      setLoading(false);
      return;
    }

    await loadProfile(data.user.id, data.user.email || email, data.user.user_metadata?.nome);
    setLoading(false);
  }

  async function handleRegister(nome: string, email: string, password: string) {
    setLoading(true);
    setNotice('');

    if (!isSupabaseConfigured || !supabase) {
      const demoProfile: Profile = {
        id: crypto.randomUUID(),
        nome,
        email,
        role: 'cliente',
      };
      setProfile(demoProfile);
      setLoading(false);
      navigate('dashboard');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
      },
    });
    if (error || !data.user) {
      setNotice(`Não foi possível criar a conta: ${error?.message || 'tenta novamente.'}`);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setNotice('Conta criada. Confirma o email antes de entrar.');
      setLoading(false);
      return;
    }

    await loadProfile(data.user.id, data.user.email || email, nome);
    setLoading(false);
    navigate('dashboard');
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setProfile(null);
    navigate('home');
  }

  const roleLabel = profile?.role === 'admin' ? 'Administrador' : 'Cliente';

  return (
    <div>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate(isLoggedIn ? 'dashboard' : 'home')}>
          <span className="brand-mark"><Gauge size={22} /></span>
          <span>
            <strong>CEI</strong>
            <small>Simulador Técnico</small>
          </span>
        </button>

        <button className="mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {isLoggedIn ? (
            <>
              <button type="button" onClick={() => navigate('dashboard')}>Painel</button>
              <button type="button" onClick={() => navigate('simulador')}>Simulador</button>
              <span className="role-pill">{isAdmin ? <ShieldCheck size={16} /> : <UserRound size={16} />}{roleLabel}</span>
              <button className="ghost danger" type="button" onClick={logout}><LogOut size={17} /> Sair</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => navigate('home')}>Início</button>
              <button type="button" onClick={() => navigate('login')}>Login</button>
              <button className="primary small" type="button" onClick={() => navigate('register')}>Criar conta</button>
            </>
          )}
        </nav>
      </header>

      {!isSupabaseConfigured && (
        <div className="demo-banner">
          <CheckCircle2 size={17} />
          Modo demonstração ativo. Liga o Supabase quando quiseres guardar utilizadores online.
        </div>
      )}

      {page === 'home' && <LandingPage onLogin={() => navigate('login')} onRegister={() => navigate('register')} />}
      {page === 'login' && <AuthPage mode="login" loading={loading} notice={notice} onSubmit={handleLogin} onSwitch={() => navigate('register')} />}
      {page === 'register' && <AuthPage mode="register" loading={loading} notice={notice} onSubmitRegister={handleRegister} onSwitch={() => navigate('login')} />}
      {page === 'dashboard' && profile && <DashboardPage profile={profile} onOpenSimulator={() => navigate('simulador')} />}
      {page === 'simulador' && profile && <SimulatorPage role={profile.role as Role} />}
    </div>
  );
}
