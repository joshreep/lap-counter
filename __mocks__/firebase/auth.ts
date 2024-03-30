export const onAuthStateChanged = jest.fn()

export const signInWithEmailAndPassword = jest.fn().mockResolvedValue({})

export const signOut = jest.fn().mockResolvedValue(undefined)

export const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({})

export const sendPasswordResetEmail = jest.fn().mockResolvedValue(undefined)
