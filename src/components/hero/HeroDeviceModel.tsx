import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '@/app/providers/usePrefersReducedMotion'
import phoneUrl from '@/assets/3d/phone.glb'

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

  const model = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false
        child.receiveShadow = false
        // The source glTF materials leave metalness at its glTF-spec default (1.0)
        // with no environment map, which three.js renders as near-black. Clamp it
        // so the baked textures read correctly under plain directional lighting.
        const mat = child.material
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.metalness = Math.min(mat.metalness, 0.3)
        }
      }
    })
    return cloned
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current || !scaleRef.current) return

    // Read live progress every frame — R3F's frame loop runs independently of
    // React re-renders, so calling the getter (not a value captured via
    // props/state) is what keeps the angle live while scrolling, both directions.
    const tilt = reduce ? 0 : Math.min(Math.max(getProgress(), 0), 1)

    // Pointer-follow parallax on top of the scroll-driven sweep.
    const pointerYaw = interactive ? state.pointer.x * 0.3 : 0
    const pointerPitch = interactive ? state.pointer.y * -0.12 : 0

    // Resting pose: nearly flat, as if lying screen-up on the desk (top-down photo
    // read). Scrolling lifts it toward a 3/4 standing angle for the reveal section.
    const restX = -0.7
    const standX = -0.1
    const targetX = restX + tilt * (standX - restX) + pointerPitch
    const targetY = 0.25 + tilt * 0.55 + pointerYaw

    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.07
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.07

    const targetScale = 0.48 + tilt * 0.16
    scaleRef.current.scale.setScalar(
      scaleRef.current.scale.x + (targetScale - scaleRef.current.scale.x) * 0.07,
    )
  })

  return (
    <group ref={scaleRef} scale={0.48}>
      <group ref={groupRef} rotation={[-0.7, 0.25, 0]}>
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
 * 3/4 angle and grows slightly as `getProgress()` increases (driven by the
 * caller — typically scroll position through the pinned hero+reveal span), and
 * tilts toward the cursor on top of that. Static resting pose under reduced
 * motion. `getProgress` defaults to a plain whole-page scroll fraction when the
 * caller doesn't supply one.
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
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 4, 4]} intensity={1.1} />
          <directionalLight position={[-3, 2, -2]} intensity={0.4} />
          <PhoneModel reduce={reduce} interactive={!reduce} getProgress={getProgress ?? fallbackGetProgress} />
          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.5}
            scale={6}
            blur={2.4}
            far={2}
            resolution={256}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
