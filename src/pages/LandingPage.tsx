import { ArrowRight, Calculator, Factory, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">CEI Industrial</span>
          <h1>Simulador técnico para máquinas StoneCut</h1>
          <p>
            Calcule parâmetros de corte e mantenha clientes e equipa técnica com uma experiência simples, rápida e organizada.
          </p>
          <div className="actions">
            <button className="primary" type="button" onClick={onRegister}>Criar conta <ArrowRight size={18} /></button>
            <button className="secondary" type="button" onClick={onLogin}>Entrar</button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="machine-preview">
            <div className="blade" />
            <div>
              <strong>StoneCut Pro</strong>
              <span>Rotação 1528 rpm</span>
            </div>
          </div>
          <div className="metric-grid">
            <div><span>Overcut</span><strong>136 mm</strong></div>
            <div><span>Corte 45°</span><strong>80 mm</strong></div>
            <div><span>Água</span><strong>40 l/min</strong></div>
          </div>
        </div>
      </section>

      <section className="feature-row">
        <article>
          <Factory size={25} />
          <h2>Simulador</h2>
          <p>Versão cliente e versão administrador com os campos técnicos adequados a cada perfil.</p>
        </article>
        <article>
          <Calculator size={25} />
          <h2>Cálculos</h2>
          <p>Resultados claros para overcut, espessura máxima, velocidade, rotação e água.</p>
        </article>
        <article>
          <ShieldCheck size={25} />
          <h2>Administração</h2>
          <p>Administradores são definidos na base de dados e têm acesso aos parâmetros técnicos completos.</p>
        </article>
      </section>
    </main>
  );
}
