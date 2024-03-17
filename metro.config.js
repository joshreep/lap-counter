// Learn more https://docs.expo.io/guides/customizing-metro
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
// @ts-expect-error it's complaining that config.resolver might be undefined
config.resolver.resolverMainFields = ['react-native', 'browser', 'main']

config.resolver?.assetExts?.push('cjs')

config.resolver.extraNodeModules['@firebase/auth'] = '@firebase/auth/react-native'

module.exports = config
