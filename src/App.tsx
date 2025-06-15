import Routes from './common/components/Routes';
import Toast from './components/atoms/Toast';
import Navbar from './components/molecules/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes />
      <Toast />
    </>
  );
}

export default App;
