# 🧪 Tests - Documentation des Tests

## 📋 Vue d'ensemble

Le répertoire `test/` contient tous les tests de l'application, incluant les tests unitaires, d'intégration et end-to-end (e2e).

## 🎯 Principe

Les tests permettent de :
- **Valider** le comportement de l'application
- **Détecter** les régressions
- **Documenter** l'utilisation des composants
- **Garantir** la qualité du code

## 📂 Structure

```
test/
├── app.e2e-spec.ts          # Tests e2e de l'application
├── jest-e2e.json            # Configuration Jest pour e2e
├── user/                     # Tests pour le module User
│   ├── user.controller.spec.ts
│   └── user.service.spec.ts
└── auth/                     # Tests pour le module Auth
    ├── auth.controller.spec.ts
    └── auth.service.spec.ts
```

## 🧪 Types de tests

### 1. **Tests Unitaires**

Testent des composants isolés (services, repositories, etc.).

**Exemple** : `user/user.service.spec.ts`
```typescript
describe('UserFactoryService', () => {
  let service: UserFactoryService;
  let repository: UserRepository;

  beforeEach(() => {
    repository = {
      findOne: jest.fn(),
      create: jest.fn(),
      // ...
    };
    service = new UserFactoryService(repository);
  });

  it('should find a user by id', async () => {
    const user = { id: '1', email: 'test@test.com' };
    repository.findOne = jest.fn().mockResolvedValue(user);
    
    const result = await service.findOne('1');
    
    expect(result).toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith('1');
  });
});
```

### 2. **Tests d'Intégration**

Testent l'interaction entre plusieurs composants.

### 3. **Tests End-to-End (e2e)**

Testent l'application complète depuis les endpoints HTTP.

**Exemple** : `app.e2e-spec.ts`
```typescript
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/user')
      .expect(200);
  });
});
```

## 🚀 Exécution des tests

### Tous les tests
```bash
npm test
```

### Tests en mode watch
```bash
npm run test:watch
```

### Tests e2e
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:cov
```

### Tests en mode debug
```bash
npm run test:debug
```

## ✅ Bonnes pratiques

### ✅ À faire
- Tester tous les cas (succès, erreurs, cas limites)
- Utiliser des mocks pour isoler les composants
- Nommer les tests de manière descriptive
- Maintenir un bon taux de couverture (>80%)

### ❌ À éviter
- Tester l'implémentation plutôt que le comportement
- Créer des tests trop complexes
- Oublier de nettoyer après les tests
- Ignorer les tests qui échouent

## 📝 Structure d'un test

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Initialisation
  });

  // Tests
  it('should do something', () => {
    // Arrange
    const input = 'value';
    
    // Act
    const result = component.method(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## 🔗 Liens

- [Jest Documentation](https://jestjs.io/) - Documentation Jest
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing) - Guide de test NestJS

