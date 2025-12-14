export const UserReponseDto = {
  id: true,
  email: true,
  passwordHash: false, // Ne jamais exposer le hash du mot de passe
  role: true,
  fullName: true,
  phone: true,
  preferredLanguage: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
}
