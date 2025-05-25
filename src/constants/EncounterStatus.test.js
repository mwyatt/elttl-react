import '@testing-library/jest-dom'
import EncounterStatus from './EncounterStatus'

describe('EncounterStatus', () => {
  it('has doubles status', () => {
    expect(EncounterStatus.DOUBLES).toBe('doubles')
  })
})
