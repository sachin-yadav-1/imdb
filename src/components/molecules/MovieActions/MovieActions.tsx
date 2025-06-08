import EditIcon from '@mui/icons-material/Edit';
import { CardActions, IconButton } from '@mui/material';
import { memo } from 'react';
import Link from '../../../common/components/Link';

interface MovieActionsProps {
  movieId: number;
}

const MovieActions: React.FC<MovieActionsProps> = ({ movieId }) => {
  return (
    <CardActions>
      <Link to={`/movie/${movieId}`}>
        <IconButton size="large">
          <EditIcon />
        </IconButton>
      </Link>
    </CardActions>
  );
};

export default memo(MovieActions);
