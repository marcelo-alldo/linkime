import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'motion/react';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

interface LogoProps {
  size?: 'small' | 'large';
}

function Logo({ size }: LogoProps) {
  return (
    <Root className="flex flex-1 items-center space-x-3">
      <div className="flex flex-1 items-center ">
        <Box sx={{ width: '100%', zIndex: 1 }} className="relative">
          <motion.div className="flex items-center justify-center" initial="hidden" animate="show">
            <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative z-10">
              <Typography component="span" sx={{ color: 'white', fontSize: size === 'large' ? '65px' : '35px' }} fontWeight={700}>
                Link
              </Typography>
            </motion.span>
            <motion.span whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Typography sx={{ fontSize: size === 'large' ? '65px' : '35px', color: '#00FF00' }} component="span" color="secondary" fontWeight={700}>
                i
              </Typography>
            </motion.span>
            <motion.span whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="relative z-10">
              <Typography component="span" sx={{ color: 'white', fontSize: size === 'large' ? '65px' : '35px' }} fontWeight={700}>
                me
              </Typography>
            </motion.span>
          </motion.div>
        </Box>
        <div className="logo-text flex flex-col flex-auto gap-0.5"></div>
      </div>
    </Root>
  );
}

export default Logo;
