import { useGameStore } from '../../game/state/gameStore';
import { useContent } from '../../game/content/useContent';
import type { LifeEvent } from '../../game/data/events';

interface EventCardProps {
  event: LifeEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { tt } = useContent();
  const chooseOption = useGameStore((s) => s.chooseOption);

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <p className="modal-eyebrow">Un momento decisivo</p>
        <p className="modal-text">{tt(event.text)}</p>
        {event.options.map((option) => (
          <button key={option.label} className="btn" onClick={() => chooseOption(option)}>
            {tt(option.label)}
          </button>
        ))}
      </div>
    </div>
  );
}
