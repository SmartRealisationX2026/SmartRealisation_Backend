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