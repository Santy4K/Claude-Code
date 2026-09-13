import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import { currentStage } from '../../game/engine/character';
import { rollMissions } from '../../game/data/missions';
import { getJobTier, jobLadder } from '../../game/data/jobs';

const tierLabels: Record<string, string> = {
  facil: 'Fácil',
  media: 'Media',
  dificil: 'Difícil',
  especial: 'Especial',
};

export function CentroScreen() {
  const character = useGameStore((s) => s.character);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const startMission = useGameStore((s) => s.startMission);
  const doActivity = useGameStore((s) => s.doActivity);
  const searchJob = useGameStore((s) => s.searchJob);
  const requestPromotion = useGameStore((s) => s.requestPromotion);
  const quitJob = useGameStore((s) => s.quitJob);
  const actionMessage = useGameStore((s) => s.actionMessage);

  const [missionSeed, setMissionSeed] = useState(0);
  const missions = useMemo(
    () => (character?.isSorcerer ? rollMissions(character.rank, 3) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [character?.isSorcerer, character?.rank, missionSeed],
  );

  if (!character) return null;
  const stage = currentStage(character);
  const trainUses = character.activityUses.train_technique ?? 0;

  return (
    <div className="screen">
      <p className="eyebrow">Centro</p>
      <h1 className="title">Estudios y carrera</h1>
      <div className="title-rule" />
      {actionMessage && <p className="action-message">{actionMessage}</p>}

      {character.isSorcerer && (
        <>
          <div className="card">
            <div className="stat-label">Entrenamiento</div>
            <p className="choice-desc" style={{ marginTop: 6 }}>
              Practicá el control de tu técnica maldita. Usos hoy: {trainUses}/2.
            </p>
            <button className="btn btn-primary" disabled={trainUses >= 2} onClick={() => doActivity('train_technique')}>
              Entrenar técnica
            </button>
          </div>

          <div className="stat-label" style={{ margin: '18px 0 10px' }}>
            Tablón de misiones
          </div>
          {missions.map((mission) => (
            <button key={mission.id} className="btn choice-card" onClick={() => startMission(mission)}>
              <span className="choice-title">{mission.title}</span>
              <span className="choice-desc">{mission.description}</span>
              <span className="mission-tier">Dificultad: {tierLabels[mission.tier]}</span>
            </button>
          ))}
          <button className="btn btn-ghost" onClick={() => setMissionSeed((s) => s + 1)}>
            Buscar nuevas misiones
          </button>
        </>
      )}

      {!character.isSorcerer && stage === 'teen' && (
        <div className="card">
          <p>Todavía estás en la escuela. Seguí entrenando en Actividades y esperá tu momento.</p>
        </div>
      )}

      {!character.isSorcerer && stage === 'civilian' && (
        <div className="card">
          <div className="stat-label">Trabajo</div>
          {character.job ? (
            <>
              <p style={{ marginTop: 8 }}>
                <strong>{getJobTier(character.job.tierIndex).title}</strong> — $
                {getJobTier(character.job.tierIndex).salary}/año
              </p>
              {character.job.tierIndex < jobLadder.length - 1 && (
                <button className="btn btn-primary" onClick={requestPromotion}>
                  Pedir ascenso
                </button>
              )}
              <button className="btn btn-ghost" onClick={quitJob}>
                Renunciar
              </button>
            </>
          ) : (
            <>
              <p style={{ marginTop: 8 }}>Actualmente estás desempleado.</p>
              <button className="btn btn-primary" onClick={searchJob}>
                Buscar trabajo
              </button>
            </>
          )}
        </div>
      )}

      <div className="spacer" />
      <button className="btn btn-ghost" onClick={() => goToScreen('life')}>
        Volver
      </button>
    </div>
  );
}
