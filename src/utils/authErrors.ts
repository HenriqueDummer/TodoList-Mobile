import { FirebaseError } from 'firebase/app'

import { getApiErrorMessage } from '@/services/api'

const firebaseErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Este email já está em uso.',
  'auth/invalid-credential': 'Email ou senha inválidos.',
  'auth/invalid-email': 'Email inválido.',
  'auth/network-request-failed': 'Falha de conexão. Tente novamente.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/user-not-found': 'Email ou senha inválidos.',
  'auth/wrong-password': 'Email ou senha inválidos.',
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return (
      firebaseErrorMessages[error.code] ??
      'Não foi possível autenticar. Tente novamente.'
    )
  }

  return getApiErrorMessage(error)
}
