export const apiBodySwagger_verifyAuth = {
  schema: {
    type: 'object',
    properties: {
      otp: {
        type: 'string',
        description: 'Code OTP pour la validation',
        example: '123456'
      },
      id: {
        type: 'string',
        description: 'ID de l\'utilisateur',
        example: '123e4567-e89b-12d3-a456-426614174000'
      }
    },
    required: ['otp', 'id']
  }
};

export const apiBodySwagger_login = {
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Entrer une adresse email',
        example: 'johndoe@example.com'
      },
      password: {
        type: 'string',
        description: 'Entrer un mot de passe',
        example: '*************'
      }
    },
    required: ['email', 'password']
  }
};

export const apiBodySwagger_register = {
  schema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        description: 'Nom complet de l\'utilisateur',
        example: 'John Doe'
      },
      role: {
        type: 'string',
        enum: ['PATIENT', 'PHARMACIST', 'ADMIN'],
        description: 'Rôle de l\'utilisateur',
        example: 'PATIENT'
      },
      phone: {
        type: 'string',
        description: 'Numéro de téléphone (format camerounais)',
        example: '+237 6XX XXX XXX'
      },
      preferredLanguage: {
        type: 'string',
        enum: ['FR', 'EN'],
        description: 'Langue préférée de l\'utilisateur',
        example: 'FR'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Adresse email de l\'utilisateur',
        example: 'johndoe@example.com'
      },
      passwordHash: {
        type: 'string',
        description: 'Mot de passe hashé de l\'utilisateur',
        example: '*************'
      }
    },
    required: ['fullName', 'role', 'preferredLanguage', 'email', 'passwordHash']
  }
};