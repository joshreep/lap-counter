export interface RunnerRow extends InputRunnerRow {
  lapCount: number
}

export interface InputRunnerRow {
  runnerId: string
  name?: string
  lapCount?: number
}
