import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import { Sigil } from '../components/Sigil';

export function MainMenu() {
  const { t } = useContent();
  const goToScreen = useGameStore((s) => s.goToScreen);
  const hasCharacter = useGameStore((s) => s.character !== null);

  return (
    <div className="screen center-text">
      <div className="spacer" />
      <Sigil size={64} className="mark" />
      <p className="eyebrow">Un simulador de vida maldita</p>
      <h1 className="title">{t('game.title')}</h1>
      <div className="title-rule" style={{ margin: '0 auto 18px' }} />
      <p className="subtitle" style={{ margin: '0 auto 24px' }}>
        Nacé, crecé y elegí si vas a cruzar al otro lado del mundo: el de las maldiciones y
        quienes las exorcizan.
      </p>
      <div className="spacer" />
      <button className="btn btn-primary" onClick={() => goToScreen('creation')}>
        Nueva vida
      </button>
      {hasCharacter && (
        <button className="btn" onClick={() => goToScreen('life')}>
          Continuar
        </button>
      )}
      <button className="btn btn-ghost" onClick={() => goToScreen('settings')}>
        Ajustes
      </button>
      <div className="spacer" />
    </div>
  );
}
