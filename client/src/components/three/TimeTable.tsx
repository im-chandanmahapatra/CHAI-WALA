import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Era = 'adda' | 'cafe' | 'now';
const colours = { adda: '#b27640', cafe: '#674236', now: '#91a568' };

function Table({ era, quiet, opening }: { era: Era; quiet: boolean; opening: boolean }) {
  const vessel = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const table = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const points = useMemo(() => [new THREE.Vector2(.43, 0), new THREE.Vector2(.49, .05), new THREE.Vector2(.63, 1.25), new THREE.Vector2(.60, 1.3), new THREE.Vector2(.56, 1.25), new THREE.Vector2(.44, .12)], []);
  useEffect(() => {
    if (!vessel.current || quiet) return;
    const animation = gsap.fromTo(vessel.current.position, { y: .42 }, { y: .08, duration: .75, ease: 'power3.out', onUpdate: invalidate });
    return () => { animation.kill(); };
  }, [era, quiet, invalidate]);
  useEffect(() => {
    if (!table.current || quiet) return;
    const scene = gsap.to(table.current.rotation, { y: .1, ease: 'none', onUpdate: invalidate, scrollTrigger: { trigger: '.table-hero', start: 'top top', end: 'bottom top', scrub: .6 } });
    return () => { scene.scrollTrigger?.kill(); scene.kill(); };
  }, [quiet, invalidate]);
  useEffect(() => {
    if (!stream.current || !opening || quiet || era !== 'adda') return;
    const material = stream.current.material as THREE.MeshStandardMaterial;
    const pour = gsap.timeline({ onUpdate: invalidate });
    pour.fromTo(material, { opacity: 0 }, { opacity: .9, duration: .2 }).to(material, { opacity: 0, duration: .3 }, .9);
    return () => { pour.kill(); };
  }, [opening, quiet, era, invalidate]);
  return <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[-3, 7, 3]} intensity={4} castShadow shadow-mapSize={[1024, 1024]} shadow-normalBias={.04} />
    <directionalLight position={[4, 3, -2]} intensity={1.4} color="#fff1da" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -.1, 0]}><planeGeometry args={[200, 200]} /><meshStandardMaterial color={era === 'adda' ? '#c7ad8b' : era === 'cafe' ? '#bba29d' : '#d3d3c0'} roughness={.9} /></mesh>
    <group ref={table} rotation={[0, -.2, 0]}>
      {opening && !quiet && era === 'adda' && <mesh ref={stream} position={[0, 2.65, 0]}><cylinderGeometry args={[.045, .065, 3, 12]} /><meshStandardMaterial color="#b27640" transparent opacity={0} roughness={.3} /></mesh>}
      <mesh receiveShadow position={[0, -.015, 0]}><cylinderGeometry args={[.94, .94, .12, 80]} /><meshStandardMaterial color="#542b30" roughness={.85} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .05, 0]}><ringGeometry args={[.81, .825, 80]} /><meshStandardMaterial color="#e8d4b9" /></mesh>
      <group ref={vessel} position={[0, .08, 0]}>
        <mesh castShadow receiveShadow><latheGeometry args={[points, 80]} /><meshPhysicalMaterial color={era === 'cafe' ? '#f5e9d9' : '#d9e6da'} roughness={era === 'cafe' ? .25 : .12} metalness={0} transparent={era !== 'cafe'} opacity={era === 'cafe' ? 1 : .38} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, .57, 0]} castShadow><cylinderGeometry args={[.568, .44, 1.05, 64]} /><meshStandardMaterial color={colours[era]} roughness={.3} /></mesh>
        <mesh position={[0, 1.102, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.57, 64]} /><meshStandardMaterial color={era === 'cafe' ? '#e2c49e' : colours[era]} roughness={.32} /></mesh>
        {era === 'cafe' && <mesh position={[.68, .72, 0]} rotation={[0, 0, -.3]} castShadow><torusGeometry args={[.34, .105, 16, 40]} /><meshStandardMaterial color="#f5e9d9" roughness={.25} /></mesh>}
        {era === 'now' && [-1, 0, 1].map((n) => <RoundedBox key={n} args={[.3, .22, .28]} radius={.035} position={[n * .25, 1.17, n * .13]} rotation={[.1, n * .6, .1]}><meshPhysicalMaterial color="#e7f0df" transparent opacity={.65} roughness={.12} /></RoundedBox>)}
      </group>
      <mesh position={[1.8, .01, .6]} receiveShadow><cylinderGeometry args={[.65, .53, .075, 64]} /><meshStandardMaterial color={era === 'now' ? '#acaaa1' : '#eee4d2'} metalness={era === 'now' ? .7 : .05} roughness={.4} /></mesh>
      {[0, 1].map(n => <RoundedBox key={n} args={[.66, .11, .4]} radius={.055} position={[1.8, .11 + n * .12, .6]} rotation={[0, n * .35, 0]} castShadow><meshStandardMaterial color="#b8793f" roughness={1} /></RoundedBox>)}
      <RoundedBox args={[1.1, .055, 1.5]} radius={.015} position={[-1.8, -.025, -.6]} rotation={[0, -.3, 0]} receiveShadow><meshStandardMaterial color={era === 'cafe' ? '#354ca2' : '#e8dac2'} roughness={.95} /></RoundedBox>
    </group>
  </>;
}

class SceneBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function TimeTable({ era, opening = false }: { era: Era; opening?: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [quiet, setQuiet] = useState(true);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setQuiet(preference.matches);
    update(); preference.addEventListener('change', update);
    try { const canvas = document.createElement('canvas'); const gl = canvas.getContext('webgl2'); setEnabled(!!gl); gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch { setEnabled(false); }
    return () => preference.removeEventListener('change', update);
  }, []);
  return <div className="time-table" aria-label={`${era === 'adda' ? 'Cutting chai' : era === 'cafe' ? 'Coffee' : 'Iced matcha'} on the Chaiwala table`} role="img">
    <img className="table-fallback" src={`/images/campaign/table-${era}-v2.jpg`} alt="" />
    {enabled && <SceneBoundary><Suspense fallback={null}><Canvas shadows frameloop="demand" dpr={[1, 1.5]} camera={{ position: [4, 4.6, 6], fov: 34 }} gl={{ antialias: true, powerPreference: 'low-power' }}><Table era={era} quiet={quiet} opening={opening} /></Canvas></Suspense></SceneBoundary>}
    <span className="table-caption">THE SAME TABLE. A DIFFERENT TIME.</span>
  </div>;
}
