import '@testing-library/react-native/extend-expect'
import '@testing-library/jest-native/extend-expect'

jest.mock('react-native-reanimated', () => null, { virtual: true })
jest.mock('@testing-library/jest-native/extend-expect', () => null, { virtual: true })
