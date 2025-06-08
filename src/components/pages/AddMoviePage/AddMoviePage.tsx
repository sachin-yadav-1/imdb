import { memo } from 'react';
import PageTitle from '../../atoms/PageTitle';
import AddMovieForm from '../../organisms/AddMovieForm';

const AddMoviePage = () => {
  return (
    <>
      <PageTitle title="Create New Movie" />
      <AddMovieForm />
    </>
  );
};

export default memo(AddMoviePage);
