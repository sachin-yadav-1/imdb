import { memo } from 'react';
import PageTitle from '../../atoms/PageTitle';
import CreateMovieForm from '../../organisms/CreateMovieForm';

const AddMoviePage = () => {
  return (
    <>
      <PageTitle title="Create New Movie" />
      <CreateMovieForm />
    </>
  );
};

export default memo(AddMoviePage);
