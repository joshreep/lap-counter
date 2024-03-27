import { RunnerRow } from '@/database/types'
import { ListRenderItem } from 'react-native'
import { Link } from 'expo-router'
import { Cell, Row } from './RunnerRowListItem.style'

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
