================================================================================
LRU CACHE VISUALIZER - COMPLETE DOCUMENTATION
================================================================================

README.md
================================================================================

# LRU Cache Visualizer

An interactive, animated visualization of the Least Recently Used (LRU) Cache algorithm with advanced animations, particle effects, and sound feedback. Perfect for learning data structures and algorithms through engaging visual demonstrations.

## Features

### Core Functionality
- Interactive LRU Cache Operations: PUT and GET operations with real-time visualization
- Dynamic Capacity Control: Adjust cache size on-the-fly
- Step-by-Step Execution: Step through operations or run them automatically
- Batch Operations: Execute multiple commands at once
- Code Highlighting: Real-time Java code highlighting during execution

### Advanced Animations
- Node Movement Animations: Smooth transitions when nodes move to front (MRU)
- Ghost Nodes: Semi-transparent replicas show where nodes were before moving
- Particle Effects: Explosive particle animations during evictions
- Entry Animations: Spinning, scaling effects when new nodes are inserted
- Eviction Animations: Dramatic fade-out with rotation and color shifts

### Audio Feedback
- Hit Sounds: Pleasant tones for cache hits
- Miss Sounds: Distinctive audio for cache misses
- Eviction Sounds: Deep tones for node evictions
- Movement Sounds: Audio cues for node repositioning
- Toggle Control: Easy on/off switch for sound effects

### User Interface
- Modern Dark Theme: Sleek cyberpunk-inspired design
- Glassmorphism Effects: Translucent panels with backdrop blur
- Responsive Design: Works on desktop and mobile devices
- Real-time Statistics: Live execution log with color-coded entries
- Interactive Controls: Intuitive buttons and input fields

## Demo

Try these commands:
put 1 100
put 2 200
put 3 300
get 1
put 4 400

Watch the eviction animation when the cache reaches capacity!

## Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation
1. Clone the repository
2. Open index.html in your browser
3. Start visualizing!

## How to Use

### Basic Operations

1. Configure Cache
   - Set desired capacity (default: 3)
   - Click "Set" to initialize cache

2. PUT Operation
   - Enter key and value
   - Click "Put" button
   - Watch node insertion animation

3. GET Operation
   - Enter key to retrieve
   - Click "Get" button
   - See hit/miss animations

4. Step-by-Step Execution
   - Click "Step" to execute one operation at a time
   - Click "Run" to execute all remaining steps
   - Adjust speed slider for animation timing

5. Batch Operations
   Enter multiple commands separated by commas:
   put 1 10, put 2 20, get 1, put 3 30, get 2

### Sound Controls
- Click the sound icon to enable/disable sound effects
- Different sounds for hits, misses, evictions, and movements

## Understanding the Algorithm

### LRU Cache Behavior
1. Cache Hit: Key exists → Move to front (MRU position)
2. Cache Miss: Key doesn't exist → Return -1
3. Insertion: Add new key-value pair at front
4. Eviction: Remove least recently used item when capacity is full

### Visual Indicators
- Green Glow: Cache hit
- Red Log: Cache miss
- Orange Particles: Node eviction
- Ghost Nodes: Previous positions
- Arrows: Data flow direction

## Technical Implementation

### Architecture
- Pure Vanilla JavaScript - No external dependencies
- CSS3 Animations - Hardware-accelerated transitions
- Web Audio API - Dynamic sound generation
- Responsive Grid Layout - Mobile-friendly design

### Browser Support
- Chrome 60+: Full Support
- Firefox 55+: Full Support
- Safari 12+: Full Support
- Edge 79+: Full Support

## Test Cases

### Basic Functionality
Test cache capacity: put 1 10, put 2 20, put 3 30, put 4 40 (Should evict key 1)
Test LRU ordering: put 1 10, put 2 20, put 3 30, get 1, put 4 40 (Should evict key 2)
Test cache hits: put 1 10, get 1, get 1 (Multiple hits)
Test cache misses: get 999 (Non-existent key)

### Edge Cases
Single capacity: capacity 1: put 1 10, put 2 20 (Should replace immediately)
Empty cache: get 1 (Should miss)
Update existing: put 1 10, put 1 20 (Should update value, not evict)

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test animations on different browsers
- Ensure responsive design works
- Update documentation for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- Bug Reports: Open an issue
- Feature Requests: Start a discussion
- Contact: kyasasvi5@gmail.com

## Show Your Support

Give a star if this project helped you learn about LRU caches or data structures!

Made with love for computer science education


================================================================================
docs/API.md
================================================================================

# API Documentation

## Core Classes

### LRUCache

The main cache implementation using a doubly-linked list with hash map for O(1) operations.

#### Constructor
new LRUCache(capacity: number)
- capacity: Maximum number of key-value pairs the cache can hold
- Returns: New LRUCache instance

#### Methods

##### get(key)
Retrieves a value by key and moves it to the most recently used position.

Parameters:
- key: The key to retrieve

Returns:
- Object with value and trace array

Example:
const result = cache.get("user123");
console.log(result.value); // "John Doe" or -1
console.log(result.trace); // Array of execution steps

##### put(key, value)
Inserts or updates a key-value pair, evicting LRU item if necessary.

Parameters:
- key: The key to insert/update
- value: The value to associate with the key

Returns:
- Object with trace array

Example:
const result = cache.put("user123", "John Doe");
console.log(result.trace); // Array of execution steps

##### snapshotOrdered()
Returns current cache contents ordered from MRU to LRU.

Returns: Array of objects with key-value pairs

##### snapshotMap()
Returns array of all keys currently in the cache.

Returns: Array of keys

### Node

Internal doubly-linked list node structure.

#### Constructor
new Node(key: any, value: any)

#### Properties
- key: The node's key
- value: The node's value
- prev: Reference to previous node
- next: Reference to next node

### SoundManager

Manages audio feedback using Web Audio API.

#### Methods

##### playSound(type)
Plays a sound effect for the specified operation type.

Parameters:
- type: One of "hit", "miss", "evict", "insert", "move"

Sound Patterns:
- hit: 800Hz sine wave, 0.2s duration
- miss: 300Hz sawtooth wave, 0.3s duration
- evict: 200Hz square wave, 0.5s duration
- insert: 600Hz triangle wave, 0.3s duration
- move: 1000Hz sine wave, 0.15s duration

##### toggle()
Toggles sound effects on/off.

Returns: Current enabled state (boolean)

### ParticleSystem

Creates visual particle effects for cache operations.

#### Methods

##### createEvictionParticles(element)
Generates particle explosion effect at the specified element's position.

Parameters:
- element: DOM element to create particles around

Effect: Creates 6 particles that fly outward in different directions

## Trace System

### Trace Object Structure
{
  line: string,        // Code line identifier (e.g., "ln24")
  text: string,        // Human-readable description
  type: string,        // "hit" | "miss" | "evict" (optional)
  key: any,           // Associated key for animations (optional)
  action: string,     // Animation type (optional)
  evicted: any        // Key that was evicted (optional)
}

### Animation Actions

Action - Description - Visual Effect
hit - Cache hit occurred - Green glow, scale animation
miss - Cache miss occurred - Red log entry, miss sound
move-to-front - Node moved to MRU - Lift animation, ghost node
evict - Node evicted from cache - Particles, rotation, fade
insert - New node inserted - Spin-in animation, bounce
delete - Node removed from list - Preparation for movement

## DOM Manipulation Functions

### renderCache()
Updates the visual cache representation with current state.

Effects:
- Clears existing cache visual
- Creates nodes with proper positioning
- Adds arrows between nodes
- Shows empty state if cache is empty

### highlightLine(lineId)
Highlights the specified code line in the code panel.

Parameters:
- lineId: Line identifier (e.g., "ln24")

### applyStep(step)
Applies a single animation step with proper timing.

Parameters:
- step: Trace object containing animation instructions

Process:
1. Highlight code line
2. Apply visual animations
3. Play sound effects
4. Update DOM
5. Wait for animation duration

### createGhostNode(element, key, value)
Creates a semi-transparent "ghost" node at the original element's position.

Parameters:
- element: Original element to ghost
- key: Node key
- value: Node value

Returns: Ghost node element

## Event Handlers

### Button Events
- setCapacity: Reinitializes cache with new capacity
- putBtn: Executes PUT operation with current inputs
- getBtn: Executes GET operation with current key
- resetBtn: Clears cache and resets state
- stepBtn: Executes next trace step
- runBtn: Executes all remaining trace steps
- runBatchBtn: Parses and executes batch commands
- clearLogBtn: Clears execution log
- soundToggle: Toggles sound effects

### Input Events
- capacityInput: Sets cache capacity
- keyInput: Specifies operation key
- valueInput: Specifies PUT operation value
- speedInput: Controls animation speed
- batchInput: Contains batch command text

## CSS Animation Classes

### Node Animations
- .entering: Node insertion animation (spin + scale)
- .moving-to-front: Move to MRU animation (lift + rotate)
- .evicting: Node eviction animation (fade + rotate + blur)
- .ghost: Ghost node fade-out animation
- .hit: Cache hit pulse animation

### Particle Effects
- .particle: Individual particle with explosion animation
- .particle-container: Container for particle system

### UI Feedback
- .active: Code line highlighting
- .highlight: Map entry highlighting

## Performance Considerations

### Animation Optimization
- Uses CSS transforms for hardware acceleration
- Minimizes DOM reflows with absolute positioning
- Cleans up ghost nodes and particles automatically
- Throttles animation speed based on user preference

### Memory Management
- Automatic cleanup of temporary elements
- Event listener management
- Audio context reuse
- Efficient trace array handling

### Browser Compatibility
- Graceful degradation for older browsers
- Feature detection for Web Audio API
- CSS fallbacks for unsupported properties
- Mobile-friendly touch interactions


================================================================================
docs/ANIMATIONS.md
================================================================================

# Animation System Documentation

## Overview

The LRU Cache Visualizer uses a sophisticated animation system combining CSS keyframes, JavaScript timing, and DOM manipulation to create engaging visual feedback for cache operations.

## Animation Architecture

### 1. CSS-Based Animations
Hardware-accelerated animations using CSS transforms and transitions for optimal performance.

### 2. JavaScript Orchestration
Precise timing and sequencing of animations through async/await patterns.

### 3. Dynamic Element Creation
Runtime creation of particles, ghost nodes, and visual effects.

## Core Animation Types

### Node Entry Animation

Trigger: When a new node is inserted into the cache
CSS Class: .entering
Duration: 800ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (bounce effect)

Visual Effects:
- Node spins 180° while scaling from 0 to 1.2 to 1
- Translates vertically with bounce
- Opacity fades in smoothly

### Move to Front Animation

Trigger: When a node moves to MRU position (cache hit or update)
CSS Class: .moving-to-front
Duration: 1000ms
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

Visual Effects:
- Node lifts up with 3D rotation
- Glowing shadow effect
- Smooth return to original position
- Color transition from accent to success

Associated Effects:
- Ghost node creation at original position
- Arrow flow animation
- Sound effect playback

### Eviction Animation

Trigger: When a node is removed due to capacity overflow
CSS Class: .evicting
Duration: 1200ms
Easing: cubic-bezier(0.55, 0.055, 0.675, 0.19) (ease-out)

Visual Effects:
- Rotation increases to 45°
- Scale shrinks to 0.3
- Opacity fades to 0
- Color shifts through hue rotation
- Blur effect applied
- Translates away from cache

Associated Effects:
- Particle explosion at node position
- Warning-colored glow
- Deep eviction sound

### Hit Pulse Animation

Trigger: When a cache hit occurs
CSS Class: .hit
Duration: 800ms
Easing: ease-out

Visual Effects:
- Gentle scale pulsing
- Green glow expansion
- Smooth return to normal

## Ghost Node System

### Purpose
Show users where nodes were positioned before moving, helping track the reordering process.

### Implementation
function createGhostNode(originalElement, key, value) {
  const ghost = document.createElement('div');
  ghost.className = 'cache-node ghost';
  
  // Position at original element's location
  const rect = originalElement.getBoundingClientRect();
  ghost.style.position = 'absolute';
  ghost.style.left = rect.left + 'px';
  ghost.style.top = rect.top + 'px';
  
  // Auto-cleanup after 2 seconds
  setTimeout(() => ghost.remove(), 2000);
}

Visual Properties:
- Semi-transparent appearance
- Gradual fade-out
- Slight scale reduction
- Positioned absolutely at original location

## Particle System

### Eviction Particles
Creates an explosion effect when nodes are evicted from the cache.

### Implementation
class ParticleSystem {
  createEvictionParticles(element) {
    // Create 6 particles
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Calculate random trajectory
      const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
      const distance = 80 + Math.random() * 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      
      // Set CSS custom properties for animation
      particle.style.setProperty('--dx', dx + 'px');
      particle.style.setProperty('--dy', dy + 'px');
    }
  }
}

Properties:
- 6 particles per explosion
- Radial distribution with randomization
- Orange warning color
- 1.5-second lifetime
- Scaling and translation

## Arrow Flow Animation

### Purpose
Visualize data flow direction in the cache linked list.

Trigger: During move-to-front operations
Visual Effect: Arrows pulse and glow to show direction

## Code Highlighting Animation

### Purpose
Synchronize visual animations with code execution steps.

Features:
- Left border accent line
- Smooth slide-in effect
- Gradient background
- Auto-scroll to keep visible

## Map Entry Highlighting

### Purpose
Show which hash map entries are being accessed.

Duration: 1000ms
Effect: Brief glow and scale for accessed map entries

## Animation Timing and Coordination

### Sequence Management
async function applyStep(step) {
  // 1. Code highlighting
  if (step.line) highlightLine(step.line);
  
  // 2. Visual animations
  if (step.action) applyVisualAnimation(step);
  
  // 3. Sound effects
  if (step.type) playSound(step.type);
  
  // 4. DOM updates
  renderCache();
  
  // 5. Wait for completion
  const delay = Number(speedInput.value) || 600;
  await sleep(delay);
}

### Speed Control
- User-adjustable timing via slider (100ms - 2000ms)
- Consistent delays between animation steps
- Smooth transitions regardless of speed

### Performance Optimization
- Hardware Acceleration: Uses transform and opacity properties
- Minimal Reflow: Absolute positioning for dynamic elements
- Cleanup: Automatic removal of temporary elements
- Throttling: Respects user speed preferences

## Browser Compatibility

### CSS Features Used
- CSS Custom Properties (CSS Variables)
- CSS Transforms 3D
- CSS Animations and Keyframes
- CSS Backdrop Filter
- CSS Grid Layout

### JavaScript Features
- Async/Await
- ES6 Classes
- Template Literals
- Destructuring
- Web Audio API

### Fallback Strategy
- Graceful degradation for unsupported features
- Feature detection for audio capabilities
- CSS fallbacks for older browsers
- Mobile-optimized touch interactions

## Performance Metrics

### Animation Performance
- Target: 60fps for all animations
- Method: Hardware-accelerated CSS transforms
- Monitoring: Chrome DevTools Performance tab

### Memory Usage
- Particle Cleanup: Automatic removal after 1.5s
- Ghost Nodes: Automatic removal after 2s
- Event Listeners: Proper cleanup and management

### Optimization Tips
1. Use transform instead of changing left/top
2. Batch DOM updates when possible
3. Use will-change for elements that animate frequently
4. Minimize animation during batch operations
5. Provide speed controls for slower devices


================================================================================
examples/test-cases.txt
================================================================================

LRU Cache Visualizer Test Cases

BASIC FUNCTIONALITY TESTS

Test 1: Basic PUT Operations
Setup: Capacity 3
Commands: put 1 10, put 2 20, put 3 30
Expected: Cache shows [3:30, 2:20, 1:10] (MRU to LRU)
Animation: Each PUT shows entering animation
Sound: Insert sound for each operation

Test 2: Basic GET Operations
Setup: put 1 10, put 2 20, put 3 30
Commands: get 1
Expected: Cache shows [1:10, 3:30, 2:20]
Animation: Node 1 moves to front with ghost node
Sound: Hit sound (800Hz sine wave)

Commands: get 2
Expected: Cache shows [2:20, 1:10, 3:30]
Animation: Node 2 moves to front with ghost node
Sound: Hit sound

Test 3: Cache Miss
Setup: put 1 10, put 2 20
Commands: get 5
Expected: Cache unchanged [2:20, 1:10], Log shows "MISS" in red
Animation: No node highlighting, no cache changes
Sound: Miss sound (300Hz sawtooth wave)

EVICTION TESTS

Test 4: Simple Eviction
Setup: Capacity 3
Commands: put 1 10, put 2 20, put 3 30, put 4 40
Expected: Cache shows [4:40, 3:30, 2:20] (key 1 evicted)
Animation: Node 1 shows eviction animation with particles
Sound: Eviction sound followed by insert sound

Test 5: LRU Eviction Order
Setup: Capacity 3
Commands: put 1 10, put 2 20, put 3 30, get 1, put 4 40
Expected: Cache shows [4:40, 1:10, 3:30] (key 2 evicted, not 1)
Animation: Key 2 eviction with particle explosion
Sound: Eviction sound for key 2

Test 6: Multiple Evictions
Setup: Capacity 2
Commands: put 1 10, put 2 20, put 3 30, put 4 40, put 5 50
Expected: Cache shows [5:50, 4:40]
Animation: Multiple eviction animations in sequence
Sound: Multiple eviction sounds with proper timing

UPDATE TESTS

Test 7: Update Existing Key
Setup: put 1 10, put 2 20, put 3 30
Commands: put 2 99
Expected: Cache shows [2:99, 3:30, 1:10]
Animation: Node 2 moves to front with ghost node
Sound: Move sound (not insert sound)

Test 8: Update with Full Capacity
Setup: Capacity 2, put 1 10, put 2 20
Commands: put 1 99
Expected: Cache shows [1:99, 2:20] (no evictions)
Animation: Node 1 moves to front with ghost
Sound: Move sound only

EDGE CASES

Test 9: Single Capacity Cache
Setup: Capacity 1
Commands: put 1 10, put 2 20
Expected: Cache shows [2:20] only
Animation: Key 1 eviction with particles, Key 2 insertion
Sound: Eviction sound then insert sound

Test 10: Empty Cache Operations
Setup: Capacity 3
Commands: get 1
Expected: Cache remains empty, Log shows "MISS"
Animation: No cache node animations
Sound: Miss sound

Test 11: Rapid Sequential Operations
Setup: Speed 200ms
Commands: put 1 10, get 1, put 1 20, get 1, put 2 30
Expected: Final cache [2:30, 1:20]
Animation: Multiple move-to-front animations without conflicts
Sound: Proper sound sequence without distortion

BATCH OPERATION TESTS

Test 12: Complex Batch Sequence
Setup: Capacity 3
Commands: put 1 100, put 2 200, put 3 300, get 1, put 4 400, get 2, put 5 500

Step-by-step expected:
1. put 1 100: [1:100]
2. put 2 200: [2:200, 1:100]
3. put 3 300: [3:300, 2:200, 1:100]
4. get 1: [1:100, 3:300, 2:200]
5. put 4 400: [4:400, 1:100, 3:300] (evict 2)
6. get 2: MISS (2 was evicted)
7. put 5 500: [5:500, 4:400, 1:100] (evict 3)

Final: Cache shows [5:500, 4:400, 1:100]
Animation: Full sequence with all animation types
Sound: Complete sound sequence for each operation

Test 13: Batch with Invalid Commands
Commands: put 1 10, invalidcommand, get 1, put 2 20
Expected: Valid commands execute, invalid shows error in log
Animation: Only valid operations trigger animations
Sound: Sounds only for successful operations

PERFORMANCE TESTS

Test 14: Large Capacity Stress Test
Setup: Capacity 20
Commands: put 1 10, put 2 20, ..., put 25 250
Expected: Cache maintains only 20 items (keys 6-25)
Performance: Smooth animations, proper layout wrapping
Animation: All animations render without lag

Test 15: High-Speed Animation Test
Setup: Speed 100ms (fastest)
Commands: put 1 10, put 2 20, get 1, put 3 30, get 2, put 4 40
Expected: All animations complete without overlap
Performance: Maintain 60fps throughout
Sound: Clear audio effects

UI/UX INTERACTIVE TESTS

Test 16: Sound System Testing
1. Sound OFF by default - verify no sounds
2. Enable sound toggle - icon changes to volume-up
3. Test each sound type:
   - put 1 10 (insert sound)
   - get 1 (hit sound)
   - get 5 (miss sound)
   - put 2 20, put 3 30, put 4 40 (eviction sound)
4. Disable sound - verify silence
Expected: Clear audio feedback when enabled, silence when disabled

Test 17: Animation Speed Control
1. Set to slowest (2000ms): put 1 10, get 1
2. Set to fastest (100ms): put 2 20, get 2
3. Set to middle (600ms): put 3 30, get 3
Expected: Proportional timing changes, smooth slider interaction

Test 18: Step-by-Step Execution Control
Commands: put 1 10
1. Use "Step" button to advance through trace
2. Verify each step shows correct code line highlighting
3. Test "Run" button completes remaining steps
4. Verify buttons enable/disable correctly
Expected: Precise control over execution flow

MOBILE AND RESPONSIVE TESTS

Test 19: Mobile Device Testing
Setup: Mobile viewport (375px width), Capacity 3
Commands: put 1 10, put 2 20, put 3 30, get 1
Expected: Layout stacks to single column, touch-friendly controls
Animation: Smooth performance on mobile
Layout: No horizontal scrolling required

Test 20: Tablet Landscape Testing
Setup: Tablet viewport (768px width)
Commands: Same as mobile test
Expected: Efficient horizontal space usage, readable layout

CROSS-BROWSER COMPATIBILITY TESTS

Test 21: Browser Feature Support
Test in Chrome, Firefox, Safari, Edge
Commands: put 1 10, put 2 20, put 3 30, get 1, put 4 40
Expected: Consistent visual appearance and animation smoothness
Verify: Sound functionality where supported, CSS effects work

Test 22: Feature Degradation
1. Disable JavaScript: Should show graceful message
2. Disable CSS animations: Should still function
3. Block audio: Should work without sounds
4. Old browser: Should degrade gracefully
Expected: Core functionality maintained in all cases

ADVANCED ANIMATION TESTS

Test 23: Ghost Node Lifecycle
Commands: put 1 10, put 2 20, put 3 30, get 1
Verify ghost node:
- Appears at exact original position of node 1
- Semi-transparent appearance (30% opacity)
- Contains correct key:value (1:10)
- Fades out completely over 2 seconds
- Doesn't interfere with layout
- Memory cleanup after animation

Test 24: Particle Physics Simulation
Setup: Capacity 2
Commands: put 1 10, put 2 20, put 3 30 (evicts key 1)
Verify particles:
- Exactly 6 particles generated
- Explode radially from node center
- Different trajectories (randomized)
- Orange warning color
- Scale from 1 to 0 while moving
- Complete removal after 1.5 seconds

Test 25: Animation Conflict Resolution
Setup: Speed 1000ms, Capacity 2
Commands: put 1 10, put 2 20, get 1, put 3 30
Timeline verification:
- T=0ms: put 1 (enter animation)
- T=1000ms: put 2 (enter animation)
- T=2000ms: get 1 (move-to-front + ghost)
- T=3000ms: put 3 (evict 2 + enter 3)
Expected: No animation conflicts or visual artifacts

EDUCATIONAL VALUE TESTS

Test 26: Algorithm Understanding
Setup: Capacity 3
Commands: put A apple, put B banana, put C cherry, get A, put D date
Expected: Should evict B (not C or A)
Verify: Visual clearly shows why B was evicted
Learning: User can explain LRU principle after watching

Test 27: Code-to-Visual Mapping
Commands: put 1 10
Verify code highlighting sequence:
1. Line 31: "put(1, 10) called"
2. Line 39: "check capacity"
3. Line 44: "Create Node(1, 10)"
4. Line 45: "insert(node 1)"
5. Line 46: "m.put(1, node)"
Expected: Perfect synchronization between code and visual

ACCESSIBILITY TESTS

Test 28: Keyboard Navigation
1. Tab through all controls in logical order
2. Use Enter/Space to activate buttons
3. Arrow keys for range sliders
4. Escape to cancel operations
Expected: All elements reachable, clear focus indicators

Test 29: High Contrast Mode
Enable high contrast mode, repeat basic tests
Expected: Text remains readable, animations still visible

PERFORMANCE BENCHMARKS

Test 30: Memory and Performance Metrics
Monitor during extended session (100+ operations):
Target Metrics:
- Memory usage: < 50MB total
- Animation frame rate: 60fps consistently
- Response time: < 100ms for button clicks
- Audio latency: < 50ms
- DOM nodes: Proper cleanup, no leaks

Measurement tools:
- Chrome DevTools Performance tab
- Memory tab for heap analysis
- Console timing for operation speed

INTEGRATION AND WORKFLOW TESTS

Test 31: Complete User Journey
Simulate real user learning session:
1. First-time user opens application
2. Reads interface and tries basic operation
3. Experiments with different capacities
4. Uses batch operations for complex scenarios
5. Adjusts settings (speed, sound)
6. Tests edge cases through exploration

Success criteria:
- Intuitive without external documentation
- Clear feedback at every step
- Engaging and educational
- No frustrating bugs or unclear behavior

Test 32: Extended Session Stability
Run for 30+ minutes with varied operations:
- 200+ cache operations
- Multiple capacity changes
- All UI controls exercised
- Sound on/off cycling
- Speed adjustments
- Batch operations

Expected:
- No memory leaks or performance degradation
- Consistent behavior throughout session
- No accumulating visual artifacts
- Stable audio and animation performance

PERFORMANCE TEST COMMANDS

Browser Console Performance Test:
console.time('batch-operation');
// Execute large batch operation
console.timeEnd('batch-operation');
// Should complete in < 5 seconds for 20 operations

Memory Test:
// Monitor in Chrome DevTools Memory tab
// Heap should remain stable, no continuous growth
// Ghost nodes and particles should be garbage collected

Animation Test:
// Monitor in Chrome DevTools Performance tab
// Should maintain 60fps during animations
// No dropped frames or janky animations

These comprehensive test cases ensure your LRU Cache Visualizer 
works flawlessly across all scenarios, devices, and use cases 
while providing maximum educational value.


================================================================================
LICENSE
================================================================================

MIT License

Copyright (c) 2024 [Lakshmi Yasasvi]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
