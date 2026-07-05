export type Vec3 = [number, number, number]

function dist(a: Vec3, b: Vec3) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

export function pathLength(points: Vec3[]) {
  let total = 0
  for (let i = 1; i < points.length; i++) total += dist(points[i - 1], points[i])
  return total || 1
}

/** Returns { position, heading } for progress t in [0,1] along the polyline. */
export function samplePath(points: Vec3[], t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  const total = pathLength(points)
  const target = clamped * total
  let travelled = 0

  for (let i = 1; i < points.length; i++) {
    const segLen = dist(points[i - 1], points[i])
    if (travelled + segLen >= target || i === points.length - 1) {
      const segT = segLen === 0 ? 0 : (target - travelled) / segLen
      const a = points[i - 1]
      const b = points[i]
      const position: Vec3 = [
        a[0] + (b[0] - a[0]) * segT,
        a[1] + (b[1] - a[1]) * segT,
        a[2] + (b[2] - a[2]) * segT
      ]
      const heading = Math.atan2(b[0] - a[0], b[2] - a[2])
      return { position, heading }
    }
    travelled += segLen
  }

  const last = points[points.length - 1]
  return { position: last, heading: 0 }
}
