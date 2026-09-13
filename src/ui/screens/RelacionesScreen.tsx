import { useState } from 'react';
import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import type { Relationship } from '../../game/data/relationships';

const roleLabels: Record<Relationship['role'], string> = {
  parent: 'Familia',
  sibling: 'Familia',
  friend: 'Amistad',
  rival: 'Rivalidad',
  mentor: 'Mentor',
  partner: 'Pareja',
  child: 'Hijo/a',
};

export function RelacionesScreen() {
  const { t } = useContent();
  const character = useGameStore((s) => s.character);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const meetSomeone = useGameStore((s) => s.meetSomeone);
  const relationshipAction = useGameStore((s) => s.relationshipAction);
  const actionMessage = useGameStore((s) => s.actionMessage);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!character) return null;

  const hasPartner = character.relationships.some((r) => r.role === 'partner');
  const selected = character.relationships.find((r) => r.id === selectedId) ?? null;

  function displayName(rel: Relationship): string {
    return rel.contentId ? t(rel.contentId) : rel.name;
  }

  return (
    <div className="screen">
      <p className="eyebrow">Relaciones</p>
      <h1 className="title">Tu gente</h1>
      <div className="title-rule" />
      {actionMessage && <p className="action-message">{actionMessage}</p>}

      {!hasPartner && (
        <button className="btn btn-primary" onClick={meetSomeone}>
          Conocer a alguien nuevo
        </button>
      )}

      <div className="log-feed">
        {character.relationships.map((rel) => (
          <button
            key={rel.id}
            className="btn choice-card"
            onClick={() => setSelectedId(rel.id === selectedId ? null : rel.id)}
          >
            <span className="choice-title">
              {displayName(rel)} {rel.married && '💍'}
            </span>
            <span className="choice-desc">{roleLabels[rel.role]}</span>
            <div className="stat-bar-track" style={{ marginTop: 8 }}>
              <div className="stat-bar-fill" style={{ width: `${rel.affinity}%` }} />
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="card">
          <div className="stat-label">Acciones con {displayName(selected)}</div>
          <button className="btn" onClick={() => relationshipAction(selected.id, 'talk')}>
            Hablar
          </button>
          <button className="btn" onClick={() => relationshipAction(selected.id, 'hangout')}>
            Salir ($10)
          </button>
          <button className="btn" onClick={() => relationshipAction(selected.id, 'gift')}>
            Regalar ($25)
          </button>
          <button className="btn btn-ghost" onClick={() => relationshipAction(selected.id, 'fight')}>
            Pelear
          </button>
          {selected.role === 'partner' && !selected.married && (
            <button className="btn btn-primary" onClick={() => relationshipAction(selected.id, 'propose')}>
              Proponer matrimonio
            </button>
          )}
          {selected.role === 'partner' && selected.married && (
            <button className="btn btn-primary" onClick={() => relationshipAction(selected.id, 'haveChild')}>
              Tener un hijo/a ($100)
            </button>
          )}
          {selected.role === 'partner' && (
            <button
              className="btn btn-danger"
              onClick={() => {
                relationshipAction(selected.id, 'breakup');
                setSelectedId(null);
              }}
            >
              Terminar la relación
            </button>
          )}
        </div>
      )}

      <button className="btn btn-ghost" onClick={() => goToScreen('life')}>
        Volver
      </button>
    </div>
  );
}
