import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import { StatBar } from '../components/StatBar';
import { EventCard } from '../components/EventCard';
import { ranks } from '../../game/data/ranks';
import { getTechnique } from '../../game/data/techniques';
import { getSchool } from '../../game/data/schools';
import { getJobTier } from '../../game/data/jobs';
import { currentStage } from '../../game/engine/character';

export function LifeScreen() {
  const { t } = useContent();
  const character = useGameStore((s) => s.character);
  const pendingEvent = useGameStore((s) => s.pendingEvent);
  const ageUpYear = useGameStore((s) => s.ageUpYear);
  const goToScreen = useGameStore((s) => s.goToScreen);

  if (!character) return null;

  const { stats } = character;
  const rankLabel = ranks.find((r) => r.id === character.rank)?.label ?? '';
  const stage = currentStage(character);

  let occupation = 'Sin ocupación';
  if (character.isSorcerer) occupation = rankLabel;
  else if (stage === 'civilian') occupation = character.job ? getJobTier(character.job.tierIndex).title : 'Desempleado/a';
  else if (stage === 'teen') occupation = 'Estudiante';
  else if (stage === 'child') occupation = 'Niño/a';

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
          <div className="money-tag">${Math.round(stats.money)}</div>
          {character.isSorcerer && (
            <span className="seal">
              <span className="seal-dot" />
              {rankLabel}
            </span>
          )}
          <div className="identity-line">{occupation}</div>
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
        <StatBar label="Salud" value={stats.health} />
        <StatBar label="Salud mental" value={stats.mentalHealth} />
        <StatBar label="Fama" value={stats.fame} />
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

      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => goToScreen('centro')}>
          Centro
        </button>
        <button className="nav-btn" onClick={() => goToScreen('bienes')}>
          Bienes
        </button>
        <button className="nav-btn nav-btn-primary" onClick={ageUpYear}>
          Edad
        </button>
        <button className="nav-btn" onClick={() => goToScreen('relaciones')}>
          Relaciones
        </button>
        <button className="nav-btn" onClick={() => goToScreen('actividades')}>
          Actividades
        </button>
      </div>
      <button className="settings-link" onClick={() => goToScreen('settings')}>
        Ajustes
      </button>

      {pendingEvent && <EventCard event={pendingEvent} />}
    </div>
  );
}
