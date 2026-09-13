import { useGameStore } from './game/state/gameStore';
import { MainMenu } from './ui/screens/MainMenu';
import { CharacterCreation } from './ui/screens/CharacterCreation';
import { LifeScreen } from './ui/screens/LifeScreen';
import { SchoolSelection } from './ui/screens/SchoolSelection';
import { TechniqueSelection } from './ui/screens/TechniqueSelection';
import { EndOfLife } from './ui/screens/EndOfLife';
import { Settings } from './ui/screens/Settings';
import { CentroScreen } from './ui/screens/CentroScreen';
import { BienesScreen } from './ui/screens/BienesScreen';
import { RelacionesScreen } from './ui/screens/RelacionesScreen';
import { ActividadesScreen } from './ui/screens/ActividadesScreen';
import { CombatScreen } from './ui/screens/CombatScreen';

function App() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case 'menu':
      return <MainMenu />;
    case 'creation':
      return <CharacterCreation />;
    case 'life':
      return <LifeScreen />;
    case 'schoolSelection':
      return <SchoolSelection />;
    case 'techniqueSelection':
      return <TechniqueSelection />;
    case 'endOfLife':
      return <EndOfLife />;
    case 'settings':
      return <Settings />;
    case 'centro':
      return <CentroScreen />;
    case 'bienes':
      return <BienesScreen />;
    case 'relaciones':
      return <RelacionesScreen />;
    case 'actividades':
      return <ActividadesScreen />;
    case 'combat':
      return <CombatScreen />;
    default:
      return <MainMenu />;
  }
}

export default App;
