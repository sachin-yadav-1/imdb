import { Typography } from '@mui/material';
import { memo } from 'react';

interface PageTitleProps {
  title: string;
}

const TEXT_STYLES = {
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: '1rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
};

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <Typography variant="h1" sx={TEXT_STYLES}>
      {title}
    </Typography>
  );
};

export default memo(PageTitle);
