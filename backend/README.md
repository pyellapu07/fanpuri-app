# Fanpuri Backend API

A Node.js/Express backend for the Fanpuri fan art marketplace platform.

## Features

- **Artist Management**: Create, update, and manage artist profiles
- **Product Upload**: Upload poster images with artist association
- **Image Management**: Handle multiple image uploads with validation
- **Admin Dashboard**: Manage products, artists, and system statistics
- **RESTful API**: Complete CRUD operations for all entities
- **Search & Filtering**: Advanced search and filtering capabilities
- **Featured Products**: Mark products as featured for homepage display

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - Set your MongoDB connection string
   - Configure JWT secret
   - Set up Cloudinary credentials (optional, for cloud image hosting)

3. **Database Setup**:
   - Ensure MongoDB is running
   - The application will automatically create collections on first run

4. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/feature` - Toggle featured status

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist by ID
- `POST /api/artists` - Create new artist
- `PUT /api/artists/:id` - Update artist
- `DELETE /api/artists/:id` - Delete artist
- `GET /api/artists/:id/stats` - Get artist statistics

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/product` - Upload product with images
- `GET /api/upload/status` - Check upload service status

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/products` - Get all products for admin
- `GET /api/admin/artists` - Get all artists for admin
- `PATCH /api/admin/products/:id/toggle-active` - Toggle product status
- `PATCH /api/admin/artists/:id/toggle-verification` - Toggle artist verification
- `POST /api/admin/products/bulk-action` - Bulk product operations
- `GET /api/admin/stats` - Get system statistics

## Admin Interface

Access the admin interface at: `http://localhost:5000/admin.html`

Features:
- Upload new products with images
- Manage existing products (activate/deactivate, feature/unfeature)
- Manage artists (verify/unverify)
- View system statistics
- Bulk operations

## File Upload

The system supports:
- Multiple image uploads (up to 5 images per product)
- Image validation (JPEG, PNG, GIF, WebP)
- File size limit: 10MB per image
- Automatic artist creation if not exists
- Image preview in admin interface

## Database Schema

### Artist Model
- Basic info: name, username, email, bio
- Social links: Instagram, Twitter, website
- Specialties: Array of categories
- Statistics: sales, rating, reviews
- Verification status

### Product Model
- Basic info: name, description, price
- Artist reference (ObjectId)
- Images: Array with URLs and metadata
- Category and tags
- Print type and dimensions
- Limited edition information
- Statistics: sales, views, likes
- Status flags: active, featured

## Integration with Frontend

The backend is designed to work with the React frontend:

1. **CORS Configuration**: Configured for `http://localhost:3000`
2. **Image Serving**: Static file serving for uploaded images
3. **API Structure**: RESTful endpoints matching frontend requirements
4. **Featured Products**: Endpoint for homepage featured products

## Development

### Adding New Features

1. Create new routes in `routes/` directory
2. Add corresponding models if needed
3. Update server.js to include new routes
4. Test with Postman or similar tool

### Database Migrations

For schema changes:
1. Update the model files
2. Test with existing data
3. Consider migration scripts for production

## Production Deployment

1. Set up environment variables
2. Configure MongoDB connection
3. Set up image hosting (Cloudinary recommended)
4. Configure CORS for production domain
5. Set up proper logging and monitoring

## Security Considerations

- Input validation on all endpoints
- File type and size validation
- CORS configuration
- Environment variable protection
- Database connection security

## Support

For issues or questions, please refer to the main project documentation or create an issue in the repository. 