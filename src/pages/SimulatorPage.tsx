import { useMemo, useState } from 'react';
import { ArrowLeft, Calculator, Disc3 } from 'lucide-react';
import { calculateParameters, CLIENT_ENGINE_NAMES, defaultsForMachine, getDiameters, getEngines, getThicknesses, materials } from '../lib/simulator';
import { MachineType, Role } from '../types';

interface SimulatorPageProps {
  role: Role;
}

export function SimulatorPage({ role }: SimulatorPageProps) {
  const [selectedMachine, setSelectedMachine] = useState<MachineType | null>(null);
  const initial = defaultsForMachine('Pro');
  const [enginePower, setEnginePower] = useState(initial.enginePower);
  const [materialType, setMaterialType] = useState('Mármore');
  const [diameter, setDiameter] = useState(initial.diameter);
  const [thickness, setThickness] = useState('40 mm');
  const [calculated, setCalculated] = useState(false);

  const results = useMemo(() => calculateParameters(enginePower, materialType, diameter, thickness, role === 'admin'), [diameter, enginePower, materialType, role, thickness]);

  function chooseMachine(machine: MachineType) {
    const nextDefaults = defaultsForMachine(machine);
    setSelectedMachine(machine);
    setEnginePower(nextDefaults.enginePower);
    setDiameter(nextDefaults.diameter);
    setCalculated(false);
  }

  if (!selectedMachine) {
    return (
      <main className="page">
        <section className="dashboard-header">
          <div>
            <span className="eyebrow">{role === 'admin' ? 'Painel Industrial' : 'Simulador Cliente'}</span>
            <h1>{role === 'admin' ? 'Controlo Técnico Global CEI' : 'Selecione o modelo da máquina'}</h1>
          </div>
        </section>

        <section className="machine-grid">
          <button className="machine-card" type="button" onClick={() => chooseMachine('Pro')}>
            <Disc3 size={34} />
            <strong>StoneCut Pro</strong>
            <span>Abrir simulador</span>
          </button>
          <button className="machine-card blue" type="button" onClick={() => chooseMachine('Master')}>
            <Disc3 size={34} />
            <strong>StoneCut Master</strong>
            <span>Abrir simulador</span>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page narrow">
      <button className="back-link" type="button" onClick={() => setSelectedMachine(null)}><ArrowLeft size={18} /> Voltar</button>
      <section className="form-panel">
        <h1>{role === 'admin' ? `Parâmetros CEI - ${selectedMachine}` : `${selectedMachine} (Cliente)`}</h1>

        <label>
          Potência do Motor
          <select value={enginePower} onChange={(event) => setEnginePower(event.target.value)}>
            {getEngines(selectedMachine).map((engine) => (
              <option key={engine} value={engine}>{role === 'admin' ? engine : CLIENT_ENGINE_NAMES[engine]}</option>
            ))}
          </select>
        </label>

        <label>
          Tipo de Material
          <select value={materialType} onChange={(event) => setMaterialType(event.target.value)}>
            {materials.map((material) => <option key={material} value={material}>{material}</option>)}
          </select>
        </label>

        <label>
          Diâmetro do Disco
          <select value={diameter} onChange={(event) => setDiameter(event.target.value)}>
            {getDiameters(selectedMachine).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          Espessura da Chapa
          <select value={thickness} onChange={(event) => setThickness(event.target.value)}>
            {getThicknesses().map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <button className="primary full" type="button" onClick={() => setCalculated(true)}>
          <Calculator size={18} /> Calcular Parâmetros Técnicos
        </button>
      </section>

      <section className={calculated ? 'results-panel visible' : 'results-panel'}>
        <h2>{role === 'admin' ? 'Especificações Avançadas Administrador' : 'Especificações Técnicas'}</h2>
        {role === 'admin' && (
          <>
            <Result label="Flange Blade Coupling" value={results.flangeBlade || '-'} />
            <Result label="Inner Hole Diameter" value={results.innerHole || '-'} />
          </>
        )}
        <Result label="Overcut" value={results.overcut} />
        <Result label="Espessura máx. corte 0°" value={results.maxCut0} />
        <Result label="Espessura máx. corte 45°" value={results.maxCut45} />
        <Result label="Velocidade avanço" value={results.forwardSpeed} />
        <Result label="Velocidade rotação" value={results.rotationSpeed} />
        <Result label="Água para disco" value={results.discToWater} />
      </section>
    </main>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="result-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
