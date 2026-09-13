import { useGameStore } from '../../game/state/gameStore';
import { activities } from '../../game/data/activities';
import { currentStage } from '../../game/engine/character';

export function ActividadesScreen() {
  const character = useGameStore((s) => s.character);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const doActivity = useGameStore((s) => s.doActivity);
  const actionMessage = useGameStore((s) => s.actionMessage);

  if (!character) return null;
  const stage = currentStage(character);

  const visible = activities.filter((a) => {
    if (a.id === 'train_technique') return false;
    if (a.civilianOnly && stage !== 'civilian') return false;
    return true;
  });

  return (
    <div className="screen">
      <p className="eyebrow">Actividades</p>
      <h1 className="title">Tu día a día</h1>
      <div className="title-rule" />
      {actionMessage && <p className="action-message">{actionMessage}</p>}

      <div className="log-feed">
        {visible.map((activity) => {
          const uses = character.activityUses[activity.id] ?? 0;
          const maxed = uses >= activity.maxPerYear;
          return (
            <div key={activity.id} className="card choice-card">
              <span className="choice-title">{activity.label}</span>
              <span className="choice-desc">{activity.description}</span>
              <span className="choice-desc">
                {activity.cost ? `Cuesta $${activity.cost} · ` : ''}Usos este año: {uses}/{activity.maxPerYear}
              </span>
              <button
                className="btn btn-primary"
                style={{ marginTop: 8, marginBottom: 0 }}
                disabled={maxed}
                onClick={() => doActivity(activity.id)}
              >
                {maxed ? 'Ya lo hiciste este año' : 'Hacer'}
              </button>
            </div>
          );
        })}
      </div>

      <button className="btn btn-ghost" onClick={() => goToScreen('life')}>
        Volver
      </button>
    </div>
  );
}
