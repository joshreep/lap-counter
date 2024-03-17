import styled from 'styled-components/native'
import { View } from './Themed'
import LottieView from 'lottie-react-native'

export const ButtonGroup = styled(View)`
  flex-direction: row;
  background-color: transparent;
  justify-content: space-around;
`

export const BaseAnimation = styled(LottieView).attrs({ autoPlay: true })`
  width: 200px;
  height: 200px;
`
export const CheckAnimation = styled(BaseAnimation).attrs({ loop: false })``
export const LoadingAnimation = styled(BaseAnimation).attrs({ loop: true })``
