import React from 'react';
import { Box, Typography } from '@mui/material';

const LimitedEditionBanner = ({ height = 100, showIcon = true, showText = true }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '20%',
        height: '32px',
        overflow: 'hidden',
      }}
    >
      {/* Banner Background */}
      <Box
        component="img"
        src="/assets/limited banner rectangle.svg"
        alt="Limited Edition"
        sx={{
          height: '300%',
          width: '100%',
          transform: 'rotate(-90deg)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          zIndex: 1,
        }}
      />
      
      {/* Icon and Text Container */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 2,
        }}
      >
        {/* Icon */}
        {showIcon && (
          <Box
            component="img"
            src="/assets/limited icon.svg"
            alt="Limited Icon"
            sx={{
              width: '16px',
              height: '16px',
            }}
          />
        )}
        
        {/* Text */}
        {showText && (
          <Typography
            sx={{
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: 800,
              fontSize: '14px',
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            LIMITED
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LimitedEditionBanner; 