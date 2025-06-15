import { Typography } from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';

interface MoviePlotProps {
  plot: string;
  maxLen?: number;
}

const STYLES = {
  plot: {
    fontSize: '1.4rem',
    fontWeight: 400,
  },
  showMore: {
    padding: 0,
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 400,
    textTransform: 'none',
    marginLeft: '3px',
    color: 'primary.main',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
};

const MoviePlot: React.FC<MoviePlotProps> = ({ plot, maxLen = 200 }) => {
  const [showAll, setShowAll] = useState(false);

  const handleShowMore = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const finalPlot = useMemo(() => {
    if (showAll) {
      return plot;
    }

    return plot.slice(0, maxLen);
  }, [plot, maxLen, showAll]);

  return (
    <Typography variant="body2" sx={STYLES.plot}>
      {finalPlot}

      {plot.length > maxLen && !showAll && (
        <Typography component="span" sx={STYLES.plot}>
          ...
        </Typography>
      )}

      {plot.length > maxLen && (
        <Typography component="span" onClick={handleShowMore} sx={STYLES.showMore}>
          {showAll ? 'Show less' : 'Show more'}
        </Typography>
      )}
    </Typography>
  );
};

export default memo(MoviePlot);
