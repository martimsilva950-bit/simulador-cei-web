import { Calculator, UserRound } from 'lucide-react';
import { Profile } from '../types';

interface DashboardPageProps {
  profile: Profile;
  onOpenSimulator: () => void;
}

export function DashboardPage({ profile, onOpenSimulator }: DashboardPageProps) {
  return (
    <main className="page">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">{profile.role === 'admin' ? 'Painel Industrial' : 'Área de Cliente'}</span>
          <h1>{profile.role === 'admin' ? 'Controlo Técnico Global CEI' : 'Simulador CEI - Cliente'}</h1>
          <p>{profile.nome}</p>
        </div>
        <span className="profile-badge"><UserRound size={18} /> {profile.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
      </section>

      <section className="summary-grid">
        <button className="summary-card" type="button" onClick={onOpenSimulator}>
          <Calculator size={28} />
          <strong>Simulador Técnico</strong>
          <span>StoneCut Pro e Master · corte, rotação e água</span>
        </button>
      </section>
    </main>
  );
}
