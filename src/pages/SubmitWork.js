import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Alert,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Info,
} from '@mui/icons-material';

const SubmitWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    phone: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      website: '',
    },
    productInfo: {
      name: '',
      description: '',
      fandom: '',
      format: '',
      genre: '',
      price: '',
      originalPrice: '',
      quantity: '',
      isLimited: false,
      endDate: '',
    },
    files: [],
    consent: false,
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const steps = [
    'Artist Information',
    'Product Details',
    'Upload Files',
    'Review & Submit'
  ];

  const fandoms = [
    'Marvel', 'Tollywood', 'Anime', 'DC Comics', 'Star Wars', 
    'Harry Potter', 'Game of Thrones', 'The Witcher', 'Other'
  ];

  const formats = [
    'Poster', 'Stickers', 'Apparel', 'Print', 'Accessories', 
    'Digital Art', 'Collectibles', 'Other'
  ];

  const genres = [
    'Action', 'Romance', 'Mythology', 'Fantasy', 'Sci-Fi', 
    'Comedy', 'Drama', 'Horror', 'Other'
  ];

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const handleFileDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.artistName.trim()) newErrors.artistName = 'Artist name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        break;
      case 1:
        if (!formData.productInfo.name.trim()) newErrors.productName = 'Product name is required';
        if (!formData.productInfo.description.trim()) newErrors.description = 'Description is required';
        if (!formData.productInfo.fandom) newErrors.fandom = 'Fandom is required';
        if (!formData.productInfo.format) newErrors.format = 'Format is required';
        if (!formData.productInfo.price) newErrors.price = 'Price is required';
        break;
      case 2:
        if (formData.files.length === 0) newErrors.files = 'At least one file is required';
        break;
      case 3:
        if (!formData.consent) newErrors.consent = 'Consent is required';
        if (!formData.terms) newErrors.terms = 'Terms acceptance is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      // Here you would typically send the data to your backend
      console.log('Submitting form:', formData);
      alert('Submission successful! We will review your work and get back to you within 5-7 business days.');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tell us about yourself
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We'd love to learn more about you and your creative journey.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Artist/Brand Name"
                value={formData.artistName}
                onChange={(e) => handleInputChange('artistName', e.target.value)}
                error={!!errors.artistName}
                helperText={errors.artistName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Social Media & Portfolio
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Instagram Handle"
                value={formData.socialMedia.instagram}
                onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                placeholder="@yourhandle"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Twitter Handle"
                value={formData.socialMedia.twitter}
                onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                placeholder="@yourhandle"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Website (Optional)"
                value={formData.socialMedia.website}
                onChange={(e) => handleInputChange('socialMedia.website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Tell us about the fan art or merchandise you'd like to sell.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.productInfo.name}
                onChange={(e) => handleInputChange('productInfo.name', e.target.value)}
                error={!!errors.productName}
                helperText={errors.productName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Description"
                multiline
                rows={4}
                value={formData.productInfo.description}
                onChange={(e) => handleInputChange('productInfo.description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Describe your product, materials used, dimensions, etc."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.fandom}>
                <InputLabel>Fandom</InputLabel>
                <Select
                  value={formData.productInfo.fandom}
                  label="Fandom"
                  onChange={(e) => handleInputChange('productInfo.fandom', e.target.value)}
                >
                  {fandoms.map((fandom) => (
                    <MenuItem key={fandom} value={fandom}>{fandom}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.format}>
                <InputLabel>Format</InputLabel>
                <Select
                  value={formData.productInfo.format}
                  label="Format"
                  onChange={(e) => handleInputChange('productInfo.format', e.target.value)}
                >
                  {formats.map((format) => (
                    <MenuItem key={format} value={format}>{format}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.productInfo.genre}
                  label="Genre"
                  onChange={(e) => handleInputChange('productInfo.genre', e.target.value)}
                >
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Selling Price ($)"
                type="number"
                value={formData.productInfo.price}
                onChange={(e) => handleInputChange('productInfo.price', e.target.value)}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Original Price ($) - Optional"
                type="number"
                value={formData.productInfo.originalPrice}
                onChange={(e) => handleInputChange('productInfo.originalPrice', e.target.value)}
                placeholder="For sale items"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.productInfo.isLimited}
                    onChange={(e) => handleInputChange('productInfo.isLimited', e.target.checked)}
                  />
                }
                label="This is a limited edition item"
              />
            </Grid>
            {formData.productInfo.isLimited && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.productInfo.endDate}
                  onChange={(e) => handleInputChange('productInfo.endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Upload Your Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload high-quality images of your work. We accept JPG, PNG, and PDF files up to 10MB each.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card
                sx={{
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'grey.50',
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ mb: 2 }}
                  >
                    Choose Files
                  </Button>
                </label>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop files here, or click to select
                </Typography>
              </Card>
            </Grid>
            {formData.files.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Uploaded Files ({formData.files.length})
                </Typography>
                {formData.files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      border: 1,
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {file.type.startsWith('image/') ? 'IMG' : 'PDF'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{file.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleFileDelete(index)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
              </Grid>
            )}
            {errors.files && (
              <Grid item xs={12}>
                <Alert severity="error">{errors.files}</Alert>
              </Grid>
            )}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Submission
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please review all information before submitting.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Artist Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {formData.artistName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {formData.email}
                </Typography>
                {formData.phone && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {formData.phone}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Instagram:</strong> {formData.socialMedia.instagram || 'Not provided'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Twitter:</strong> {formData.socialMedia.twitter || 'Not provided'}
                </Typography>
                <Typography variant="body2">
                  <strong>Website:</strong> {formData.socialMedia.website || 'Not provided'}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Product Information
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Name:</strong> {formData.productInfo.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Fandom:</strong> {formData.productInfo.fandom}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Format:</strong> {formData.productInfo.format}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Price:</strong> ${formData.productInfo.price}
                </Typography>
                {formData.productInfo.originalPrice && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Original Price:</strong> ${formData.productInfo.originalPrice}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Limited Edition:</strong> {formData.productInfo.isLimited ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Files:</strong> {formData.files.length} uploaded
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>What happens next?</strong> Our team will review your submission within 5-7 business days. 
                  We'll contact you via email with our decision and next steps.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                  />
                }
                label="I consent to Fanpuri reviewing and potentially selling my work"
                error={!!errors.consent}
              />
              {errors.consent && (
                <Typography variant="caption" color="error" display="block">
                  {errors.consent}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.checked)}
                  />
                }
                label="I agree to Fanpuri's Terms of Service and Privacy Policy"
                error={!!errors.terms}
              />
              {errors.terms && (
                <Typography variant="caption" color="error" display="block">
                  {errors.terms}
                </Typography>
              )}
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Submit Your Work
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Share your fan art and merchandise with the world
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Card sx={{ p: 4, mb: 4 }}>
        {renderStepContent(activeStep)}
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              endIcon={<CheckCircle />}
            >
              Submit Application
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default SubmitWork; 