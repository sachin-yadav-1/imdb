import ProtectedRoute from './common/components/ProtectedRoute';
import Routes from './common/components/Routes';
import Toast from './components/molecules/Toast';
import Navbar from './components/organisms/Navbar';

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
