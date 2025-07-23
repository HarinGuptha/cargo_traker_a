# Deployment Guide

This guide covers various deployment options for the Cargo Shipment Tracker application.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v16+ 
- MongoDB (local or Atlas)
- Git

### Setup Steps

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd cargo_traker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment
   npm run dev           # Start in development mode
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Seed Database** (optional)
   ```bash
   cd backend
   node seedData.js
   ```

5. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and Start All Services**
   ```bash
   docker-compose up -d
   ```

2. **Seed Database**
   ```bash
   docker-compose exec backend node seedData.js
   ```

3. **Access Application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Individual Container Deployment

1. **Build Images**
   ```bash
   # Backend
   cd backend
   docker build -t cargo-tracker-api .
   
   # Frontend
   cd ../frontend
   docker build -t cargo-tracker-web .
   ```

2. **Run Containers**
   ```bash
   # MongoDB
   docker run -d --name mongo -p 27017:27017 mongo:7.0
   
   # Backend
   docker run -d --name api -p 5000:5000 \
     -e MONGODB_URI=mongodb://host.docker.internal:27017/cargo_tracker \
     cargo-tracker-api
   
   # Frontend
   docker run -d --name web -p 80:80 cargo-tracker-web
   ```

## ☁️ Cloud Deployment

### Heroku Deployment

#### Backend (API)

1. **Create Heroku App**
   ```bash
   heroku create cargo-tracker-api
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   ```

3. **Deploy**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a cargo-tracker-api
   git push heroku main
   ```

#### Frontend (Web App)

1. **Update API URL**
   ```javascript
   // src/store/slices/shipmentSlice.js
   const API_BASE_URL = 'https://cargo-tracker-api.herokuapp.com/api';
   ```

2. **Deploy to Netlify/Vercel**
   ```bash
   npm run build
   # Upload dist/ folder to Netlify
   # Or connect GitHub repo to Vercel
   ```

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Push Images to ECR**
   ```bash
   # Create ECR repositories
   aws ecr create-repository --repository-name cargo-tracker-api
   aws ecr create-repository --repository-name cargo-tracker-web
   
   # Build and push images
   docker build -t cargo-tracker-api ./backend
   docker tag cargo-tracker-api:latest <account>.dkr.ecr.<region>.amazonaws.com/cargo-tracker-api:latest
   docker push <account>.dkr.ecr.<region>.amazonaws.com/cargo-tracker-api:latest
   ```

2. **Create ECS Task Definition**
   ```json
   {
     "family": "cargo-tracker",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "api",
         "image": "<account>.dkr.ecr.<region>.amazonaws.com/cargo-tracker-api:latest",
         "portMappings": [{"containerPort": 5000}],
         "environment": [
           {"name": "NODE_ENV", "value": "production"},
           {"name": "MONGODB_URI", "value": "your_mongodb_atlas_uri"}
         ]
       }
     ]
   }
   ```

#### Using AWS Elastic Beanstalk

1. **Prepare Application**
   ```bash
   cd backend
   zip -r ../cargo-tracker-api.zip . -x node_modules/\*
   ```

2. **Deploy via AWS Console**
   - Create new Elastic Beanstalk application
   - Choose Node.js platform
   - Upload zip file
   - Configure environment variables

### Digital Ocean App Platform

1. **Create App Spec**
   ```yaml
   name: cargo-tracker
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/cargo-tracker
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: your_mongodb_atlas_uri
   - name: web
     source_dir: /frontend
     github:
       repo: your-username/cargo-tracker
       branch: main
     build_command: npm run build
     run_command: npm run preview
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Sign up at https://cloud.mongodb.com
   - Create a free cluster
   - Configure network access (0.0.0.0/0 for development)

2. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/cargo_tracker
   ```

3. **Update Environment Variables**
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cargo_tracker
   ```

### Self-Hosted MongoDB

1. **Docker Deployment**
   ```bash
   docker run -d \
     --name mongodb \
     -p 27017:27017 \
     -v mongo_data:/data/db \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD=password \
     mongo:7.0
   ```

2. **Connection String**
   ```
   mongodb://admin:password@localhost:27017/cargo_tracker?authSource=admin
   ```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
```

#### Frontend
```javascript
// Update in src/store/slices/shipmentSlice.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api'
  : 'http://localhost:5000/api';
```

## 🔒 Security Considerations

### Production Checklist

- [ ] Use HTTPS for all communications
- [ ] Set up proper CORS configuration
- [ ] Use environment variables for sensitive data
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting
- [ ] Configure proper error handling
- [ ] Use secure headers (helmet.js)
- [ ] Set up monitoring and logging

### Security Headers
```javascript
// Add to backend server.js
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Add Health Check Endpoint**
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
   });
   ```

2. **Logging with Winston**
   ```bash
   npm install winston
   ```

3. **Error Tracking with Sentry**
   ```bash
   npm install @sentry/node
   ```

### Database Monitoring

- Monitor connection pool usage
- Set up alerts for slow queries
- Track database performance metrics
- Regular backup procedures

## 🚀 Performance Optimization

### Backend Optimizations

- Enable gzip compression
- Implement caching with Redis
- Database indexing
- Connection pooling
- API response pagination

### Frontend Optimizations

- Code splitting
- Image optimization
- Bundle size analysis
- CDN for static assets
- Service worker for caching

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend && npm ci
        cd ../frontend && npm ci
    
    - name: Run tests
      run: |
        cd backend && npm test
        cd ../frontend && npm test
    
    - name: Build frontend
      run: cd frontend && npm run build
    
    - name: Deploy to production
      run: |
        # Your deployment commands here
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend API URL

2. **Database Connection Issues**
   - Check MongoDB URI format
   - Verify network access in MongoDB Atlas
   - Check firewall settings

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

4. **Performance Issues**
   - Check database indexes
   - Monitor API response times
   - Analyze bundle size

### Debug Commands

```bash
# Check application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Test API endpoints
curl -X GET http://localhost:5000/api/shipments
curl -X GET http://localhost:5000/health

# Check database connection
mongosh "your_mongodb_uri"
```

This deployment guide covers the most common deployment scenarios. Choose the option that best fits your infrastructure and requirements.
