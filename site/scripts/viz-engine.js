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

// -------- Sliding Window (e.g. Longest Substring Without Repeating Characters / strStr) --------
function renderSlidingWindow(step, viz) {
  const s = viz.example.params.s || viz.example.params.haystack || '';
  const needle = viz.example.params.needle || '';

  // For strStr-type problems: show haystack with window and needle below
  if (needle) {
    const [l, r] = step.window || [0, needle.length - 1];
    const matchStr = s.slice(l, r + 1);
    const isMatch = matchStr === needle;
    const matchIdx = step.step === 0 ? 6 : step.step * 3;

    let html = `<div style="padding:12px 16px;">`;

    // Haystack with window
    html += `<div style="text-align:center;margin-bottom:6px;">
      <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">haystack</div>
      <div style="display:inline-flex;gap:2px;position:relative;">`;

    for (let i = 0; i < s.length; i++) {
      const inWindow = i >= l && i <= r;
      const isMatchWindow = inWindow && isMatch;
      html += `<div style="
        width:28px;height:32px;display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius-sm);
        font-family:var(--font-code);font-size:13px;font-weight:${inWindow ? '600' : '400'};
        background:${isMatchWindow ? 'var(--green-bg)' : inWindow ? 'var(--accent-glow)' : 'var(--surface-2)'};
        border:1px solid ${isMatchWindow ? 'var(--green)' : inWindow ? 'var(--accent)' : 'var(--border)'};
        color:${isMatchWindow ? 'var(--green)' : inWindow ? 'var(--accent)' : 'var(--text-tertiary)'};
      ">
        ${s[i]}
        ${i === l ? `<div style="position:absolute;bottom:-16px;font-size:9px;color:var(--accent);font-weight:600;">L</div>` : ''}
      </div>`;
    }

    html += `</div></div>`;

    // Needle
    html += `<div style="text-align:center;">
      <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">needle</div>
      <div style="display:inline-flex;gap:2px;justify-content:center;">`;

    for (let i = 0; i < needle.length; i++) {
      html += `<div style="
        width:28px;height:32px;display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius-sm);
        font-family:var(--font-code);font-size:13px;font-weight:600;
        background:${isMatch ? 'var(--green-bg)' : 'var(--surface-1)'};
        border:1px solid ${isMatch ? 'var(--green)' : 'var(--border)'};
        color:${isMatch ? 'var(--green)' : 'var(--text-primary)'};
      ">${needle[i]}</div>`;
    }

    html += `</div></div>`;

    // Window info
    const matchEmoji = isMatch ? '🎯 Match!' : '✗ No match';
    const matchColor = isMatch ? 'var(--green)' : 'var(--red)';
    html += `<div style="margin-top:8px;text-align:center;font-size:12px;font-family:var(--font-code);color:var(--text-secondary);">
      <span style="padding:3px 12px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-sm);">
        haystack[${l}:${r}] = "${matchStr}" vs "${needle}"
        <span style="color:${matchColor};font-weight:600;margin-left:6px;">${matchEmoji}</span>
      </span>
    </div>`;

    html += `</div>`;
    return html;
  }

  // Original sliding window render for Longest Substring
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
  const x = viz.example.params.x;
  const range = step.range || [0, x];
  const mid = step.mid !== undefined ? step.mid : -1;
  const ans = step.ans !== undefined ? step.ans : -1;
  const [low, high] = range;

  let html = `<div style="padding:8px 16px;">`;

  // Number line
  html += `<div style="text-align:center;margin-bottom:8px;">
    <div style="display:inline-flex;gap:2px;align-items:center;position:relative;">`;

  for (let i = 0; i <= x; i++) {
    const isLow = i === low;
    const isHigh = i === high;
    const isMid = i === mid;
    const isAns = i === ans && ans >= 0;
    let bg = 'var(--surface-2)';
    let border = 'var(--border)';
    let color = 'var(--text-tertiary)';

    if (isMid) {
      bg = 'var(--accent-glow)';
      border = 'var(--accent)';
      color = 'var(--accent)';
    } else if (isAns) {
      bg = 'var(--green-bg)';
      border = 'var(--green)';
      color = 'var(--green)';
    } else if (i >= low && i <= high) {
      bg = 'rgba(99,102,241,0.12)';
      border = 'rgba(99,102,241,0.3)';
    }

    html += `<div style="position:relative;display:flex;flex-direction:column;align-items:center;">
      ${isMid ? `<div style="position:absolute;top:-17px;font-size:9px;color:var(--accent);font-weight:600;">mid</div>` : ''}
      <div style="
        width:30px;height:30px;display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius-sm);
        font-family:var(--font-code);font-size:12px;font-weight:${isMid||isAns?'600':'400'};
        background:${bg};border:1px solid ${border};color:${color};
      ">${i}</div>
      ${isLow ? `<div style="font-size:9px;color:rgba(99,102,241,0.9);font-weight:600;margin-top:1px;">L</div>` : ''}
      ${isHigh && high !== low ? `<div style="font-size:9px;color:rgba(99,102,241,0.9);font-weight:600;margin-top:1px;">H</div>` : ''}
    </div>`;
  }

  html += `</div></div>`;

  // Info panel
  html += `<div style="display:flex;justify-content:center;gap:16px;margin-top:12px;flex-wrap:wrap;">
    <span style="font-size:12px;font-family:var(--font-code);color:var(--text-secondary);">
      Range: <span style="color:rgba(99,102,241,0.9);font-weight:600;">[${low}, ${high}]</span>
    </span>
    <span style="font-size:12px;font-family:var(--font-code);color:var(--text-secondary);">
      mid = <span style="color:var(--accent);font-weight:600;">${mid >= 0 ? mid : '-'}</span>
    </span>`;

  if (mid >= 0) {
    const sq = mid * mid;
    html += `<span style="font-size:12px;font-family:var(--font-code);">
      ${mid}² = ${sq}
      ${sq > x
        ? `<span style="color:var(--red);"> &gt; ${x} → go left</span>`
        : `<span style="color:var(--green);"> ≤ ${x} → save ans, go right</span>`}
    </span>`;
  }

  html += `</div>`;

  // Current best ans
  if (ans >= 0) {
    html += `<div style="margin-top:10px;padding:6px 14px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius-md);text-align:center;display:inline-block;width:auto;">
      <span style="color:var(--green);font-weight:600;font-size:13px;">ans = ${ans} (${ans}² = ${ans * ans} ≤ ${x})</span>
    </div>`;
  }

  html += `</div>`;
  return html;
}

// -------- Digit Reversal --------
function renderDigitReversal(step, viz) {
  const x = viz.example.params.x;
  const remaining = step.remaining !== undefined ? step.remaining : x;
  const revVal = step.revVal !== undefined ? step.revVal : 0;
  const pop = step.pop !== undefined ? step.pop : '';

  let html = `<div style="padding:12px 16px;">`;

  // Two rows side by side: remaining vs reversed
  html += `<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">`;

  // Left: remaining x
  const remStr = String(remaining);
  html += `<div style="text-align:center;">
    <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px;font-weight:500;">x (remaining)</div>
    <div style="display:flex;gap:2px;">`;

  const remDigits = remStr.split('');
  if (remDigits.length === 0 || (remDigits.length === 1 && remDigits[0] === '0' && remaining === 0)) {
    html += `<div style="width:32px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);font-size:12px;">0</div>`;
  } else {
    remDigits.forEach((d, i) => {
      const isPop = i === remDigits.length - 1 && step.step > 0;
      html += `<div style="
        width:30px;height:36px;display:flex;align-items:center;justify-content:center;
        border-radius:var(--radius-sm);
        font-family:var(--font-code);font-size:14px;font-weight:600;
        background:${isPop ? 'var(--yellow-bg)' : 'var(--surface-2)'};
        border:1px solid ${isPop ? 'var(--yellow)' : 'var(--border)'};
        color:${isPop ? 'var(--yellow)' : 'var(--text-primary)'};
        position:relative;
      ">
        ${d}
        ${isPop ? `<div style="position:absolute;bottom:-14px;font-size:9px;color:var(--yellow);font-weight:600;">pop</div>` : ''}
      </div>`;
    });
  }

  html += `</div></div>`;

  // Arrow
  html += `<div style="display:flex;align-items:center;font-size:24px;color:var(--accent);opacity:0.7;">→</div>`;

  // Right: building rev
  const revStr = String(revVal);
  html += `<div style="text-align:center;">
    <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:6px;font-weight:500;">rev (building)</div>
    <div style="display:flex;gap:2px;">`;

  revStr.split('').forEach((d, i) => {
    const isNew = i === 0 && step.step > 0 && revVal > 0;
    html += `<div style="
      width:30px;height:36px;display:flex;align-items:center;justify-content:center;
      border-radius:var(--radius-sm);
      font-family:var(--font-code);font-size:14px;font-weight:600;
      background:${isNew ? 'var(--green-bg)' : 'var(--surface-2)'};
      border:1px solid ${isNew ? 'var(--green)' : 'var(--border)'};
      color:${isNew ? 'var(--green)' : 'var(--text-primary)'};
    ">${d}</div>`;
  });

  if (revVal === 0 && step.step === 0) {
    html += `<div style="width:30px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);font-size:12px;border:1px dashed var(--border);border-radius:var(--radius-sm);">0</div>`;
  }

  html += `</div></div></div>`;

  // Formula
  if (step.step > 0 && remaining !== x) {
    html += `<div style="margin-top:12px;padding:8px 16px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-md);text-align:center;font-family:var(--font-code);font-size:13px;">
      <span style="color:var(--text-secondary);">rev = rev × 10 + pop = </span>
      <span style="color:var(--accent);font-weight:600;">${revVal}</span>
      ${step.step === String(Math.abs(x)).length ? `<span style="color:var(--green);margin-left:8px;">✅ Done!</span>` : ''}
    </div>`;
  }

  // Overflow check note
  html += `<div style="margin-top:8px;text-align:center;font-size:11px;color:var(--text-tertiary);">
    Check: rev * 10 + pop would overflow? Constraint: -2³¹ ≤ rev ≤ 2³¹-1
  </div>`;

  html += `</div>`;
  return html;
}

// -------- State Machine (atoi) --------
function renderStateMachine(step, viz) {
  const s = viz.example.params.s || '';
  const state = step.state || 'WHITESPACE';
  const idx = step.idx !== undefined ? step.idx : 0;
  const resultStr = step.resultStr !== undefined ? step.resultStr : '';
  const sign = step.sign !== undefined ? step.sign : 1;

  const states = ['WHITESPACE', 'SIGN', 'DIGITS', 'DONE'];

  let html = `<div style="padding:8px 16px;">`;

  // State flow bar
  html += `<div style="display:flex;align-items:center;justify-content:center;gap:2px;margin-bottom:14px;flex-wrap:wrap;">`;
  states.forEach((st, i) => {
    const stIdx = states.indexOf(state);
    const isActive = st === state;
    const isPast = stIdx > i;
    html += `<div style="
      padding:4px 12px;border-radius:var(--radius-sm);
      font-size:11px;font-weight:${isActive ? '700' : '500'};
      background:${isActive ? 'var(--accent-glow)' : isPast ? 'var(--green-bg)' : 'var(--surface-2)'};
      border:1px solid ${isActive ? 'var(--accent)' : isPast ? 'var(--green)' : 'var(--border)'};
      color:${isActive ? 'var(--accent)' : isPast ? 'var(--green)' : 'var(--text-tertiary)'};
      white-space:nowrap;
    ">${st}</div>`;
    if (i < states.length - 1) {
      html += `<div style="color:var(--text-tertiary);font-size:12px;">→</div>`;
    }
  });
  html += `</div>`;

  // Char-by-char processing
  html += `<div style="text-align:center;margin-bottom:10px;">
    <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">Processing characters</div>
    <div style="display:inline-flex;gap:2px;">`;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const isCurrent = i === idx && state !== 'DONE';
    const isDone = i < idx || (state === 'DONE');
    let bg = 'var(--surface-2)';
    let border = 'var(--border)';
    let color = 'var(--text-tertiary)';

    if (isCurrent) {
      bg = 'var(--accent-glow)';
      border = 'var(--accent)';
      color = 'var(--accent)';
    } else if (isDone) {
      bg = 'var(--green-bg)';
      border = 'var(--green)';
      color = 'var(--green)';
    }

    html += `<div style="
      width:28px;height:30px;display:flex;align-items:center;justify-content:center;
      border-radius:var(--radius-sm);
      font-family:var(--font-code);font-size:13px;font-weight:${isCurrent ? '600' : '400'};
      background:${bg};border:1px solid ${border};color:${color};
    ">${ch === ' ' ? '␣' : ch}</div>`;
  }

  html += `</div></div>`;

  // State info
  html += `<div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:6px;font-size:12px;font-family:var(--font-code);color:var(--text-secondary);">
    <span style="padding:3px 10px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-sm);">
      state: <span style="color:var(--accent);font-weight:600;">${state}</span>
    </span>
    <span style="padding:3px 10px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-sm);">
      sign: <span style="color:var(--accent);font-weight:600;">${sign === -1 ? '-' : '+'}</span>
    </span>
    <span style="padding:3px 10px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-sm);">
      result: <span style="color:var(--accent);font-weight:600;">${resultStr || '""'}</span>
    </span>
  </div>`;

  // Final result
  if (state === 'DONE') {
    const finalVal = parseInt(resultStr || '0', 10) * sign;
    html += `<div style="margin-top:12px;padding:8px 16px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius-md);text-align:center;">
      <span style="color:var(--green);font-weight:600;font-size:14px;">✅ Return ${finalVal}</span>
    </div>`;
  }

  html += `</div>`;
  return html;
}

// -------- Binary Partition (Median of Two Sorted Arrays) --------
function renderBinaryPartition(step, viz) {
  const nums1 = viz.example.params.nums1 || [];
  const nums2 = viz.example.params.nums2 || [];
  const pA = step.partitionA !== undefined ? step.partitionA : -1;
  const pB = step.partitionB !== undefined ? step.partitionB : -1;

  const leftA = pA > 0 ? nums1.slice(0, pA) : [];
  const rightA = nums1.slice(pA);
  const leftB = pB > 0 ? nums2.slice(0, pB) : [];
  const rightB = nums2.slice(pB);

  const aLeftMax = leftA.length ? Math.max(...leftA) : -Infinity;
  const aRightMin = rightA.length ? Math.min(...rightA) : Infinity;
  const bLeftMax = leftB.length ? Math.max(...leftB) : -Infinity;
  const bRightMin = rightB.length ? Math.min(...rightB) : Infinity;

  const condMet = aLeftMax <= bRightMin && bLeftMax <= aRightMin;

  let html = `<div style="padding:8px 16px;">`;

  // Partition display for both arrays
  function renderArray(name, arr, partition) {
    let h = `<div style="text-align:center;">
      <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;font-weight:500;">${name}</div>
      <div style="display:inline-flex;gap:1px;border-radius:var(--radius-sm);overflow:hidden;">`;

    if (arr.length === 0) {
      h += `<div style="padding:4px 12px;font-size:12px;color:var(--text-tertiary);border:1px dashed var(--border);border-radius:var(--radius-sm);">empty</div>`;
    } else {
      arr.forEach((val, i) => {
        const isLeft = partition >= 0 && i < partition;
        h += `<div style="
          width:34px;height:34px;display:flex;align-items:center;justify-content:center;
          font-family:var(--font-code);font-size:13px;font-weight:600;
          background:${isLeft ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)'};
          border:0.5px solid ${isLeft ? 'rgba(99,102,241,0.5)' : 'var(--border)'};
          color:${isLeft ? '#818CF8' : 'var(--text-primary)'};
        ">${val}</div>`;
      });
    }

    h += `</div>
      <div style="display:flex;justify-content:center;gap:6px;margin-top:2px;">
        <span style="font-size:10px;color:#818CF8;font-family:var(--font-code);background:rgba(99,102,241,0.1);padding:1px 6px;border-radius:2px;">Lmax: ${isFinite(aLeftMax) && name === 'A' ? aLeftMax : isFinite(bLeftMax) && name === 'B' ? bLeftMax : '-∞'}</span>
        <span style="font-size:10px;color:var(--text-tertiary);font-family:var(--font-code);">|</span>
        <span style="font-size:10px;color:var(--text-tertiary);font-family:var(--font-code);background:var(--surface-0);padding:1px 6px;border-radius:2px;">Rmin: ${isFinite(aRightMin) && name === 'A' ? aRightMin : isFinite(bRightMin) && name === 'B' ? bRightMin : '∞'}</span>
      </div>
    </div>`;
    return h;
  }

  html += `<div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;">
    ${renderArray('A (nums1)', nums1, pA)}
    ${renderArray('B (nums2)', nums2, pB)}
  </div>`;

  // Partition info
  html += `<div style="margin-top:6px;text-align:center;font-size:11px;font-family:var(--font-code);color:var(--text-tertiary);">
    partitionA = ${pA}, partitionB = ${pB}
  </div>`;

  // Condition checks
  html += `<div style="margin-top:10px;display:flex;justify-content:center;gap:12px;flex-wrap:wrap;font-size:11px;font-family:var(--font-code);">
    <div style="padding:5px 12px;border-radius:var(--radius-sm);background:var(--surface-0);border:1px solid var(--border);">
      A_left_max(${isFinite(aLeftMax) ? aLeftMax : '-∞'}) ≤ B_right_min(${isFinite(bRightMin) ? bRightMin : '∞'})?
      ${aLeftMax <= bRightMin ? `<span style="color:var(--green);"> ✓</span>` : `<span style="color:var(--red);"> ✗</span>`}
    </div>
    <div style="padding:5px 12px;border-radius:var(--radius-sm);background:var(--surface-0);border:1px solid var(--border);">
      B_left_max(${isFinite(bLeftMax) ? bLeftMax : '-∞'}) ≤ A_right_min(${isFinite(aRightMin) ? aRightMin : '∞'})?
      ${bLeftMax <= aRightMin ? `<span style="color:var(--green);"> ✓</span>` : `<span style="color:var(--red);"> ✗</span>`}
    </div>
  </div>`;

  // Result
  if (condMet && pA >= 0) {
    const total = nums1.length + nums2.length;
    const median = total % 2 === 1
      ? Math.max(aLeftMax, bLeftMax)
      : (Math.max(aLeftMax, bLeftMax) + Math.min(aRightMin, bRightMin)) / 2;
    html += `<div style="margin-top:12px;padding:10px 16px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius-md);text-align:center;">
      <span style="color:var(--green);font-weight:600;font-size:14px;">
        ✓ Condition met! total=${total} (${total % 2 === 0 ? 'even' : 'odd'}) → median = <span style="font-family:var(--font-code);">${median}</span>
      </span>
    </div>`;
  }

  html += `</div>`;
  return html;
}

// -------- Expand Center (Palindrome) --------
function renderExpandCenter(step, viz) {
  const s = viz.example.params.s || 'babad';
  const isLast = step.step === viz.steps.length - 1;
  const center = step.center !== undefined ? step.center : -1;
  const radius = step.radius !== undefined ? step.radius : 0;
  const longest = step.longest || '';

  let html = `<div style="padding:8px 16px;">`;

  // Original string with expansion highlighting
  html += `<div style="text-align:center;margin-bottom:6px;">
    <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">String with expanding window</div>
    <div style="display:inline-flex;gap:2px;">`;

  for (let i = 0; i < s.length; i++) {
    const isInPal = center >= 0 && radius > 0 &&
      i >= Math.max(0, center - radius) && i <= Math.min(s.length - 1, center + radius);
    const isCenter = center >= 0 && i === center;

    let bg = 'var(--surface-2)';
    let border = 'var(--border)';
    let color = 'var(--text-primary)';

    if (isCenter) {
      bg = 'var(--accent-glow)';
      border = 'var(--accent)';
      color = 'var(--accent)';
    } else if (isInPal) {
      bg = 'rgba(99,102,241,0.15)';
      border = 'rgba(99,102,241,0.4)';
      color = '#818CF8';
    }

    html += `<div style="
      width:32px;height:36px;display:flex;align-items:center;justify-content:center;
      border-radius:var(--radius-sm);
      font-family:var(--font-code);font-size:14px;font-weight:${isInPal ? '700' : '400'};
      background:${bg};border:1px solid ${border};color:${color};
      transform:${isCenter ? 'scale(1.1)' : 'scale(1)'};
      transition:all 0.15s;
    ">${s[i]}</div>`;
  }

  html += `</div></div>`;

  // Center & radius info
  if (center >= 0 && radius >= 0) {
    const curPal = longest || s.slice(Math.max(0, center - radius), Math.min(s.length, center + radius + 1));
    html += `<div style="text-align:center;margin-bottom:6px;">
      <div style="display:inline-flex;align-items:center;gap:10px;padding:4px 16px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-md);font-size:12px;font-family:var(--font-code);color:var(--text-secondary);flex-wrap:wrap;">
        <span>center = <span style="color:var(--accent);font-weight:600;">${center}</span> ('${s[center]}')</span>
        <span style="color:var(--border);">|</span>
        <span>radius = <span style="color:var(--accent);font-weight:600;">${radius}</span></span>
        <span style="color:var(--border);">|</span>
        <span>palindrome = <span style="color:var(--accent);font-weight:600;">"${curPal}"</span></span>
      </div>
    </div>`;
  }

  // Expansion check
  if (center >= 0 && radius > 0) {
    const l = center - radius;
    const r = center + radius;
    if (l >= 0 && r < s.length) {
      html += `<div style="text-align:center;">
        <div style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-family:var(--font-code);padding:4px 16px;background:var(--surface-0);border-radius:var(--radius-md);border:1px solid var(--border);">
          <span>Expand: s[${l}]('${s[l]}') == s[${r}]('${s[r]}')?</span>
          <span style="color:var(--green);font-weight:700;"> ✓</span>
        </div>
      </div>`;
    }
  }

  // Final result
  if (isLast && longest) {
    html += `<div style="margin-top:12px;padding:10px 16px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius-md);text-align:center;">
      <span style="color:var(--green);font-weight:600;font-size:14px;">✅ Longest palindrome: "${longest}"</span>
    </div>`;
  }

  html += `</div>`;
  return html;
}

// -------- Zigzag --------
function renderZigzag(step, viz) {
  const s = viz.example.params.s || '';
  const numRows = viz.example.params.numRows || 3;
  const rows = step.rows || [];
  const curRow = step.curRow !== undefined ? step.curRow : 0;
  const direction = step.direction || 'down';

  let html = `<div style="padding:8px 16px;">`;

  // Render zigzag rows as visual grid
  html += `<div style="display:flex;flex-direction:column;gap:3px;align-items:center;">`;

  for (let r = 0; r < numRows; r++) {
    const rowChars = (rows[r] || '').split('');
    const isActiveRow = r === curRow;
    html += `<div style="display:flex;gap:3px;align-items:center;">
      <div style="width:22px;text-align:right;font-size:10px;color:var(--text-tertiary);font-family:var(--font-code);font-weight:${isActiveRow ? '600' : '400'};">R${r}</div>
      <div style="display:flex;gap:2px;">`;

    const filledLen = rowChars.length;
    // Render up to s.length slots
    for (let j = 0; j < s.length; j++) {
      const ch = rowChars[j];
      if (!ch) {
        // Empty cell
        html += `<div style="
          width:26px;height:30px;display:flex;align-items:center;justify-content:center;
          border-radius:2px;
          background:rgba(255,255,255,0.015);
          border:1px dashed rgba(255,255,255,0.04);
        "></div>`;
      } else {
        const isNew = j === filledLen - 1 && isActiveRow;
        html += `<div style="
          width:26px;height:30px;display:flex;align-items:center;justify-content:center;
          border-radius:var(--radius-sm);
          font-family:var(--font-code);font-size:13px;font-weight:${isNew ? '700' : '500'};
          background:${isNew ? 'var(--accent-glow)' : 'var(--surface-2)'};
          border:1px solid ${isNew ? 'var(--accent)' : 'var(--border)'};
          color:${isNew ? 'var(--accent)' : 'var(--text-primary)'};
        ">${ch}</div>`;
      }
    }

    html += `</div></div>`;
  }

  html += `</div>`;

  // Direction & position info
  html += `<div style="text-align:center;margin-top:10px;">
    <div style="display:inline-flex;align-items:center;gap:16px;padding:5px 16px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-md);font-size:12px;font-family:var(--font-code);color:var(--text-secondary);flex-wrap:wrap;">
      <span>row: <span style="color:var(--accent);font-weight:600;">${curRow}</span></span>
      <span>
        direction:
        <span style="color:var(--accent);font-weight:600;display:inline-flex;align-items:center;gap:4px;">
          ${direction === 'down' ? '↓ DOWN' : '↑ UP'}
        </span>
      </span>
      <span>rows: ${numRows}</span>
      <span style="color:var(--text-tertiary);">(${curRow === 0 ? '↻ flip to down' : curRow === numRows - 1 ? '↺ flip to up' : ''})</span>
    </div>
  </div>`;

  // Final result
  if (step.step === viz.steps.length - 1 && rows.length > 0) {
    const result = rows.join('');
    html += `<div style="margin-top:12px;padding:8px 16px;background:var(--green-bg);border:1px solid var(--green);border-radius:var(--radius-md);text-align:center;">
      <span style="color:var(--green);font-weight:600;font-size:14px;">✅ Result: "${result}"</span>
    </div>`;
  }

  html += `</div>`;
  return html;
}

// -------- Sudoku --------
function renderSudoku(step, viz) {
  const defaultBoard = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]
  ];
  const board = viz.example.params.board || defaultBoard;
  const highlighted = step.highlighted || [];
  const seenCount = step.seenCount !== undefined ? step.seenCount : 0;
  const valid = step.valid !== undefined ? step.valid : true;

  let html = `<div style="padding:8px 16px;">`;

  // 9×9 Sudoku board
  html += `<div style="display:flex;justify-content:center;">
    <div style="display:inline-flex;flex-direction:column;gap:0;border:2px solid var(--accent-dim);border-radius:var(--radius-sm);overflow:hidden;">`;

  for (let r = 0; r < 9; r++) {
    html += `<div style="display:flex;">`;
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      const isEmpty = val === '.';
      const isHighlighted = highlighted.some(([hr, hc]) => hr === r && hc === c);

      // Build borders
      const borders = [];
      borders.push(`border-top:${r % 3 === 0 ? '1.5px' : '0.5px'} solid ${r % 3 === 0 ? 'var(--accent-dim)' : 'rgba(255,255,255,0.08)'}`);
      borders.push(`border-bottom:${(r + 1) % 3 === 0 || r === 8 ? '1.5px' : '0.5px'} solid ${(r + 1) % 3 === 0 ? 'var(--accent-dim)' : 'rgba(255,255,255,0.08)'}`);
      borders.push(`border-left:${c % 3 === 0 ? '1.5px' : '0.5px'} solid ${c % 3 === 0 ? 'var(--accent-dim)' : 'rgba(255,255,255,0.08)'}`);
      borders.push(`border-right:${(c + 1) % 3 === 0 || c === 8 ? '1.5px' : '0.5px'} solid ${(c + 1) % 3 === 0 ? 'var(--accent-dim)' : 'rgba(255,255,255,0.08)'}`);

      let bg = 'var(--surface-1)';
      let color = isEmpty ? 'transparent' : 'var(--text-primary)';

      if (isHighlighted) {
        bg = 'var(--accent-glow)';
        color = 'var(--accent)';
      } else if (!isEmpty) {
        bg = 'var(--surface-2)';
      }

      html += `<div style="
        ${borders.join(';')};
        width:30px;height:30px;display:flex;align-items:center;justify-content:center;
        font-family:var(--font-code);font-size:13px;font-weight:600;
        background:${bg};color:${color};
        transition:all 0.15s;
      ">${isEmpty ? '' : val}</div>`;
    }
    html += `</div>`;
  }

  html += `</div></div>`;

  // Status info
  const statusColor = valid ? 'var(--green)' : 'var(--red)';
  const statusText = valid ? '✅ Valid board' : '❌ Duplicate found';
  html += `<div style="margin-top:10px;text-align:center;font-size:12px;font-family:var(--font-code);color:var(--text-secondary);">
    <span style="padding:3px 12px;background:var(--surface-0);border:1px solid var(--border);border-radius:var(--radius-sm);">
      Cells processed: <span style="color:var(--accent);font-weight:600;">${seenCount}</span> /
      <span style="color:var(--text-tertiary);">81</span>
    </span>
    <span style="margin-left:8px;padding:3px 12px;background:${valid ? 'var(--green-bg)' : 'var(--red-bg)'};border:1px solid ${statusColor};border-radius:var(--radius-sm);color:${statusColor};font-weight:600;">
      ${statusText}
    </span>
  </div>`;

  // Encoding example
  if (highlighted.length > 0) {
    const [hr, hc] = highlighted[0];
    const boxId = Math.floor(hr / 3) * 3 + Math.floor(hc / 3);
    const val = board[hr][hc];
    const encoding = [val, hr, hc, boxId].join('|');
    html += `<div style="margin-top:8px;text-align:center;font-size:11px;font-family:var(--font-code);color:var(--text-tertiary);">
      Encoding: <span style="color:var(--accent);">"${val} in row ${hr}"</span>,
      <span style="color:var(--accent);">"${val} in col ${hc}"</span>,
      <span style="color:var(--accent);">"${val} in box ${boxId}"</span>
    </div>`;
  }

  html += `</div>`;
  return html;
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
