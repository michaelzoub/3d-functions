import ThreeScene from './components/scene';
import Popup from './components/popup';
import './App.css';

function App() {
  return (
      <main className='flex w-full h-screen mainouter'>
        <Popup></Popup>
        <ThreeScene></ThreeScene>
      </main>
  );
}

export default App;
