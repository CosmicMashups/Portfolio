export const motionEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: motionEase },
  },
}

export const staggerChildren = (gap = 0.06) => ({
  show: { transition: { staggerChildren: gap } },
})
