import { useGameStore } from '../../game/state/gameStore';
import { QteBar } from '../components/QteBar';

export function CombatScreen() {
  const combat = useGameStore((s) => s.combat);
  const character = useGameStore((s) => s.character);
  const combatChoose = useGameStore((s) => s.combatChoose);
  const combatResolveAttack = useGameStore((s) => s.combatResolveAttack);
  const combatResolveDodge = useGameStore((s) => s.combatResolveDodge);
  const combatContinue = useGameStore((s) => s.combatContinue);

  if (!combat || !character) return null;

  const enemyHpPct = Math.max(0, (combat.enemy.hp / combat.enemy.hpMax) * 100);
  const playerHpPct = Math.max(0, (combat.playerHp / combat.playerHpMax) * 100);
  const energyPct = combat.playerEnergyMax > 0 ? (combat.playerEnergy / combat.playerEnergyMax) * 100 : 0;
  const ultimateReady =
    combat.canUltimate && !combat.usedUltimate && combat.playerEnergy >= combat.playerEnergyMax * 0.8;

  return (
    <div className="screen">
      <p className="eyebrow">Combate</p>
      <h1 className="title">{combat.enemy.name}</h1>
      <div className="title-rule" />

      <div className="combat-bar-row">
        <span className="stat-label">Maldición</span>
        <div className="hp-track">
          <div className="hp-fill enemy" style={{ width: `${enemyHpPct}%` }} />
        </div>
      </div>
      <div className="combat-bar-row">
        <span className="stat-label">Vos</span>
        <div className="hp-track">
          <div className="hp-fill player" style={{ width: `${playerHpPct}%` }} />
        </div>
      </div>
      {combat.playerEnergyMax > 0 && (
        <div className="combat-bar-row">
          <span className="stat-label">Energía maldita</span>
          <div className="hp-track">
            <div className="hp-fill energy" style={{ width: `${energyPct}%` }} />
          </div>
        </div>
      )}

      <div className="log-feed combat-log">
        {[...combat.log].reverse().map((line, i) => (
          <div className="log-entry" key={i}>
            {line}
          </div>
        ))}
      </div>

      {combat.phase === 'choose' && (
        <div className="combat-actions">
          <button className="btn btn-primary" onClick={() => combatChoose('attack')}>
            Atacar
          </button>
          <button className="btn" disabled={combat.playerEnergy < 20} onClick={() => combatChoose('technique')}>
            Técnica {combat.playerEnergyMax > 0 ? '(20 energía)' : ''}
          </button>
          <button className="btn" onClick={() => combatChoose('block')}>
            Bloquear
          </button>
          <button className="btn btn-ghost" onClick={() => combatChoose('flee')}>
            Huir
          </button>
          {ultimateReady && (
            <button className="btn btn-danger" onClick={() => combatChoose('ultimate')}>
              Técnica definitiva
            </button>
          )}
        </div>
      )}

      {combat.phase === 'qteAttack' && (
        <QteBar key="attack" label="¡Tocá justo en el momento para golpear!" onResolve={combatResolveAttack} />
      )}

      {combat.phase === 'qteDodge' && (
        <QteBar
          key="dodge"
          label={`¡Esquivá el ataque de ${combat.enemy.name}!`}
          zoneWidth={0.2}
          durationMs={850}
          onResolve={combatResolveDodge}
        />
      )}

      {(combat.phase === 'victory' || combat.phase === 'defeat' || combat.phase === 'fled') && (
        <div className="card center-text">
          <h2 className="choice-title">
            {combat.phase === 'victory' ? '¡Victoria!' : combat.phase === 'defeat' ? 'Derrota' : 'Escapaste'}
          </h2>
          <button className="btn btn-primary" onClick={combatContinue}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
