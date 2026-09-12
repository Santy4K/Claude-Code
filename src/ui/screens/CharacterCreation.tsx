import { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import type { Gender } from '../../game/engine/character';

const randomNames = [
  'Haru', 'Sora', 'Kenji', 'Aoi', 'Ren', 'Yui', 'Riku', 'Nana', 'Kaito', 'Mio',
];

export function CharacterCreation() {
  const startNewLife = useGameStore((s) => s.startNewLife);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  function handleRandomName() {
    setName(randomNames[Math.floor(Math.random() * randomNames.length)]);
  }

  function handleStart() {
    const finalName = name.trim() || randomNames[Math.floor(Math.random() * randomNames.length)];
    startNewLife(finalName, gender);
  }

  return (
    <div className="screen">
      <p className="eyebrow">Primer folio</p>
      <h1 className="title">Nueva vida</h1>
      <div className="title-rule" />
      <p className="subtitle">Vas a nacer en un mundo donde las maldiciones son reales.</p>

      <label className="field-label" htmlFor="char-name">
        Nombre
      </label>
      <input
        id="char-name"
        type="text"
        placeholder="Elegí un nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn btn-ghost" onClick={handleRandomName}>
        Nombre al azar
      </button>

      <label className="field-label" htmlFor="char-gender" style={{ marginTop: 6 }}>
        Género
      </label>
      <select id="char-gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
        <option value="male">Masculino</option>
        <option value="female">Femenino</option>
        <option value="other">Otro</option>
      </select>

      <div className="spacer" />
      <button className="btn btn-primary" onClick={handleStart}>
        Nacer
      </button>
      <button className="btn btn-ghost" onClick={() => goToScreen('menu')}>
        Volver
      </button>
    </div>
  );
}
