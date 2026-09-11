import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import phoneUrl from '@/assets/3d/iphone.glb'

/** User's phone glTF model, kept in its own baked materials (body/buttons/screen). */
function PhoneModel({
  reduce,
  interactive,
  getProgress,
}: {
  reduce: boolean
  interactive: boolean
  getProgress: () => number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const scaleRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(phoneUrl)

  const { model, baseScalar } = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false
        child.receiveShadow = false
        const mat = child.material
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.metalness = Math.min(mat.metalness, 0.35)
          mat.roughness = Math.max(mat.roughness, 0.25)
        }
      }
    })

    // Compute bounding box to normalize diverse glTF unit scales
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    // Scale normalized so maximum bounding dimension is ~2.2 units in Three.js space
    const baseScalar = maxDim > 0 ? 2.2 / maxDim : 1

    return { model: cloned, baseScalar }
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current || !scaleRef.current) return

    // Read live progress from GSAP-driven scroll progress
    const tilt = reduce ? 0 : Math.min(Math.max(getProgress(), 0), 1)

    // Pointer-follow parallax on top of the scroll-driven sweep
    const pointerYaw = interactive ? state.pointer.x * 0.24 : 0
    const pointerPitch = interactive ? state.pointer.y * -0.1 : 0

    // Ambient floating levitation (barely-perceptible hover — taste-skill: purposeful motion only)
    const breath = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.75) * 0.001

    // Resting pose: lying screen-up on the desk
    const restX = -0.68
    const standX = -0.12
    const targetX = restX + tilt * (standX - restX) + pointerPitch
    const targetY = 0.22 + tilt * 0.58 + pointerYaw

    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08
    groupRef.current.position.y += (breath - groupRef.current.position.y) * 0.08

    // Target scale increases dynamically as phone stands up into inspect mode
    const targetScale = baseScalar * (1.0 + tilt * 0.25)
    scaleRef.current.scale.setScalar(
      scaleRef.current.scale.x + (targetScale - scaleRef.current.scale.x) * 0.08,
    )
  })

  return (
    <group ref={scaleRef} scale={baseScalar}>
      <group ref={groupRef} rotation={[-0.68, 0.22, 0]}>
        <Center>
          <primitive object={model} />
        </Center>
      </group>
    </group>
  )
}

/**
 * User's phone glTF model rendered with react-three-fiber. Rests nearly flat as
 * if placed on the desk (with a soft contact shadow grounding it), lifts toward a
 * 3/4 angle and grows slightly as getProgress() increases (driven by the
 * caller — typically scroll position through the pinned hero+reveal span), and
 * tilts toward the cursor on top of that. Static resting pose under reduced motion.
 */
export function HeroDeviceModel({
  className,
  getProgress,
}: {
  className?: string
  getProgress?: () => number
}) {
  const reduce = usePrefersReducedMotion()
  const fallbackGetProgress = () => {
    const span = Math.max(window.innerHeight * 1.5, 1)
    return window.scrollY / span
  }

  return (
    <div className={className} aria-hidden>
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ position: [2.6, 2.4, 3.6], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 4, 4]} intensity={1.2} />
          <directionalLight position={[-3, 2, -2]} intensity={0.5} />
          <PhoneModel reduce={reduce} interactive={!reduce} getProgress={getProgress ?? fallbackGetProgress} />
          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.55}
            scale={6}
            blur={2.5}
            far={2}
            resolution={256}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
