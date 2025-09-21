/***********************
 * LRU Visualizer Logic
 * Matches the Java-like code in the code pane.
 ***********************/

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

/* ---------- LRUCache class (JS) ----------
   Methods and fields mirror the Java-like code pane:
   - head, tail (dummy nodes)
   - m: Map<key,Node>
   - capacity
   - get(key), put(key,value), insert(node), delete(node)
   Each public operation returns a 'trace' array describing steps.
-------------------------------------*/
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
    trace.push({ line: 'ln27', text: `delete(node ${key}) — detach from list`, key });
    this.delete(node);

    // insert step
    trace.push({ line: 'ln28', text: `insert(node ${key}) — insert at head (MRU)`, key });
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

      trace.push({ line: 'ln35', text: `delete(node ${key})` , key});
      this.delete(node);

      trace.push({ line: 'ln36', text: `insert(node ${key})` , key});
      this.insert(node);

      trace.push({ line: 'ln37', text: `return` });
      return { trace };
    }

    // new key
    trace.push({ line: 'ln39', text: `Key ${key} not in map — check capacity` });

    if (this.m.size === this.capacity) {
      const toRemove = this.tail.prev;
      trace.push({ line: 'ln40', text: `Capacity full — will remove tail.prev (LRU) key=${toRemove.key}`, type: 'evict', evicted: toRemove.key });
      // actual remove
      this.delete(toRemove);
      this.m.delete(toRemove.key);
      trace.push({ line: 'ln42', text: `m.remove(${toRemove.key})` });
    }

    const node = new Node(key, value);
    trace.push({ line: 'ln44', text: `Create Node(${key}, ${value})` });

    trace.push({ line: 'ln45', text: `insert(node ${key})` });
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

/* ---------- UI helpers ---------- */
function setLog(msg, type){
  const div = document.createElement('div');
  div.className = 'log-entry';
  div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (type === 'hit') div.style.color = '#065f46'; // green
  if (type === 'miss') div.style.color = '#9b1c1c'; // red
  if (type === 'evict') div.style.color = '#92400e'; // orange
  logView.prepend(div);
}

function clearLog(){ logView.innerHTML = ''; }

function renderCache(){
  cacheVisual.innerHTML = '';
  const arr = cache.snapshotOrdered(); // head -> tail (MRU -> LRU)
  arr.forEach((item, idx) => {
    const box = document.createElement('div');
    box.className = 'cache-node';
    box.dataset.key = item.key;
    const kv = document.createElement('div');
    kv.className = 'kv';
    kv.textContent = `${item.key} : ${item.value}`;
    const pos = document.createElement('div');
    pos.className = 'pos';
    pos.textContent = (idx === 0 ? 'HEAD (MRU)' : (idx === arr.length - 1 ? 'TAIL (LRU)' : `pos ${idx+1}`));
    box.appendChild(kv);
    box.appendChild(pos);
    cacheVisual.appendChild(box);
  });

  // if empty, show placeholder
  if (arr.length === 0){
    const p = document.createElement('div');
    p.style.color = '#6b7280';
    p.textContent = '(cache empty)';
    cacheVisual.appendChild(p);
  }

  // Map view
  mapView.innerHTML = '';
  const keys = cache.snapshotMap();
  if (keys.length === 0){
    const p = document.createElement('div');
    p.style.color = '#6b7280';
    p.textContent = '(map empty)';
    mapView.appendChild(p);
  } else {
    keys.forEach(k => {
      const e = document.createElement('div');
      e.className = 'map-entry';
      e.textContent = `${k} → Node`;
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

/* Apply a single trace step (visual + log + highlight). */
async function applyStep(step){
  if (!step) return;
  if (step.line) highlightLine(step.line);
  if (step.key !== undefined) {
    // highlight the node element if present (present after state changes)
    // apply class by key
    const nodeEl = document.querySelector(`.cache-node[data-key="${step.key}"]`);
    if (nodeEl){
      if (step.type === 'hit') {
        nodeEl.classList.add('hit');
        setTimeout(()=> nodeEl.classList.remove('hit'), 600);
      } else if (step.type === 'miss') {
        // for miss: flash nothing in cache (no element), mark map area
        // briefly add a miss entry visually by pushing a log
      } else if (step.type === 'evict') {
        // evicted key likely not in DOM (removed), so show a short eviction entry
        setLog(`Eviction: key ${step.evicted}`, 'evict');
      }
    } else {
      // No DOM node found; maybe miss or eviction — log accordingly
    }
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

/* Prepare and run (auto) */
async function runAuto(trace){
  runBtn.disabled = true;
  stepBtn.disabled = true;
  await playTrace(trace);
  runBtn.disabled = false;
  stepBtn.disabled = false;
}

/* ---------- Handlers ---------- */
setCapacityBtn.addEventListener('click', () => {
  const cap = Number(capacityInput.value) || 1;
  cache = new LRUCache(cap);
  currentTrace = [];
  traceIndex = 0;
  renderCache();
  clearLog();
  setLog(`Capacity set to ${cap}`);
});

putBtn.addEventListener('click', async () => {
  const key = keyInput.value.trim();
  const val = valueInput.value.trim();
  if (key === '') { alert('Enter key'); return; }
  // run put
  const { trace } = cache.put(key, val);
  currentTrace = trace;
  traceIndex = 0;
  stepBtn.disabled = false;
  runBtn.disabled = false;
  // auto-play single op if preferred; default user uses Step or Run
});

getBtn.addEventListener('click', async () => {
  const key = keyInput.value.trim();
  if (key === '') { alert('Enter key'); return; }
  const { value, trace } = cache.get(key);
  currentTrace = trace;
  traceIndex = 0;
  stepBtn.disabled = false;
  runBtn.disabled = false;
  // optionally show returned value in log
  if (value !== -1) setLog(`get(${key}) returned ${value}`, 'hit');
  else setLog(`get(${key}) returned -1`, 'miss');
});

stepBtn.addEventListener('click', async () => {
  if (!currentTrace || traceIndex >= currentTrace.length) {
    setLog('No more steps to execute for current operation.');
    stepBtn.disabled = true;
    runBtn.disabled = true;
    return;
  }
  const step = currentTrace[traceIndex++];
  await applyStep(step);
  if (traceIndex >= currentTrace.length){
    stepBtn.disabled = true;
    runBtn.disabled = true;
  }
});

runBtn.addEventListener('click', async () => {
  if (!currentTrace || currentTrace.length === 0) return;
  runBtn.disabled = true;
  stepBtn.disabled = true;
  await playTrace(currentTrace.slice(traceIndex));
  traceIndex = currentTrace.length;
  runBtn.disabled = false;
  stepBtn.disabled = true;
});

resetBtn.addEventListener('click', () => {
  cache = new LRUCache(Number(capacityInput.value) || 3);
  currentTrace = [];
  traceIndex = 0;
  renderCache();
  clearLog();
  setLog('Cache reset');
});

runBatchBtn.addEventListener('click', async () => {
  const raw = batchInput.value.trim();
  if (!raw) { alert('Paste batch commands'); return; }
  // parse by comma or newline
  const tokens = raw.split(/[,\\n]+/).map(s=>s.trim()).filter(Boolean);
  for (const t of tokens){
    // each token like: put 1 10  OR get 2
    const parts = t.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    if (cmd === 'put' && parts.length >= 3){
      const key = parts[1];
      const val = parts.slice(2).join(' ');
      const { trace } = cache.put(key, val);
      await playTrace(trace);
    } else if (cmd === 'get' && parts.length >= 2){
      const key = parts[1];
      const { value, trace } = cache.get(key);
      await playTrace(trace);
      if (value !== -1) setLog(`get(${key}) returned ${value}`, 'hit');
      else setLog(`get(${key}) returned -1`, 'miss');
    } else {
      setLog(`Unknown/invalid command: "${t}"`);
    }
  }
  // batch finished
});

clearLogBtn.addEventListener('click', () => clearLog());

/* Initial render */
renderCache();
setLog('Ready — set capacity and start using Put/Get.');
