import { memo } from 'react';

import { Container } from '@mui/material';
import AddMoviePage from '../../../components/pages/AddMoviePage';
import EditMoviePage from '../../../components/pages/EditMoviePage';
import MoviesPage from '../../../components/pages/MoviesPage';
import Route from '../Route/Route';

const STYLES = {
  container: {
    padding: '2rem 0',
  },
};

const Routes = () => {
  return (
    <Container maxWidth="lg" sx={STYLES.container}>
      <Route path="/" element={<MoviesPage />} />
      <Route path="/add-movie" element={<AddMoviePage />} />
      <Route path="/edit-movie/:id" element={<EditMoviePage />} />
    </Container>
  );
};

export default memo(Routes);
