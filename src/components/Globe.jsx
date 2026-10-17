import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import './Globe.css';

const asset = name => `${import.meta.env.BASE_URL}images/${name}`;

export default function Globe() {
  const host = useRef(null);
  const actions = useRef({});
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let active = true, renderer, controls, observer;
    const resources = [];
    const dispose = () => {
      observer?.disconnect();
      controls?.dispose();
      resources.forEach(resource => resource.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
      actions.current = {};
    };
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30);
      camera.position.set(0, 0.25, 3.8);
      renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      el.appendChild(renderer.domElement);
      const geometry = new THREE.SphereGeometry(1, 64, 48);
      const material = new THREE.MeshPhongMaterial({color:0xffffff, shininess:5, specular:0x17343c});
      const earth = new THREE.Mesh(geometry, material);
      earth.rotation.y = -1.65;
      earth.rotation.z = 0.15;
      scene.add(earth);
      resources.push(geometry, material);
      scene.add(new THREE.AmbientLight(0xc5dbe5, 1.8));
      const sun = new THREE.DirectionalLight(0xfff3df, 2.4);
      sun.position.set(-3, 2, 5);
      scene.add(sun);
      const render = () => {if(active) renderer.render(scene, camera);};
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableDamping = false;
      controls.rotateSpeed = 0.55;
      controls.addEventListener('change', render);
      controls.saveState();
      actions.current = {
        reset:() => {earth.rotation.set(0, -1.65, 0.15); controls.reset(); render();},
        rotate:(dx,dy) => {
          earth.rotation.y += dx;
          earth.rotation.x = THREE.MathUtils.clamp(earth.rotation.x + dy, -1.2, 1.2);
          render();
        }
      };
      observer = new ResizeObserver(() => {
        const width = Math.max(el.clientWidth, 1);
        const height = Math.max(el.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        render();
      });
      observer.observe(el);
      new THREE.TextureLoader().load(asset('earth-texture.jpg'), texture => {
        if (!active) {texture.dispose(); return;}
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
        material.map = texture;
        material.needsUpdate = true;
        resources.push(texture);
        setStatus('ready');
        render();
      }, undefined, () => {if(active) setStatus('failed');});
      renderer.domElement.addEventListener('webglcontextlost', () => {if(active) setStatus('failed');});
      render();
    } catch {
      dispose();
      setStatus('failed');
    }
    return () => {active = false; dispose();};
  }, []);

  const onKeyDown = event => {
    const directions = {ArrowLeft:[-0.16,0],ArrowRight:[0.16,0],ArrowUp:[0,-0.12],ArrowDown:[0,0.12]};
    if (directions[event.key]) {
      event.preventDefault();
      actions.current.rotate?.(...directions[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      actions.current.reset?.();
    }
  };

  return <div className="three-globe-v2">
    <div ref={host} className="three-globe-v2-canvas" tabIndex={0} role="group"
      aria-label="Üç boyutlu Dünya. Sürükleyerek veya ok tuşlarıyla döndür. Home tuşuyla görünümü sıfırla."
      onKeyDown={onKeyDown}/>
    {status !== 'ready' && <div className="three-globe-v2-fallback">
      <img src={asset('earth.webp')} alt="Apollo 17 görevinde çekilen Dünya fotoğrafı"/>
      <span role="status">{status === 'failed' ? '3B görünüm bu cihazda açılamadı.' : 'Dünya hazırlanıyor…'}</span>
    </div>}
    {status === 'ready' && <div className="three-globe-v2-help">
      <span>Sürükle veya ok tuşlarıyla döndür</span>
      <button type="button" onClick={() => actions.current.reset?.()} aria-label="Küreyi başlangıç görünümüne döndür">↺</button>
    </div>}
  </div>;
}
