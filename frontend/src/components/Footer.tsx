import { Box, Typography, Link, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'white',
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 'lg',
          mx: 'auto',
          gap: 2,
        }}
      >
        {/* Left: Logo and text */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            order: { xs: 1, md: 1 },
          }}
        >
          <img
            src="/images/purpleplate.png"
            alt="PurplePlate Logo"
            style={{ height: '25px', width: 'auto' }}
          />
          <Typography variant="h6" component="span" sx={{ fontWeight: 500 }}>
            PurplePlate
          </Typography>
        </Box>

        {/* Center: Made by text */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            order: { xs: 3, md: 2 },
          }}
        >
          Made by Taeyoung, Jason, Prashant, and Bella
        </Typography>

        {/* Right: GitHub link */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            order: { xs: 2, md: 3 },
          }}
        >
          <Tooltip title="Visit our GitHub repository">
            <Link
              href="https://github.com/NU-CS-Software-Studio-Spring-25/project-dining-hall-tracker"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                textDecoration: 'none',
                transition: 'all 0.3s ease-in-out',
                padding: '8px 12px',
                borderRadius: '6px',
                '&:hover': {
                  color: '#3a1f63',
                  backgroundColor: 'rgba(78, 42, 132, 0.08)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
              }}
              aria-label="GitHub repository (opens in new tab)"
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">GitHub</Typography>
            </Link>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};