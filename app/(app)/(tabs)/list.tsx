import RunnerRowListItem from '@/components/RunnerRowListItem'
import { View } from '@/components/Themed'
import { QueryStatus, useRunners } from '@/database/db-service'
import usePrevious from '@joshreep/captain-hooks/dist/usePrevious'
import { ActivityIndicator, FlatList } from 'react-native'
import styled from 'styled-components/native'

export default function ListTabScreen() {
  const { data, refreshData, status } = useRunners()
  const previousStatus = usePrevious(status)

  const isLoading = !previousStatus && status === QueryStatus.Loading
  const isReloading = !!previousStatus && status === QueryStatus.Loading

  return (
    <Container>
      {isLoading && <ActivityIndicator animating size="large" />}
      <FlatList
        data={data}
        keyExtractor={(item) => item.runnerId}
        ListFooterComponent={() => null}
        onRefresh={refreshData}
        refreshing={isReloading}
        renderItem={RunnerRowListItem}
      />
    </Container>
  )
}

const Container = styled(View).attrs({ rootBackground: true })`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
`
