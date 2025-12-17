import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('API Integration Tests (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Search Endpoints', () => {
        it('GET /search - should validate required query params', () => {
            return request(app.getHttpServer())
                .get('/search')
                .expect(400); // Missing required userLat/userLng
        });

        it('GET /search/nearby - should validate required query params', () => {
            return request(app.getHttpServer())
                .get('/search/nearby')
                .expect(400); // Missing required userLat/userLng
        });
    });

    describe('Admin Analytics Endpoints', () => {
        it('GET /admin-analytics/dashboard - should return dashboard data', () => {
            return request(app.getHttpServer())
                .get('/admin-analytics/dashboard')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('overview');
                    expect(res.body.overview).toHaveProperty('totalUsers');
                    expect(res.body.overview).toHaveProperty('activePharmacies');
                });
        });

        it('GET /admin-analytics/trends - should return global trends', () => {
            return request(app.getHttpServer())
                .get('/admin-analytics/trends')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('topMedications');
                    expect(res.body).toHaveProperty('activeCities');
                });
        });
    });

    describe('Pharmacy Endpoints', () => {
        it('GET /pharmacies - should return list of pharmacies', () => {
            return request(app.getHttpServer())
                .get('/pharmacies')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                });
        });
    });
});
