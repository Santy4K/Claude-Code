import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import { StatBar } from '../components/StatBar';
import { EventCard } from '../components/EventCard';
import { ranks } from '../../game/data/ranks';
import { getTechnique } from '../../game/data/techniques';
import { getSchool } from '../../game/data/schools';

export function LifeScreen() {
  const { t } = useContent();
  const character = useGameStore((s) => s.character);
  const pendingEvent = useGameStore((s) => s.pendingEvent);
  const ageUpYear = useGameStore((s) => s.ageUpYear);
  const goToScreen = useGameStore((s) => s.goToScreen);

  if (!character) return null;

  const { stats } = character;
  const rankLabel = ranks.find((r) => r.id === character.rank)?.label ?? '';

  return (
    <div className="screen">
      <div className="age-header">
        <div>
          <div className="age-name">{character.name}</div>
          <div className="age-number">
            {character.age}
            <span className="age-number-suffix">años</span>
          </div>
        </div>
        <div className="identity">
          {character.isSorcerer && (
            <span className="seal">
              <span className="seal-dot" />
              {rankLabel}
            </span>
          )}
          {character.schoolId && (
            <div className="identity-line">{t(getSchool(character.schoolId).nameContentId)}</div>
          )}
          {character.techniqueId && (
            <div className="identity-line">{t(getTechnique(character.techniqueId).nameContentId)}</div>
          )}
        </div>
      </div>

      <div className="stat-grid">
        <StatBar label="Físico" value={stats.physical} />
        <StatBar label="Inteligencia" value={stats.intelligence} />
        <StatBar label="Carisma" value={stats.charisma} />
        <StatBar label="Suerte" value={stats.luck} />
        <StatBar label="Salud mental" value={stats.mentalHealth} />
        <StatBar label="Dinero" value={stats.money} max={100} suffix="$" />
        {character.isSorcerer && (
          <>
            <StatBar label="Energía maldita" value={stats.cursedEnergy} />
            <StatBar label="Técnica" value={stats.technique} />
          </>
        )}
      </div>

      <div className="log-feed">
        {[...character.log].reverse().map((entry, i) => (
          <div className="log-entry" key={i}>
            <span className="log-age">{entry.age}</span>
            {entry.text}
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={ageUpYear}>
        Envejecer →
      </button>
      <button className="btn btn-ghost" onClick={() => goToScreen('settings')}>
        Ajustes
      </button>

      {pendingEvent && <EventCard event={pendingEvent} />}
    </div>
  );
}
