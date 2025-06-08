import { memo } from 'react';
import useNavigation from '../../../common/hooks/useNavigation';
import PageTitle from '../../atoms/PageTitle';
import MovieForm from '../../organisms/MovieForm';

const AddMoviePage = () => {
  const { navigate } = useNavigation();

  const handleSuccess = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <PageTitle title="Create New Movie" />
      <MovieForm key="create-movie-form" mode="create" onSuccess={handleSuccess} onCancel={handleCancel} />
    </>
  );
};

export default memo(AddMoviePage);
