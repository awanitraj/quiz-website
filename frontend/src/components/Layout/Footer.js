import React from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  Container,
  Grid,
  IconButton,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  // Customizable data
  const companyInfo = {
    name: "QuizMaster Pro",
    year: new Date().getFullYear(),
    email: "support@quizmaster.com",
    phone: "+1 (555) 123-4567",
    address: "123 Quiz Street, Knowledge City"
  };

  const quickLinks = [
    { text: "Home", path: "/" },
    { text: "Quizzes", path: "/quizzes" },
    { text: "Leaderboard", path: "/leaderboard" },
    { text: "Create Quiz", path: "/admin/add-quiz" }
  ];

  const legalLinks = [
    { text: "Terms of Service", path: "/terms" },
    { text: "Privacy Policy", path: "/privacy" },
    { text: "Cookie Policy", path: "/cookies" }
  ];

  const socialLinks = [
    { icon: <Facebook />, url: "https://facebook.com" },
    { icon: <Twitter />, url: "https://twitter.com" },
    { icon: <Instagram />, url: "https://instagram.com" },
    { icon: <LinkedIn />, url: "https://linkedin.com" }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {companyInfo.name}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ mr: 1 }} />
              <Typography variant="body2">{companyInfo.email}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Phone sx={{ mr: 1 }} />
              <Typography variant="body2">{companyInfo.phone}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body2">{companyInfo.address}</Typography>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            {quickLinks.map((link) => (
              <Box key={link.text} mb={1}>
                <Link 
                  component={RouterLink} 
                  to={link.path}
                  color="inherit"
                  underline="hover"
                >
                  {link.text}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Legal Links Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Legal
            </Typography>
            {legalLinks.map((link) => (
              <Box key={link.text} mb={1}>
                <Link 
                  component={RouterLink} 
                  to={link.path}
                  color="inherit"
                  underline="hover"
                >
                  {link.text}
                </Link>
              </Box>
            ))}
          </Grid>

          {/* Social Media Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Connect With Us
            </Typography>
            <Box display="flex">
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  sx={{ mr: 1 }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Subscribe to our newsletter
            </Typography>
            {/* Newsletter form can be added here */}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        <Box textAlign="center">
          <Typography variant="body2">
            © {companyInfo.year} {companyInfo.name}. All rights reserved.
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;