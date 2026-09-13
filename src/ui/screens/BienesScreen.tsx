import { useGameStore } from '../../game/state/gameStore';
import { assetCatalog, type AssetCategory } from '../../game/data/assets';

const categoryLabels: Record<AssetCategory, string> = {
  house: 'Vivienda',
  car: 'Vehículos',
  clothing: 'Ropa',
  tool: 'Herramientas malditas',
};

const categories: AssetCategory[] = ['house', 'car', 'clothing', 'tool'];

export function BienesScreen() {
  const character = useGameStore((s) => s.character);
  const goToScreen = useGameStore((s) => s.goToScreen);
  const buyAsset = useGameStore((s) => s.buyAsset);
  const sellAsset = useGameStore((s) => s.sellAsset);
  const equipTool = useGameStore((s) => s.equipTool);
  const actionMessage = useGameStore((s) => s.actionMessage);

  if (!character) return null;

  return (
    <div className="screen">
      <p className="eyebrow">Bienes</p>
      <h1 className="title">Tus posesiones</h1>
      <div className="title-rule" />
      <p className="subtitle">Tenés ${Math.round(character.stats.money)} disponibles.</p>
      {actionMessage && <p className="action-message">{actionMessage}</p>}

      <div className="log-feed">
        {categories.map((category) => (
          <div key={category}>
            <div className="stat-label" style={{ margin: '14px 0 8px' }}>
              {categoryLabels[category]}
            </div>
            {assetCatalog
              .filter((a) => a.category === category)
              .map((asset) => {
                const owned = character.assets.includes(asset.id);
                const equipped = character.equippedToolId === asset.id;
                return (
                  <div key={asset.id} className="card choice-card">
                    <span className="choice-title">
                      {asset.name} {equipped && '· Equipado'}
                    </span>
                    <span className="choice-desc">{asset.description}</span>
                    {asset.combatBonus && (
                      <span className="choice-desc">
                        Combate: +{asset.combatBonus.attack} ataque, +{asset.combatBonus.defense} defensa
                      </span>
                    )}
                    <span className="choice-desc">${asset.price}</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      {!owned && (
                        <button className="btn btn-primary" style={{ marginBottom: 0 }} onClick={() => buyAsset(asset.id)}>
                          Comprar
                        </button>
                      )}
                      {owned && asset.category === 'tool' && !equipped && (
                        <button className="btn" style={{ marginBottom: 0 }} onClick={() => equipTool(asset.id)}>
                          Equipar
                        </button>
                      )}
                      {owned && (
                        <button className="btn btn-ghost" style={{ marginBottom: 0 }} onClick={() => sellAsset(asset.id)}>
                          Vender
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      <button className="btn btn-ghost" onClick={() => goToScreen('life')}>
        Volver
      </button>
    </div>
  );
}
