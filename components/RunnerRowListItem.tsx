import { RunnerRow } from '@/database/types'
import { Text } from './Themed'
import { ListRenderItem, Pressable } from 'react-native'
import styled from 'styled-components/native'
import { Link } from 'expo-router'

const RunnerRowListItem: ListRenderItem<RunnerRow> = ({ item }) => {
  return (
    <Link
      href={{
        pathname: '/edit-modal',
        params: { runnerId: item.runnerId, name: item.name ?? '', lapCount: item.lapCount },
      }}
      asChild
    >
      <Row>
        <Cell>{item.runnerId}</Cell>
        <Cell greedy>{item.name}</Cell>
        <Cell>
          {item.lapCount} lap{item.lapCount !== 1 && 's'}
        </Cell>
      </Row>
    </Link>
  )
}

export default RunnerRowListItem

const Row = styled(Pressable)`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
`

const Cell = styled(Text)<{ greedy?: boolean }>`
  padding: 10px 20px;
  font-size: 16px;
  flex-grow: ${({ greedy }) => (greedy ? 2 : 0)};
`
