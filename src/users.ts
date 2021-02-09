export interface User {
  disabled: boolean
  email: string
  emailVerified: boolean
  id: string
  phoneNumber: string
  photoUrl: string
  name: string

  // Custom claims
  isTeacher: boolean,
  isAdmin: boolean,
  phoneNumberIsVerified: boolean,
}

export function extractUserFromToken(token: any): User {

  return {
    id: token.user_id ?? '',
    photoUrl: token.picture ?? '',
    email: token.email ?? '',
    emailVerified: Boolean(token.email_verified),
    phoneNumber: token.phone_number ?? '',
    disabled: false,

    // Note that the display name is not available from an idToken!
    name: '',

    // Custom claims
    isTeacher: Boolean(token?.isTeacher),
    isAdmin: Boolean(token?.isAdmin),
    phoneNumberIsVerified: Boolean(token?.phoneNumberIsVerified),
  }
}

export function extractUserFromRecord(record: any): User {
  return {
    id: record.uid,
    photoUrl: record.photoURL ?? '',
    email: record.email ?? '',
    name: record.displayName ?? '',
    emailVerified: record.emailVerified,
    phoneNumber: record.phoneNumber ?? '',
    disabled: Boolean(record.disabled),

    // Custom claims
    isTeacher: Boolean(record.customClaims?.isTeacher),
    isAdmin: Boolean(record.customClaims?.isAdmin),
    phoneNumberIsVerified: Boolean(record.customClaims?.phoneNumberIsVerified),
  }
}