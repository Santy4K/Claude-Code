import { useGameStore } from './game/state/gameStore';
import { MainMenu } from './ui/screens/MainMenu';
import { CharacterCreation } from './ui/screens/CharacterCreation';
import { LifeScreen } from './ui/screens/LifeScreen';
import { SchoolSelection } from './ui/screens/SchoolSelection';
import { TechniqueSelection } from './ui/screens/TechniqueSelection';
import { EndOfLife } from './ui/screens/EndOfLife';
import { Settings } from './ui/screens/Settings';

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
    default:
      return <MainMenu />;
  }
}

export default App;
