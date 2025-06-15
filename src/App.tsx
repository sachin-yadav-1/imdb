import Routes from './common/components/Routes';
import Toast from './components/atoms/Toast';
import Navbar from './components/molecules/Navbar';
import ProtectedRoute from './components/molecules/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <Routes />
      </ProtectedRoute>
      <Toast />
    </>
  );
}

export default App;
