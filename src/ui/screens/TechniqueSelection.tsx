import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import { techniques } from '../../game/data/techniques';

export function TechniqueSelection() {
  const { t } = useContent();
  const chooseTechnique = useGameStore((s) => s.chooseTechnique);

  return (
    <div className="screen">
      <p className="eyebrow">El pacto</p>
      <h1 className="title">Elegí tu técnica maldita</h1>
      <div className="title-rule" />
      <p className="subtitle">Va a definir tu estilo de combate para toda la vida.</p>
      {techniques.map((technique) => (
        <button key={technique.id} className="btn choice-card" onClick={() => chooseTechnique(technique.id)}>
          <span className="choice-title">{t(technique.nameContentId)}</span>
          <span className="choice-desc">{technique.style}</span>
        </button>
      ))}
    </div>
  );
}
