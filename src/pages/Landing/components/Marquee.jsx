import { useEffect, useRef } from 'react'

// Marquee controlado por rAF com desaceleração suave no hover
export default function Marquee({ items }) {
  const trackRef = useRef(null)
  const s = useRef({ pos: 0, speed: 0.5, target: 0.5, halfW: 0, raf: null })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    s.current.halfW = track.scrollWidth / 2

    function tick() {
      const st = s.current
      st.speed += (st.target - st.speed) * 0.04
      st.pos -= st.speed
      if (Math.abs(st.pos) >= st.halfW) st.pos = 0
      track.style.transform = `translateX(${st.pos}px)`
      st.raf = requestAnimationFrame(tick)
    }
    s.current.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(s.current.raf)
  }, [])

  return (
    <div
      className="l-marquee-strip__track-wrap"
      onMouseEnter={() => { s.current.target = 0.08 }}
      onMouseLeave={() => { s.current.target = 0.5 }}
    >
      <div ref={trackRef} className="l-marquee-strip__track">
        {[...items, ...items].map((p, i) => (
          <span key={i} className="l-marquee-strip__item">
            <p.icon style={{ color: p.color }} />
            {p.name}
          </span>
        ))}
      </div>
    </div>
  )
}
