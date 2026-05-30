/**
 * viz-engine.js — Interactive algorithm visualization engine
 * 
 * Renders step-by-step visualizations for each LeetCode solution.
 * Supports multiple visualization types: hash-map, sliding-window,
 * two-pointer, linked-list, matrix-rotate, binary-search, etc.
 */

// =====================================================
// Globals
// =====================================================
window.vizSteps = [];
window.vizStep = 0;
window.vizTotal = 0;
let vizTimer = null;
let currentVizId = null;

// =====================================================
// Helper: get viz data for a solution (from on-demand loaded detail data)
// =====================================================
function _getVizData(solutionId) {
  if (window._vizDetailData) {
    return window._vizDetailData;
  }
  return null;
}

// =====================================================
// Initialize visualization for a given solution
// =====================================================
function initVisualization(solution) {
  const viz = _getVizData(solution.id);
  if (!viz) {
    // Viz data not loaded yet — show placeholder until _onVizDetailReady retries
    const canvas = document.getElementById('vizCanvas');
    if (canvas) {
      canvas.innerHTML = `
        <div class="viz-placeholder">
          <div class="viz-icon">🎨</div>
          <p>Loading visualization…</p>
        </div>`;
    }
    document.getElementById('vizStepInfo').textContent = 'Step 0 / 0 · loading…';
    return;
  }

  currentVizId = solution.id;
  window.vizSteps = viz.steps;
  window.vizTotal = viz.steps.length - 1;
  window.vizStep = 0;

  // Render initial step
  renderVizStep(viz);
  updateVizUI();
}

// =====================================================
// Render a single step of the visualization
// =====================================================
function renderVizStep(viz) {
  const canvas = document.getElementById('vizCanvas');
  const stepData = window.vizSteps[window.vizStep];
  if (!stepData) return;

  // Build canvas content based on visualization type
  const type = viz.type;
  let html = '';

  // Common: step header
  html += `<div style="padding:12px;text-align:center;border-bottom:1px solid var(--border);margin-bottom:8px;">
    <div style="font-size:12px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">${viz.label}</div>
    <div style="font-size:13px;color:var(--text-secondary);">${viz.example.input || ''}</div>
  </div>`;

  // Type-specific rendering
  html += renderTypeSpecific(type, stepData, viz);

  // Highlight text
  html += `<div style="padding:8px 16px 12px;text-align:center;">
    <div style="display:inline-block;background:var(--accent-glow);border-left:3px solid var(--accent);padding:8px 14px;border-radius:var(--radius-sm);font-size:13px;color:var(--accent);text-align:left;max-width:100%;">
      ${stepData.highlight}
    </div>
  </div>`;

  canvas.innerHTML = html;
}

// =====================================================
// Type-specific renderers
// =====================================================
function renderTypeSpecific(type, step, viz) {
  switch (type) {
    case 'hash-map':
      return renderHashMap(step, viz);
    case 'linked-list':
      return renderLinkedList(step, viz);
    case 'sliding-window':
      return renderSlidingWindow(step, viz);
    case 'two-pointer':
      return renderTwoPointer(step, viz);
    case 'matrix-rotate':
      return renderMatrix(step, viz);
    case 'binary-search':
      return renderBinarySearch(step, viz);
    case 'digit-reversal':
      return renderDigitReversal(step, viz);
    case 'state-machine':
      return renderStateMachine(step, viz);
    case 'binary-partition':
      return renderBinaryPartition(step, viz);
    case 'expand-center':
      return renderExpandCenter(step, viz);
    case 'zigzag':
      return renderZigzag(step, viz);
    case 'sudoku':
      return renderSudoku(step, viz);
    case 'fibonacci':
      return renderFibonacci(step, viz);
    case 'bfs-tree':
      return renderBfsTree(step, viz);
    default:
      return `<div style="padding:24px;text-align:center;color:var(--text-tertiary);font-size:14px;">Visualization type "${type}" not supported yet.</div>`;
  }
}

// -------- Hash Map (e.g. Two Sum) --------
function renderHashMap(step, viz) {
  const p = viz.example.params;
  const nums = p.nums;
  const target = p.target;

  let html = `<div style="padding:8px 16px;display:flex;gap:16px;flex-wrap:wrap;justify-content:center;">`;

  // Array display
  html += `<div style="flex:1;min-width:200px;">
    <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px;">nums</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">`;
  nums.forEach((n, i) => {
    const isCurrent = step.step === 0 && i === 0 || step.step > 0 && i <= step.step;
    const isFound = step.step >= 2 && i <= 1;
    html += `<div style="
      width:44px;height:44px;display:flex;align-items:center;justify-content:center;
      border-radius:var(--radius-sm);
      font-family:var(--font-code);font-size:14px;
      background:${isFound ? 'var(--green-bg)' : isCurrent ? 'var(--accent-glow)' : 'var(--surface-2)'};
      border:1px solid ${isFound ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'var(--border)'};
      color:${isFound ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'var(--text-primary)'};
      font-weight:${isCurrent || isFound ? '600' : '400'};
    ">${n}</div>`;
  });
  html += `</div></div>`;

  // Hash map display
  html += `<div style="flex:1;min-width:200px;">
    <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px;">hash_map</div>
    <div style="background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-md);padding:8px;">`;
  
  let entries = [];
  const currentStep = step.step;
  if (currentStep >= 1) {
    entries.push({ key: 2, val: 0 });
  }
  if (currentStep >= 2) {
    entries.push({ key: 7, val: 1 });
  }

  if (entries.length === 0) {
    html += `<div style="color:var(--text-tertiary);font-size:12px;text-align:center;">{ }</div>`;
  } else {
    html += `<div style="display:flex;flex-direction:column;gap:4px;">`;
    entries.forEach(e => {
      html += `<div style="display:flex;justify-content:space-between;padding:2px 8px;border-radius:var(--radius-sm);background:var(--surface-2);font-family:var(--font-code);font-size:13px;">
        <span style="color:var(--accent);">${e.key}</span>
        <span style="color:var(--text-secondary);">→</span>
        <span style="color:var(--text-primary);">${e.val}</span>
      </div>`;
    });
    html += `</div>`;
  }

  html += `</div></div></div>`;
  return html;
}

// -------- Linked List (e.g. Add Two Numbers, Merge Two Sorted Lists) --------
function renderLinkedList(step, viz) {
  const highlight = step.highlight;
  // For linked-list, we just show a nice textual representation
  // with arrow animations
  // Use regex to find node values like "node (7)", "node (0)", or plain "7"
  const nodeRegex = /node\s*\((\d+)\)/g;
  const nodes = [];
  let match;
  while ((match = nodeRegex.exec(highlight)) !== null) {
    nodes.push(match[1]);
  }
  // Fallback: if no "node (X)" pattern found, try splitting by →
  if (nodes.length === 0) {
    const parts = highlight.split('→').map(s => s.trim());
    parts.forEach(p => {
      const m = p.match(/(\d+)/);
      if (m) nodes.push(m[1]);
    });
  }
  let html = `<div style="padding:16px;display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;">`;
  
  nodes.forEach((val, i) => {
    const isLast = i === nodes.length - 1;
    html += `<div style="
      display:inline-flex;align-items:center;justify-content:center;
      width:48px;height:48px;border-radius:50%;
      background:var(--accent-glow);border:2px solid var(--accent);
      font-family:var(--font-code);font-size:16px;font-weight:600;
      color:var(--accent);margin:4px;
    ">${val}</div>`;
    if (!isLast) {
      html += `<div style="color:var(--text-tertiary);font-size:18px;margin:0 4px;">→</div>`;
    }
  });
  html += `</div>`;
  return html;
}

// -------- Sliding Window (e.g. Longest Substring Without Repeating Characters) --------
function renderSlidingWindow(step, viz) {
  const s = viz.example.params.s || '';
  if (step.window) {
    const [l, r] = step.window;
    let html = `<div style="padding:12px 16px;text-align:center;">
      <div style="display:inline-flex;gap:2px;position:relative;">`;
    
    for (let i = 0; i < s.length; i++) {
      const inWindow = i >= l && i <= r;
      const isEdge = i === l || i === r;
      html += `<div style="
        width:36px;height:36px;display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius-sm);
        font-family:var(--font-code);font-size:15px;font-weight:${inWindow ? '600' : '400'};
        background:${inWindow ? 'var(--accent-glow)' : 'var(--surface-2)'};
        border:1px solid ${isEdge ? 'var(--accent)' : inWindow ? 'rgba(0,212,170,0.3)' : 'var(--border)'};
        color:${inWindow ? 'var(--accent)' : 'var(--text-tertiary)'};
        position:relative;
      ">
        ${s[i]}
        ${i === l ? `<div style="position:absolute;bottom:-18px;font-size:10px;color:var(--accent);font-weight:600;">L</div>` : ''}
        ${i === r ? `<div style="position:absolute;top:-18px;font-size:10px;color:var(--accent);font-weight:600;">R</div>` : ''}
      </div>`;
    }
    html += `</div></div>`;
    return html;
  }
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;">${step.highlight}</div>`;
}

// -------- Two Pointer (e.g. Trapping Rain Water) --------
function renderTwoPointer(step, viz) {
  const height = viz.example.params.height || [];
  const left = step.left !== undefined ? step.left : 0;
  const right = step.right !== undefined ? step.right : height.length - 1;
  const water = step.water !== undefined ? step.water : 0;

  if (!height.length) {
    return `<div style="padding:16px;text-align:center;color:var(--text-secondary);">${step.highlight}</div>`;
  }

  const maxH = Math.max(...height);
  const barScale = Math.min(12, 200 / maxH);
  const barWidth = Math.min(30, 600 / height.length);

  let html = `<div style="padding:8px 16px;">
    <div style="display:flex;align-items:flex-end;gap:2px;justify-content:center;height:${maxH * barScale + 40}px;position:relative;">`;
  
  height.forEach((h, i) => {
    const isLeft = i === left;
    const isRight = i === right;
    const barH = h * barScale;
    const isActive = isLeft || isRight;

    html += `<div style="display:flex;flex-direction:column;align-items:center;position:relative;width:${barWidth}px;">`;
    // Value label
    html += `<div style="font-size:10px;font-family:var(--font-code);color:${isActive ? 'var(--accent)' : 'var(--text-tertiary)'};margin-bottom:2px;">${h}</div>`;
    // Bar
    html += `<div style="
      width:${barWidth - 4}px;height:${barH}px;
      background:${isLeft || isRight ? 'var(--accent)' : 'var(--surface-3)'};
      border-radius:2px 2px 0 0;
      opacity:${isLeft || isRight ? '1' : '0.7'};
      border:${isActive ? '1px solid var(--accent-dim)' : 'none'};
    "></div>`;
    // Pointer marker
    if (isLeft) {
      html += `<div style="position:absolute;bottom:-18px;font-size:9px;color:var(--accent);font-weight:600;">L</div>`;
    }
    if (isRight) {
      html += `<div style="position:absolute;bottom:-18px;font-size:9px;color:var(--accent);font-weight:600;">R</div>`;
    }
    html += `</div>`;
  });

  html += `</div>`;
  // Debug info
  html += `<div style="display:flex;justify-content:center;gap:24px;margin-top:24px;font-size:12px;font-family:var(--font-code);color:var(--text-secondary);">
    <span>left_max: <span style="color:var(--accent);">${step.leftMax || 0}</span></span>
    <span>right_max: <span style="color:var(--accent);">${step.rightMax || 0}</span></span>
    <span>💧 total: <span style="color:var(--accent);font-weight:600;">${water}</span></span>
  </div>`;
  html += `</div>`;
  return html;
}

// -------- Matrix Rotation --------
function renderMatrix(step, viz) {
  const m = viz.example.params.matrix || [[1,2,3],[4,5,6],[7,8,9]];
  const n = m.length;
  const phase = step.phase || 'transpose';

  let html = `<div style="padding:8px 16px;text-align:center;">`;

  // Determine which cells are being swapped/reversed in this step
  let highlighted = {};
  if (phase === 'transpose') {
    const swaps = [
      [[0,1],[1,0]], [[0,2],[2,0]], [[1,2],[2,1]]
    ];
    if (step.step < swaps.length) {
      const [a, b] = swaps[step.step];
      highlighted[a] = 'swap';
      highlighted[b] = 'swap';
    }
  }

  html += `<div style="display:inline-flex;flex-direction:column;gap:4px;">`;
  for (let i = 0; i < n; i++) {
    html += `<div style="display:flex;gap:4px;justify-content:center;">`;
    for (let j = 0; j < n; j++) {
      const key = `${i},${j}`;
      let style = 'var(--surface-2)';
      let border = 'var(--border)';
      let color = 'var(--text-primary)';
      if (highlighted[key] === 'swap') {
        style = 'var(--yellow-bg)';
        border = 'var(--yellow)';
        color = 'var(--yellow)';
      }
      html += `<div style="
        width:44px;height:44px;display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius-sm);
        font-family:var(--font-code);font-size:14px;font-weight:500;
        background:${style};border:1px solid ${border};color:${color};
      ">${m[i][j]}</div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  html += `</div>`;
  return html;
}

// -------- Binary Search (e.g. Sqrt(x)) --------
function renderBinarySearch(step, viz) {
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;line-height:1.8;">
    <div style="display:inline-block;text-align:left;">
      ${step.highlight}
    </div>
  </div>`;
}

// -------- Digit Reversal --------
function renderDigitReversal(step, viz) {
  return `<div style="padding:24px;text-align:center;">
    <div style="display:inline-flex;align-items:center;gap:12px;padding:12px 24px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-lg);">
      <span style="font-family:var(--font-code);font-size:18px;color:var(--text-secondary);">x</span>
      <span style="font-family:var(--font-code);font-size:16px;color:var(--text-primary);">${step.highlight.split('→')[0]?.trim() || ''}</span>
      <span style="color:var(--text-tertiary);font-size:16px;">→</span>
      <span style="font-family:var(--font-code);font-size:16px;color:var(--accent);font-weight:600;">rev</span>
      <span style="font-family:var(--font-code);font-size:16px;color:var(--accent);">${step.highlight.split('rev=')[1] || ''}</span>
    </div>
  </div>`;
}

// -------- State Machine (atoi) --------
function renderStateMachine(step, viz) {
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;">${step.highlight}</div>`;
}

// -------- Binary Partition --------
function renderBinaryPartition(step, viz) {
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;line-height:1.8;">
    ${step.highlight}
  </div>`;
}

// -------- Expand Center (Palindrome) --------
function renderExpandCenter(step, viz) {
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;">${step.highlight}</div>`;
}

// -------- Zigzag --------
function renderZigzag(step, viz) {
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;">
    <div style="display:inline-block;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px 20px;font-family:var(--font-code);">
      ${step.highlight}
    </div>
  </div>`;
}

// -------- Sudoku --------
function renderSudoku(step, viz) {
  return `<div style="padding:16px;text-align:center;color:var(--text-secondary);font-size:14px;">${step.highlight}</div>`;
}

// -------- Fibonacci --------
function renderFibonacci(step, viz) {
  const n = viz.example.params.n || 5;
  const fibs = [1, 2];
  for (let i = 2; i < n; i++) fibs.push(fibs[i-1] + fibs[i-2]);

  let html = `<div style="padding:12px 16px;text-align:center;">
    <div style="display:inline-flex;gap:6px;flex-wrap:wrap;justify-content:center;">`;
  
  for (let i = 0; i < n; i++) {
    const isCurrent = i === step.step;
    const isDone = i < step.step || (step.step >= n);
    html += `<div style="
      width:48px;height:48px;display:flex;align-items:center;justify-content:center;flex-direction:column;
      border-radius:var(--radius-md);
      background:${isCurrent ? 'var(--accent-glow)' : isDone ? 'var(--green-bg)' : 'var(--surface-2)'};
      border:1px solid ${isCurrent ? 'var(--accent)' : isDone ? 'var(--green)' : 'var(--border)'};
      color:${isCurrent ? 'var(--accent)' : isDone ? 'var(--green)' : 'var(--text-tertiary)'};
      font-family:var(--font-code);font-size:${isCurrent || isDone ? '16px' : '13px'};
      font-weight:${isCurrent || isDone ? '600' : '400'};
    ">
      <div>${i+1}</div>
      <div style="font-size:9px;color:${isCurrent ? 'var(--accent-dim)' : 'var(--text-tertiary)'};">stair</div>
    </div>`;
  }

  html += `</div>
    <div style="margin-top:12px;font-family:var(--font-code);font-size:14px;">
      dp values: [${fibs.slice(0, step.step + 1).join(', ')}]
    </div>
  </div>`;

  return html;
}

// -------- BFS Tree (e.g. Binary Tree Level Order Traversal) --------
function renderBfsTree(step, viz) {
  // Build a tree structure from the flat level-by-level example data
  const treeData = viz.example.params.tree || [3, 9, 20, null, null, 15, 7];
  const currentLevel = step.level;

  // Build tree nodes with positions for rendering
  // We render level by level with spacing
  function buildLevels(arr) {
    if (!arr.length) return [];
    const levels = [];
    let idx = 0;
    let level = 0;
    const queue = [{ val: arr[0], pos: 0 }];
    while (queue.length > 0) {
      const size = queue.length;
      const current = [];
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        current.push(node);
        const leftIdx = idx * 2 + 1;
        const rightIdx = idx * 2 + 2;
        if (leftIdx < arr.length && arr[leftIdx] !== null && arr[leftIdx] !== undefined) {
          queue.push({ val: arr[leftIdx], pos: leftIdx });
        }
        if (rightIdx < arr.length && arr[rightIdx] !== null && arr[rightIdx] !== undefined) {
          queue.push({ val: arr[rightIdx], pos: rightIdx });
        }
        idx++;
      }
      levels.push(current);
      level++;
    }
    return levels;
  }

  const levels = buildLevels(treeData);
  const maxLevel = levels.length;

  let html = `<div style="padding:12px 16px;text-align:center;">`;

  // Render levels with connecting lines
  levels.forEach((levelNodes, lvl) => {
    const isActive = lvl === currentLevel;
    const isPast = lvl < currentLevel;
    const spacing = Math.max(40, 200 - lvl * 20);

    html += `<div style="display:flex;justify-content:center;gap:${spacing}px;margin-bottom:8px;position:relative;">`;
    
    levelNodes.forEach((node) => {
      let bg = 'var(--surface-2)';
      let border = 'var(--border)';
      let color = 'var(--text-tertiary)';

      if (isActive) {
        bg = 'var(--accent-glow)';
        border = 'var(--accent)';
        color = 'var(--accent)';
      } else if (isPast) {
        bg = 'var(--green-bg)';
        border = 'var(--green)';
        color = 'var(--green)';
      }

      html += `<div style="
        width:40px;height:40px;display:flex;align-items:center;justify-content:center;
        border-radius:50%;
        background:${bg};
        border:2px solid ${border};
        font-family:var(--font-code);font-size:14px;font-weight:600;
        color:${color};
      ">${node.val}</div>`;
    });

    html += `</div>`;

    // Level label
    if (lvl < maxLevel - 1) {
      html += `<div style="font-size:10px;color:var(--text-tertiary);margin-bottom:4px;">
        ${isActive ? '⬅' : ''} Level ${lvl} ${isPast ? '✅' : ''}
      </div>`;
    }
  });

  // Result preview
  if (step.level === -1) {
    html += `<div style="margin-top:12px;padding:8px 16px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius-md);display:inline-block;">
      <span style="color:var(--green);font-weight:600;">✅ Complete!</span>
    </div>`;
  }

  html += `</div>`;
  return html;
}

// =====================================================
// UI Controls
// =====================================================

function updateVizUI() {
  document.getElementById('vizStepInfo').textContent = 
    `Step ${window.vizStep} / ${window.vizTotal}`;
}

function vizPrev() {
  if (window.vizStep > 0) {
    window.vizStep--;
    const viz = _getVizData(currentVizId);
    if (viz) renderVizStep(viz);
    updateVizUI();
  }
}

function vizNext() {
  if (window.vizStep < window.vizTotal) {
    window.vizStep++;
    const viz = _getVizData(currentVizId);
    if (viz) renderVizStep(viz);
    updateVizUI();
  }
}

function vizAutoPlay() {
  if (vizTimer) {
    clearInterval(vizTimer);
    vizTimer = null;
    document.querySelector('.viz-btn.primary').textContent = '▶ Play';
    return;
  }

  document.querySelector('.viz-btn.primary').textContent = '⏸ Pause';
  vizTimer = setInterval(() => {
    if (window.vizStep >= window.vizTotal) {
      clearInterval(vizTimer);
      vizTimer = null;
      document.querySelector('.viz-btn.primary').textContent = '▶ Play';
      return;
    }
    vizNext();
  }, 1500);
}

function vizReset() {
  if (vizTimer) {
    clearInterval(vizTimer);
    vizTimer = null;
    document.querySelector('.viz-btn.primary').textContent = '▶ Play';
  }
  window.vizStep = 0;
  const viz = _getVizData(currentVizId);
  if (viz) renderVizStep(viz);
  updateVizUI();
}

// =====================================================
// Wire up: hook into solution-detail.html's initialization
// =====================================================

// Expose controls globally for HTML onclick handlers
window.vizPrev = vizPrev;
window.vizNext = vizNext;
window.vizAutoPlay = vizAutoPlay;
window.vizReset = vizReset;

// Called from solution-detail.html after solution loads
window.initVizFromDetail = function(solution) {
  currentVizId = solution.id;
  initVisualization(solution);
};

async function initVizEngine() {
  // Check for pending solution
  if (window._pendingVizSolution) {
    initVisualization(window._pendingVizSolution);
    window._pendingVizSolution = null;
    return;
  }
  // Use window.currentSolution
  if (window.currentSolution) {
    initVisualization(window.currentSolution);
  }
}
