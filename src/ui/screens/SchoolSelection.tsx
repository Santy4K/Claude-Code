import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import { schools } from '../../game/data/schools';

export function SchoolSelection() {
  const { t } = useContent();
  const chooseSchool = useGameStore((s) => s.chooseSchool);

  return (
    <div className="screen">
      <p className="eyebrow">Admisión</p>
      <h1 className="title">Elegí tu escuela</h1>
      <div className="title-rule" />
      <p className="subtitle">Vas a pasar los próximos años formándote ahí.</p>
      {schools.map((school) => (
        <button key={school.id} className="btn choice-card" onClick={() => chooseSchool(school.id)}>
          <span className="choice-title">{t(school.nameContentId)}</span>
          <span className="choice-desc">{school.description}</span>
        </button>
      ))}
    </div>
  );
}
