# 🏥 SmartRealisation Backend - MediLink Platform

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A comprehensive medication linkage platform built with NestJS, connecting patients with pharmacies in Cameroon through intelligent search and real-time availability tracking.
</p>

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

## 📋 Description

**SmartRealisation** is a cutting-edge medication linkage platform designed to revolutionize healthcare access in Cameroon. Our backend API provides:

- **Real-time pharmacy search** with geolocation-based availability tracking
- **Intelligent medication matching** across pharmacy networks
- **Stock alert system** for critical medications
- **Comprehensive analytics** for healthcare administrators
- **Multi-language support** (French/English) for accessibility
- **Secure user management** for patients, pharmacists, and administrators

### Key Features

🔍 **Smart Search**: Location-based medication search with real-time stock verification
📊 **Analytics Dashboard**: Comprehensive insights for healthcare administrators
🔔 **Stock Alerts**: Automated notifications for medication availability
🏪 **Pharmacy Network**: Centralized management of pharmacy partnerships
💊 **Medication Database**: Structured catalog with therapeutic categories
🌍 **Geolocation Services**: GPS-based proximity calculations
🔒 **Security First**: JWT authentication with role-based access control
+++++++ REPLACE</parameter>

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SmartRealisationX2026/SmartRealisation_Backend.git
   cd SmartRealisation_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize database**
   ```bash
   # Create database and user
   bash prisma/scripts/init-db.sh

   # Generate Prisma client
   npm run db:generate

   # Run migrations
   npm run db:migrate

   # Seed with test data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

### Database Scripts

```bash
# View database in browser
npm run db:studio

# Reset database (⚠️ DELETES ALL DATA)
npm run db:reset

# Validate database structure
psql -d medilink_db -f prisma/scripts/validate.sql
```
+++++++ REPLACE</parameter>

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
