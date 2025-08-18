# Home4Paws Platform

A comprehensive pet adoption and marketplace platform built with modern technologies.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: .NET 8 Web API with Clean Architecture
- **Database**: PostgreSQL
- **Deployment**: Docker containers

## 🚀 Quick Start

### Development Environment

1. **Clone the repository**
   `git clone https://github.com/sithummadhuranga/home4paws-platform.git`
   `cd home4paws-platform`

2. **Set up environment variables**
   `Copy-Item .env.example -Destination .env`
   
3. **Start with Docker**
   `docker-compose up -d postgres`
   
4. **Start Frontend**
   `cd frontend`
   `npm install`
   `npm run dev`
   
5. **Start Backend**
   `cd backend/Home4Paws.API`
   `dotnet run`

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger Documentation: http://localhost:5000/swagger

## 🎯 Team Members

- **Leader**: sithummadhuranga
- **Frontend Developer**: [Name]
- **Backend Developer**: [Name]
- **DevOps/Full-stack**: [Name]

## 📋 Project Status

Current Sprint: Foundation Setup (Week 0)

### Completed ✅
- [x] Repository structure setup
- [x] Development environment configuration
- [x] Docker containerization
- [x] CI/CD pipeline setup

### In Progress 🔄
- [ ] Database schema design
- [ ] Authentication system
- [ ] Basic UI components

### Upcoming 📝
- [ ] Pet listing functionality
- [ ] User management
- [ ] Marketplace features

## 🛠️ Development

### Branch Strategy
- `main` - Production ready code
- `develop` - Integration branch
- `feature/*` - Feature development

### Coding Standards
- Frontend: ESLint + Prettier
- Backend: .NET conventions
- Commits: Conventional commits

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
