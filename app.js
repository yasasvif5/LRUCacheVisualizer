/***********************
 * Advanced Animated LRU Visualizer Logic
 * Enhanced with node movements, ghost nodes, particle effects, and sound
 ***********************/

/* ---------- Sound Effects ---------- */
class SoundManager {
  constructor() {
    this.enabled = false;
    this.sounds = {};
    this.initSounds();
  }

  initSounds() {
    // Create audio contexts and oscillators for different sounds
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Sound patterns
    this.soundPatterns = {
      hit: { frequency: 800, duration: 0.2, type: 'sine' },
      miss: { frequency: 300, duration: 0.3, type: 'sawtooth' },
      evict: { frequency: 200, duration: 0.5, type: 'square' },
      insert: { frequency: 600, duration: 0.3, type: 'triangle' },
      move: { frequency: 1000, duration: 0.15, type: 'sine' }
    };
  }

  playSound(type) {
    if (!this.enabled || !this.audioContext) return;
    
    const pattern = this.soundPatterns[type];
    if (!pattern) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(pattern.frequency, this.audioContext.currentTime);
      oscillator.type = pattern.type;
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + pattern.duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + pattern.duration);
    } catch (e) {
      console.log('Sound playback failed:', e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.enabled;
  }
}

/* ---------- Particle Effects ---------- */
class ParticleSystem {
  createEvictionParticles(element) {
    const rect = element.getBoundingClientRect();
    const containerRect = element.closest('.cache-container').getBoundingClientRect();
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.position = 'absolute';
    particleContainer.style.left = (rect.left - containerRect.left) + 'px';
    particleContainer.style.top = (rect.top - containerRect.top) + 'px';
    particleContainer.style.width = rect.width + 'px';
    particleContainer.style.height = rect.height + 'px';

    // Create 6 particles
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random direction and distance
      const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
      const distance = 80 + Math.random() * 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      
      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
      particle.style.left = '50%';
      particle.style.top = '50%';
      
      particleContainer.appendChild(particle);
    }

    element.closest('.cache-container').appendChild(particleContainer);

    // Remove particles after animation
    setTimeout(() => {
      if (particleContainer.parentNode) {
        particleContainer.parentNode.removeChild(particleContainer);
      }
    }, 1500);
  }
}

/* ---------- Helper: sleep ---------- */
function sleep(ms){ return new Promise(resolve=>setTimeout(resolve, ms)); }

/* ---------- Node class (JS) ---------- */
class Node {
  constructor(key, value){
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/* ---------- LRUCache class (JS) ---------- */
class LRUCache {
  constructor(capacity){
    this.capacity = capacity;
    this.m = new Map();
    this.head = new Node(null, null); // dummy
    this.tail = new Node(null, null); // dummy
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // helper: detach a node from DLL
  delete(node){
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  // helper: insert node right after head (MRU)
  insert(node){
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  // get returns { value, trace }
  get(key){
    const trace = [];
    trace.push({ line: 'ln24', text: `get(${key}) called — check map` });

    if (!this.m.has(key)) {
      trace.push({ line: 'ln25', text: `Map does not contain key ${key} — MISS`, type: 'miss', key });
      return { value: -1, trace };
    }

    // hit
    trace.push({ line: 'ln26', text: `Map contains key ${key} — retrieve node`, type: 'hit', key });
    const node = this.m.get(key);

    // delete step
    trace.push({ line: 'ln27', text: `delete(node ${key}) — detach from list`, key, action: 'delete' });
    this.delete(node);

    // insert step
    trace.push({ line: 'ln28', text: `insert(node ${key}) — insert at head (MRU)`, key, action: 'move-to-front' });
    this.insert(node);

    trace.push({ line: 'ln29', text: `return node.value (${node.value})` });
    return { value: node.value, trace };
  }

  // put returns { trace }
  put(key, value){
    const trace = [];
    trace.push({ line: 'ln31', text: `put(${key}, ${value}) called — check if key exists` });

    if (this.m.has(key)) {
      trace.push({ line: 'ln32', text: `Key ${key} exists — update value`, key });
      const node = this.m.get(key);

      trace.push({ line: 'ln34', text: `node.value = ${value}` , key});
      node.value = value;

      trace.push({ line: 'ln35', text: `delete(node ${key})` , key, action: 'delete'});
      this.delete(node);

      trace.push({ line: 'ln36', text: `insert(node ${key})` , key, action: 'move-to-front'});
      this.insert(node);

      trace.push({ line: 'ln37', text: `return` });
      return { trace };
    }

    // new key
    trace.push({ line: 'ln39', text: `Key ${key} not in map — check capacity` });

    if (this.m.size === this.capacity) {
      const toRemove = this.tail.prev;
      trace.push({ line: 'ln40', text: `Capacity full — will remove tail.prev (LRU) key=${toRemove.key}`, type: 'evict', evicted: toRemove.key, action: 'evict' });
      // actual remove
      this.delete(toRemove);
      this.m.delete(toRemove.key);
      trace.push({ line: 'ln42', text: `m.remove(${toRemove.key})` });
    }

    const node = new Node(key, value);
    trace.push({ line: 'ln44', text: `Create Node(${key}, ${value})`, action: 'create' });

    trace.push({ line: 'ln45', text: `insert(node ${key})`, key, action: 'insert' });
    this.insert(node);

    trace.push({ line: 'ln46', text: `m.put(${key}, node)` });
    this.m.set(key, node);

    return { trace };
  }

  // Utility for UI: read current ordered array of nodes (from head -> tail, excluding dummies)
  snapshotOrdered(){
    const arr = [];
    let cur = this.head.next;
    while (cur && cur !== this.tail){
      arr.push({ key: cur.key, value: cur.value });
      cur = cur.next;
    }
    return arr;
  }

  // Utility: list of keys in map
  snapshotMap(){
    return Array.from(this.m.keys());
  }
}

/* ---------- UI wiring ---------- */
const capacityInput = document.getElementById('capacityInput');
const setCapacityBtn = document.getElementById('setCapacity');
const keyInput = document.getElementById('keyInput');
const valueInput = document.getElementById('valueInput');
const putBtn = document.getElementById('putBtn');
const getBtn = document.getElementById('getBtn');
const resetBtn = document.getElementById('resetBtn');
const stepBtn = document.getElementById('stepBtn');
const runBtn = document.getElementById('runBtn');
const speedInput = document.getElementById('speed');
const batchInput = document.getElementById('batchInput');
const runBatchBtn = document.getElementById('runBatchBtn');
const clearLogBtn = document.getElementById('clearLogBtn');

const cacheVisual = document.getElementById('cacheVisual');
const mapView = document.getElementById('mapView');
const logView = document.getElementById('logView');

let cache = new LRUCache(Number(capacityInput.value) || 3);
let currentTrace = [];
let traceIndex = 0;
let autoPlaying = false;
let lastActiveLine = null;

// Initialize sound manager and particle system
const soundManager = new SoundManager();
const particleSystem = new ParticleSystem();

/* ---------- UI helpers ---------- */
function setLog(msg, type){
  const div = document.createElement('div');
  div.className = 'log-entry';
  div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (type === 'hit') div.classList.add('hit');
  if (type === 'miss') div.classList.add('miss');
  if (type === 'evict') div.classList.add('evict');
  logView.prepend(div);
}

function clearLog(){ 
  logView.innerHTML = ''; 
}

function createGhostNode(originalElement, key, value) {
  const ghost = document.createElement('div');
  ghost.className = 'cache-node ghost';
  ghost.dataset.key = key;
  
  const kv = document.createElement('div');
  kv.className = 'kv';
  kv.textContent = `${key} : ${value}`;
  
  const pos = document.createElement('div');
  pos.className = 'pos';
  pos.textContent = 'GHOST';
  
  ghost.appendChild(kv);
  ghost.appendChild(pos);
  
  // Position ghost at same location as original
  const rect = originalElement.getBoundingClientRect();
  const containerRect = originalElement.parentElement.getBoundingClientRect();
  
  ghost.style.position = 'absolute';
  ghost.style.left = (rect.left - containerRect.left) + 'px';
  ghost.style.top = (rect.top - containerRect.top) + 'px';
  ghost.style.zIndex = '1';
  
  cacheVisual.appendChild(ghost);
  
  // Remove ghost after animation
  setTimeout(() => {
    if (ghost.parentNode) {
      ghost.parentNode.removeChild(ghost);
    }
  }, 2000);
  
  return ghost;
}

function renderCache(){
  // Store previous state for ghost creation
  const prevElements = Array.from(cacheVisual.querySelectorAll('.cache-node:not(.ghost)'));
  const prevState = prevElements.map(el => ({
    key: el.dataset.key,
    value: el.querySelector('.kv').textContent.split(' : ')[1],
    element: el
  }));
  
  cacheVisual.innerHTML = '';
  const arr = cache.snapshotOrdered(); // head -> tail (MRU -> LRU)
  
  if (arr.length === 0){
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-database"></i>
      <p>Cache is empty</p>
    `;
    cacheVisual.appendChild(emptyState);
  } else {
    arr.forEach((item, idx) => {
      const box = document.createElement('div');
      box.className = 'cache-node';
      box.dataset.key = item.key;
      
      const kv = document.createElement('div');
      kv.className = 'kv';
      kv.textContent = `${item.key} : ${item.value}`;
      
      const pos = document.createElement('div');
      pos.className = 'pos';
      pos.textContent = (idx === 0 ? 'MRU' : (idx === arr.length - 1 ? 'LRU' : `pos ${idx+1}`));
      
      box.appendChild(kv);
      box.appendChild(pos);
      cacheVisual.appendChild(box);

      // Add arrow between nodes (except for last node)
      if (idx < arr.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        arrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
        cacheVisual.appendChild(arrow);
      }
    });
  }

  // Map view
  mapView.innerHTML = '';
  const keys = cache.snapshotMap();
  if (keys.length === 0){
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-map"></i>
      <p>No mappings</p>
    `;
    mapView.appendChild(emptyState);
  } else {
    keys.forEach(k => {
      const e = document.createElement('div');
      e.className = 'map-entry';
      e.innerHTML = `<strong>${k}</strong> → Node`;
      mapView.appendChild(e);
    });
  }
}

/* Highlight a code line (data-line attribute in HTML). */
function highlightLine(lineId){
  // remove last
  if (lastActiveLine){
    const prev = document.querySelector(`[data-line="${lastActiveLine}"]`);
    if (prev) prev.classList.remove('active');
  }
  const el = document.querySelector(`[data-line="${lineId}"]`);
  if (el){
    el.classList.add('active');
    lastActiveLine = lineId;
    // scroll code pane slightly to keep visible
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  } else {
    lastActiveLine = null;
  }
}

/* Apply a single trace step with advanced animations */
async function applyStep(step){
  if (!step) return;
  
  if (step.line) highlightLine(step.line);
  
  // Handle different animation actions
  if (step.action && step.key !== undefined) {
    const nodeEl = document.querySelector(`.cache-node[data-key="${step.key}"]`);
    
    switch(step.action) {
      case 'hit':
        if (nodeEl) {
          nodeEl.classList.add('hit');
          soundManager.playSound('hit');
          setTimeout(()=> nodeEl.classList.remove('hit'), 800);
        }
        break;
        
      case 'move-to-front':
        if (nodeEl) {
          // Create ghost at current position
          createGhostNode(nodeEl, step.key, nodeEl.querySelector('.kv').textContent.split(' : ')[1]);
          
          nodeEl.classList.add('moving-to-front');
          soundManager.playSound('move');
          setTimeout(()=> nodeEl.classList.remove('moving-to-front'), 1000);
          
          // Animate arrows
          const arrows = document.querySelectorAll('.arrow');
          arrows.forEach(arrow => {
            arrow.classList.add('active');
            setTimeout(() => arrow.classList.remove('active'), 1000);
          });
        }
        break;
        
      case 'evict':
        const evictEl = document.querySelector(`.cache-node[data-key="${step.evicted}"]`);
        if (evictEl) {
          evictEl.classList.add('evicting');
          particleSystem.createEvictionParticles(evictEl);
          soundManager.playSound('evict');
        }
        break;
        
      case 'insert':
        // Will be handled after render when new element appears
        setTimeout(() => {
          const newEl = document.querySelector(`.cache-node[data-key="${step.key}"]`);
          if (newEl) {
            newEl.classList.add('entering');
            soundManager.playSound('insert');
            setTimeout(()=> newEl.classList.remove('entering'), 800);
          }
        }, 50);
        break;
    }
  }
  
  // Handle hit/miss/evict visual feedback
  if (step.key !== undefined) {
    const nodeEl = document.querySelector(`.cache-node[data-key="${step.key}"]`);
    if (nodeEl && step.type === 'hit') {
      nodeEl.classList.add('hit');
      setTimeout(()=> nodeEl.classList.remove('hit'), 1000);
    }
    
    // Highlight map entry
    const mapEntries = document.querySelectorAll('.map-entry');
    mapEntries.forEach(entry => {
      if (entry.textContent.includes(step.key)) {
        entry.classList.add('highlight');
        setTimeout(() => entry.classList.remove('highlight'), 1000);
      }
    });
  }

  // Play sounds for different operations
  if (step.type === 'miss') {
    soundManager.playSound('miss');
  }

  // Append textual log for this step
  if (step.type === 'hit') setLog(step.text, 'hit');
  else if (step.type === 'miss') setLog(step.text, 'miss');
  else if (step.type === 'evict') setLog(step.text, 'evict');
  else setLog(step.text);

  // render updated state (state changes already applied by cache class methods)
  renderCache();

  // wait according to speed slider
  const delay = Number(speedInput.value) || 600;
  await sleep(delay);
}

/* Play an entire trace (auto). */
async function playTrace(trace){
  if (!trace || trace.length === 0) return;
  stepBtn.disabled = false;
  runBtn.disabled = false;
  for (let i = 0; i < trace.length; i++){
    await applyStep(trace[i]);
  }
}

/* ---------- Event Handlers ---------- */
setCapacityBtn.addEventListener('click', () => {
  const cap = Number(capacityInput.value) || 1;
  cache = new LRUCache(cap);
  currentTrace = [];
  traceIndex = 0;
  renderCache();
  clearLog();
  setLog(`✅ Cache capacity set to ${cap}`);
});

putBtn.addEventListener('click', async () => {
  const key = keyInput.value.trim();
  const val = valueInput.value.trim();
  if (key === '') { 
    alert('⚠️ Please enter a key'); 
    return; 
  }
  const { trace } = cache.put(key, val || key);
  currentTrace = trace;
  traceIndex = 0;
  stepBtn.disabled = false;
  runBtn.disabled = false;
  setLog(`🚀 PUT operation ready - ${trace.length} steps`);
});

getBtn.addEventListener('click', async () => {
  const key = keyInput.value.trim();
  if (key === '') { 
    alert('⚠️ Please enter a key'); 
    return; 
  }
  const { value, trace } = cache.get(key);
  currentTrace = trace;
  traceIndex = 0;
  stepBtn.disabled = false;
  runBtn.disabled = false;
  
  if (value !== -1) {
    setLog(`🎯 GET operation ready - will return ${value}`, 'hit');
  } else {
    setLog(`❌ GET operation ready - key not found`, 'miss');
  }
});

stepBtn.addEventListener('click', async () => {
  if (!currentTrace || traceIndex >= currentTrace.length) {
    setLog('✋ No more steps to execute for current operation.');
    stepBtn.disabled = true;
    runBtn.disabled = true;
    return;
  }
  const step = currentTrace[traceIndex++];
  await applyStep(step);
  if (traceIndex >= currentTrace.length){
    stepBtn.disabled = true;
    runBtn.disabled = true;
    setLog('✅ Operation completed!');
  }
});

runBtn.addEventListener('click', async () => {
  if (!currentTrace || currentTrace.length === 0) return;
  runBtn.disabled = true;
  stepBtn.disabled = true;
  setLog('⚡ Running remaining steps...');
  await playTrace(currentTrace.slice(traceIndex));
  traceIndex = currentTrace.length;
  runBtn.disabled = false;
  stepBtn.disabled = true;
  setLog('✅ Operation completed!');
});

resetBtn.addEventListener('click', () => {
  cache = new LRUCache(Number(capacityInput.value) || 3);
  currentTrace = [];
  traceIndex = 0;
  renderCache();
  clearLog();
  setLog('🔄 Cache has been reset');
});

runBatchBtn.addEventListener('click', async () => {
  const raw = batchInput.value.trim();
  if (!raw) { 
    alert('⚠️ Please enter batch commands'); 
    return; 
  }
  
  runBatchBtn.disabled = true;
  setLog('🔄 Starting batch execution...');
  
  const tokens = raw.split(/[,\n]+/).map(s=>s.trim()).filter(Boolean);
  let operationCount = 0;
  
  for (const t of tokens){
    const parts = t.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    
    if (cmd === 'put' && parts.length >= 2){
      const key = parts[1];
      const val = parts.length >= 3 ? parts.slice(2).join(' ') : key;
      setLog(`📝 Executing: put ${key} ${val}`);
      const { trace } = cache.put(key, val);
      await playTrace(trace);
      operationCount++;
    } else if (cmd === 'get' && parts.length >= 2){
      const key = parts[1];
      setLog(`🔍 Executing: get ${key}`);
      const { value, trace } = cache.get(key);
      await playTrace(trace);
      if (value !== -1) {
        setLog(`✅ get(${key}) returned ${value}`, 'hit');
      } else {
        setLog(`❌ get(${key}) returned -1`, 'miss');
      }
      operationCount++;
    } else {
      setLog(`⚠️ Unknown/invalid command: "${t}"`);
    }
  }
  
  setLog(`🎉 Batch execution completed! ${operationCount} operations processed.`);
  runBatchBtn.disabled = false;
});

clearLogBtn.addEventListener('click', () => {
  clearLog();
  setLog('📋 Log cleared');
});

// Auto-clear inputs after operations
function clearInputs() {
  keyInput.value = '';
  valueInput.value = '';
}

putBtn.addEventListener('click', () => setTimeout(clearInputs, 500));
getBtn.addEventListener('click', () => setTimeout(clearInputs, 500));

/* Initial render */
renderCache();
setLog('🚀 LRU Cache Visualizer ready! Set capacity and start with Put/Get operations.');
setLog('💡 Try: put 1 100, put 2 200, get 1, put 3 300 to see eviction in action.');
setLog('🔊 Click the sound icon to enable audio feedback!');