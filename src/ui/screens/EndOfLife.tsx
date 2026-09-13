import { useGameStore } from '../../game/state/gameStore';
import { ranks } from '../../game/data/ranks';
import { Sigil } from '../components/Sigil';
import { computeEpitaph } from '../../game/engine/epitaph';
import { highestOwnedHouse } from '../../game/data/assets';

export function EndOfLife() {
  const character = useGameStore((s) => s.character);
  const goToScreen = useGameStore((s) => s.goToScreen);

  if (!character) return null;

  const rankLabel = ranks.find((r) => r.id === character.rank)?.label;
  const epitaph = computeEpitaph(character);
  const house = highestOwnedHouse(character.assets);
  const children = character.relationships.filter((r) => r.role === 'child');

  return (
    <div className="screen center-text">
      <div className="spacer" />
      {epitaph && <div className="epitaph-ribbon">{epitaph}</div>}
      <Sigil size={56} variant="ash" className="tombstone" />
      <p className="eyebrow">Folio cerrado</p>
      <h1 className="title">{character.name}</h1>
      <p className="subtitle" style={{ margin: '0 auto 18px' }}>
        {character.retired
          ? 'Se retiró en paz después de una vida de hechicero.'
          : character.deathCause ?? 'Falleció.'}
      </p>
      <div className="card" style={{ textAlign: 'left' }}>
        <div className="log-entry" style={{ border: 'none', padding: '4px 0' }}>
          Edad final: <strong>{character.age} años</strong>
        </div>
        {character.isSorcerer && (
          <div className="log-entry" style={{ border: 'none', padding: '4px 0' }}>
            Grado alcanzado: <strong>{rankLabel}</strong>
          </div>
        )}
        <div className="log-entry" style={{ border: 'none', padding: '4px 0' }}>
          Patrimonio: <strong>${Math.round(character.stats.money)}</strong>
        </div>
        {house && (
          <div className="log-entry" style={{ border: 'none', padding: '4px 0' }}>
            Residencia: <strong>{house.name}</strong>
          </div>
        )}
        {children.length > 0 && (
          <div className="log-entry" style={{ border: 'none', padding: '4px 0' }}>
            Hijos: <strong>{children.length}</strong>
          </div>
        )}
        <div className="log-entry" style={{ border: 'none', padding: '4px 0 0' }}>
          Eventos vividos: <strong>{character.log.length}</strong>
        </div>
      </div>
      <div className="spacer" />
      <button className="btn btn-primary" onClick={() => goToScreen('creation')}>
        Vivir una nueva vida
      </button>
      <button className="btn btn-ghost" onClick={() => goToScreen('menu')}>
        Menú principal
      </button>
    </div>
  );
}
