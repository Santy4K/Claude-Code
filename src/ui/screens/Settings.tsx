import { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';

const TAPS_TO_UNLOCK = 7;

export function Settings() {
  const goToScreen = useGameStore((s) => s.goToScreen);
  const contentPack = useGameStore((s) => s.contentPack);
  const setContentPack = useGameStore((s) => s.setContentPack);
  const devMenuUnlocked = useGameStore((s) => s.devMenuUnlocked);
  const unlockDevMenu = useGameStore((s) => s.unlockDevMenu);
  const [tapCount, setTapCount] = useState(0);

  function handleVersionTap() {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= TAPS_TO_UNLOCK) {
      unlockDevMenu();
    }
  }

  return (
    <div className="screen">
      <p className="eyebrow">Configuración</p>
      <h1 className="title">Ajustes</h1>
      <div className="title-rule" />

      <div className="card">
        <div className="stat-label">Sobre el juego</div>
        <p style={{ marginBottom: 0, marginTop: 8 }}>
          Un simulador de vida en un mundo de maldiciones y hechiceros.
        </p>
      </div>

      {devMenuUnlocked && (
        <div className="card">
          <div className="stat-label">Modo desarrollador</div>
          <p style={{ marginTop: 8 }}>Set de nombres activo:</p>
          <button
            className={`btn ${contentPack === 'original' ? 'btn-primary' : ''}`}
            onClick={() => setContentPack('original')}
          >
            Nombres propios
          </button>
          <button
            className={`btn ${contentPack === 'canon' ? 'btn-primary' : ''}`}
            onClick={() => setContentPack('canon')}
          >
            Nombres originales (JJK)
          </button>
        </div>
      )}

      <div className="spacer" />
      <p className="subtitle center-text hidden-tap" onClick={handleVersionTap} style={{ margin: '0 auto 16px' }}>
        v0.1.0 (MVP)
      </p>
      <button className="btn btn-ghost" onClick={() => goToScreen('menu')}>
        Volver
      </button>
    </div>
  );
}
