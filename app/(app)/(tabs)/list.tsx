import RunnerRowListItem from '@/components/RunnerRowListItem'
import { View } from '@/components/Themed'
import { QueryStatus, useRunners } from '@/database/db-service'
import { FlatList, RefreshControl } from 'react-native'
import styled from 'styled-components/native'

export default function ListTabScreen() {
  const { data, refreshData, status } = useRunners()

  return (
    <Container>
      <FlatList
        data={data}
        renderItem={RunnerRowListItem}
        refreshControl={<RefreshControl refreshing={status === QueryStatus.Loading} onRefresh={refreshData} />}
      />
    </Container>
  )
}

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
  background-color: ${({ theme }) => theme.colors.rootBackground};
`
