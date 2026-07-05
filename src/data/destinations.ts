import { Destination } from '../types'

// The rover's home / idle position, near the main atrium.
export const HOME_POSITION: [number, number, number] = [0, 0, 6]

const hub: [number, number, number] = [0, 0, 0]

export const DESTINATIONS: Destination[] = [
  {
    id: 'class-501',
    label: 'Class 501',
    department: 'CS Department',
    position: [-6, 0, -3],
    waypoints: [HOME_POSITION, hub, [-3, 0, -3], [-6, 0, -3]]
  },
  {
    id: 'class-502',
    label: 'Class 502',
    department: 'CS Department',
    position: [-9, 0, -3],
    waypoints: [HOME_POSITION, hub, [-3, 0, -3], [-9, 0, -3]]
  },
  {
    id: 'class-502b',
    label: 'Class 502B',
    department: 'CS Department',
    position: [-9, 0, -6],
    waypoints: [HOME_POSITION, hub, [-3, 0, -3], [-9, 0, -3], [-9, 0, -6]]
  },
  {
    id: 'class-503',
    label: 'Class 503',
    department: 'CS Department',
    position: [-13, 0, -3],
    waypoints: [HOME_POSITION, hub, [-3, 0, -3], [-13, 0, -3]]
  },
  {
    id: 'class-504',
    label: 'Class 504',
    department: 'CS Department',
    position: [-13, 0, -6],
    waypoints: [HOME_POSITION, hub, [-3, 0, -3], [-13, 0, -3], [-13, 0, -6]]
  },
  {
    id: 'cen-department',
    label: 'CEN Department',
    department: 'CEN Department',
    position: [9, 0, -5],
    waypoints: [HOME_POSITION, hub, [4, 0, -2], [9, 0, -5]]
  },
  {
    id: 'nutech-media',
    label: 'NUTech Media',
    department: 'NUTech Media',
    position: [0, 0, -15],
    waypoints: [HOME_POSITION, hub, [0, 0, -8], [0, 0, -15]]
  }
]

export const DEPARTMENT_GROUPS: { name: string; ids: string[] }[] = [
  {
    name: 'CS Department',
    ids: ['class-501', 'class-502', 'class-502b', 'class-503', 'class-504']
  },
  { name: 'CEN Department', ids: ['cen-department'] },
  { name: 'NUTech Media', ids: ['nutech-media'] }
]
