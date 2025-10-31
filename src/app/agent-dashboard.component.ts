/**
 * Agent Dashboard Component
 * Modern multi-agent dashboard with live chat, radar, carousel, and simulation.
 * Maintainer: Ansh (Curious-Confused-Dev)
 * Last updated: 2025-08-10
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AgentStep {
  label: string;
  done: boolean;
  active: boolean;
}

interface Agent {
  active: boolean;
  steps: AgentStep[];
  // Add more properties as needed, e.g., type, progress, etc.
  // type?: string; // Optional type property for agent categorization
  // progress?: number; // Optional progress percentage
}

interface NewAgent {
  name: string;
  type: string;
  stepsText: string;
  steps: string[];
  isActive: boolean;
  enableNotifications: boolean;
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  /**
   * Reset all agents to their initial state (all steps done except last, last step active if any)
   */
  resetAllAgents() {
    this.agents.forEach((agent) => {
      agent.active = false;
      agent.steps.forEach((step, idx) => {
        step.done = idx < agent.steps.length - 1;
        step.active = idx === agent.steps.length - 1;
      });
    });
    this.logs.unshift(`[${new Date().toLocaleTimeString()}] All agents reset`);
    this.logs = this.logs.slice(0, 30);
  }

  /**
   * Clear all logs and chat feed
   */
  clearAllLogs() {
    this.logs = [];
    this.agentEvents = [];
  }
  // Tab state for new screens
  activeTab: 'dashboard' | 'feed' | 'radar' | 'carousel' = 'dashboard';

  // For Live Chat & Activity Feed
  agentEvents: Array<{
    agent: string;
    text: string;
    time: string;
    type: string;
    icon: string;
  }> = [
    {
      agent: 'Agent 1',
      text: 'Started extraction',
      time: '10:01 AM',
      type: 'status',
      icon: '⚡',
    },
    {
      agent: 'Agent 2',
      text: 'Risk score calculated',
      time: '10:02 AM',
      type: 'message',
      icon: '💬',
    },
    {
      agent: 'Agent 3',
      text: 'Stopped by user',
      time: '10:03 AM',
      type: 'error',
      icon: '⛔',
    },
    {
      agent: 'Agent 4',
      text: 'Portfolio generated',
      time: '10:04 AM',
      type: 'status',
      icon: '✅',
    },
  ];
  newMessage: string = '';

  sendAgentMessage() {
    if (this.newMessage.trim()) {
      this.agentEvents.unshift({
        agent: 'You',
        text: this.newMessage,
        time: new Date().toLocaleTimeString(),
        type: 'message',
        icon: '💬',
      });
      this.newMessage = '';
    }
  }

  // For Agent Detail overlay (used in carousel)
  showAgentDetail = false;
  selectedAgentIndex = 0;
  selectedAgentType = '';
  selectedAgentStep = '';
  selectedAgentProgress = 0;

  openAgentDetail(idx: number) {
    this.selectedAgentIndex = idx;
    this.selectedAgentType = 'Type ' + (idx + 1); // Replace with real type if available
    const agent = this.agents[idx];
    const activeStep =
      agent.steps.find((s) => s.active) ||
      agent.steps.find((s) => !s.done) ||
      agent.steps[0];
    this.selectedAgentStep = activeStep?.label || '';
    this.selectedAgentProgress = Math.round(
      (agent.steps.filter((s) => s.done).length / agent.steps.length) * 100
    );
    this.showAgentDetail = true;
  }

  // For SVG math in template
  Math = Math;

  agents: Agent[] = [
    {
      active: false,
      steps: [
        { label: 'Extraction', done: true, active: false },
        { label: 'Processing', done: true, active: false },
        { label: 'Uploading', done: true, active: false },
        { label: 'Mapped', done: true, active: false },
      ],
    },
    {
      active: false,
      steps: [
        { label: 'Risk Score Calculation', done: true, active: false },
        { label: 'Risk Score Completed', done: true, active: false },
        { label: 'Strategy Generation', done: true, active: false },
        { label: 'Strategy Generated', done: true, active: false },
        { label: 'Strategy Allocated', done: true, active: false },
      ],
    },
    {
      active: false,
      steps: [
        { label: 'IPS Generation Started', done: true, active: false },
        { label: 'IPS Generation in Progress', done: true, active: false },
        { label: 'IPS Generated', done: true, active: false },
      ],
    },
    {
      active: true,
      steps: [
        { label: 'Portfolio Generation Started', done: true, active: false },
        {
          label: 'Portfolio Generation in Progress',
          done: true,
          active: false,
        },
        { label: 'Portfolio Generated', done: true, active: false },
        { label: 'Portfolio ...', done: false, active: true },
      ],
    },
  ];

  logs: string[] = [
    '✓ Agent 4: Portfolio Generated done',
    '>> Agent 4: Portfolio Allocated',
    '✓ Agent 4: Portfolio Generation in Progress done',
    '✓ Agent 4: Portfolio Generated',
    '✓ Agent 4: Portfolio Generation Started done',
    '>> Agent 4: Portfolio Generation in Progress',
    '>>> Agent 4: Online',
  ];

  private agentIntervals: any[] = [];

  ngOnInit() {
    // Start simulation for all agents
    this.agents.forEach((agent, idx) => {
      if (agent.active) {
        this.startAgentSimulation(agent, idx);
      }
    });
  }

  ngOnDestroy() {
    this.agentIntervals.forEach(clearInterval);
  }

  toggleAgent(agent: Agent) {
    agent.active = !agent.active;
    const idx = this.agents.indexOf(agent);
    const agentNumber = this.agents.findIndex((a) => a === agent) + 1;
    const now = new Date().toLocaleTimeString();
    if (agent.active) {
      this.logs.unshift(`[${now}] Agent ${agentNumber} started`);
      this.startAgentSimulation(agent, idx, agentNumber);
    } else {
      this.logs.unshift(`[${now}] Agent ${agentNumber} stopped`);
      this.stopAgentSimulation(idx);
    }
    this.logs = this.logs.slice(0, 30);
  }

  startAgentSimulation(agent: Agent, idx: number, agentNumber?: number) {
    this.stopAgentSimulation(idx);
    let stepIdx = agent.steps.findIndex((s) => s.active);
    if (stepIdx === -1) stepIdx = agent.steps.findIndex((s) => !s.done);
    if (stepIdx === -1) stepIdx = 0;
    agent.steps.forEach((s, i) => {
      s.active = i === stepIdx;
      s.done = i < stepIdx;
    });
    const agentNum =
      agentNumber ?? this.agents.findIndex((a) => a === agent) + 1;
    this.agentIntervals[idx] = setInterval(() => {
      if (!agent.active) return;
      let current = agent.steps.findIndex((s) => s.active);
      if (current === -1) current = 0;
      if (current > 0) agent.steps[current - 1].done = true;
      agent.steps.forEach((s, i) => (s.active = false));
      const now = new Date().toLocaleTimeString();
      if (current < agent.steps.length) {
        agent.steps[current].active = true;
        this.logs.unshift(
          `[${now}] Agent ${agentNum}: ${agent.steps[current].label} started`
        );
        this.logs = this.logs.slice(0, 30);
        setTimeout(() => {
          if (agent.active) {
            agent.steps[current].done = true;
            agent.steps[current].active = false;
            if (current + 1 < agent.steps.length) {
              agent.steps[current + 1].active = true;
            }
          }
        }, 1200 + Math.random() * 1200);
      } else {
        this.logs.unshift(`[${now}] Agent ${agentNum}: All steps done`);
        this.logs = this.logs.slice(0, 30);
        clearInterval(this.agentIntervals[idx]);
      }
    }, 2000 + Math.random() * 2000);
  }

  stopAgentSimulation(idx: number) {
    if (this.agentIntervals[idx]) {
      clearInterval(this.agentIntervals[idx]);
      this.agentIntervals[idx] = null;
    }
  }

  newAgent: NewAgent = {
    name: '',
    type: '',
    stepsText: '',
    steps: [],
    isActive: false,
    enableNotifications: false
  };

  updateStepsPreview() {
    this.newAgent.steps = this.newAgent.stepsText
      .split(/[\n,]/)
      .map(step => step.trim())
      .filter(step => step.length > 0);
    this.previewAgent();
  }

  previewAgent() {
    // Preview updates automatically through template binding
  }

  addNewAgent() {
    if (this.validateNewAgent()) {
      this.agents.push({
        active: this.newAgent.isActive,
        steps: this.newAgent.steps.map(label => ({
          label,
          done: false,
          active: false
        }))
      });

      // Add to logs
      this.logs.unshift(`>>> New Agent Added: ${this.newAgent.name} (${this.newAgent.type})`);

      // Reset form
      this.newAgent = {
        name: '',
        type: '',
        stepsText: '',
        steps: [],
        isActive: false,
        enableNotifications: false
      };
    }
  }

  private validateNewAgent(): boolean {
    return !!(this.newAgent.name && this.newAgent.type && this.newAgent.steps.length > 0);
  }
}

// <!doctype html>
// <html lang="en">
// <head>
//   <meta charset="utf-8" />
//   <meta name="viewport" content="width=device-width,initial-scale=1" />
//   <title>FakeStore — Cart #2 Viewer</title>
//   <style>
//     :root{--bg:#f6f8fa;--card:#fff;--muted:#6b7280;--accent:#111827}
//     *{box-sizing:border-box}
//     html,body{height:100%;margin:0;font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:var(--bg);color:var(--accent)}
//     main{max-width:1000px;margin:28px auto;padding:20px}
//     header{display:flex;gap:12px;align-items:center;justify-content:space-between}
//     h1{font-size:20px;margin:0}
//     #controls{display:flex;gap:8px;align-items:center}
//     button{background:#111827;color:#fff;border:0;padding:8px 12px;border-radius:8px;cursor:pointer}
//     button.secondary{background:#efefef;color:#111}
//     #status{margin:12px 0;color:var(--muted)}
//     ul.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;padding:0;list-style:none;margin:0}
//     .card{background:var(--card);border-radius:12px;box-shadow:0 6px 18px rgba(17,24,39,0.06);overflow:hidden;display:flex;flex-direction:column}
//     .card img{width:100%;height:200px;object-fit:contain;background:#fff;padding:16px}
//     .card .body{padding:12px}
//     .card h2{font-size:14px;margin:0 0 8px 0;height:38px;overflow:hidden}
//     .price{font-weight:700;margin:0 0 6px 0}
//     .qty{margin:0;color:var(--muted);font-size:13px}
//     .meta{display:flex;justify-content:space-between;align-items:center;padding:10px 0}
//     .totals{margin-top:14px;padding:12px;border-radius:10px;background:linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));display:flex;justify-content:space-between;align-items:center}
//     @media (max-width:600px){.card img{height:160px}}
//   </style>
// </head>
// <body>
//   <main>
//     <header>
//       <h1>FakeStore Cart Viewer — Cart <small>#2</small></h1>
//       <div id="controls">
//         <button id="refresh">Refresh</button>
//         <button id="retry" class="secondary" style="display:none">Retry Failed</button>
//       </div>
//     </header>

//     <div id="status">Initializing…</div>

//     <ul id="products" class="grid" aria-live="polite"></ul>

//     <div id="summary" style="display:none" class="totals">
//       <div id="count"></div>
//       <div id="total"></div>
//     </div>
//   </main>

//   <script>
//   'use strict';

//   // --- Config ---
//   const API_BASE = 'https://fakestoreapi.com';
//   const CART_ID = 2;

//   // --- DOM refs ---
//   const statusEl = document.getElementById('status');
//   const productsEl = document.getElementById('products');
//   const refreshBtn = document.getElementById('refresh');
//   const retryBtn = document.getElementById('retry');
//   const summaryEl = document.getElementById('summary');
//   const countEl = document.getElementById('count');
//   const totalEl = document.getElementById('total');

//   function setStatus(msg, isError = false) {
//     statusEl.textContent = msg;
//     statusEl.style.color = isError ? '#b00020' : '';
//   }

//   async function fetchJSON(url) {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
//     return res.json();
//   }

//   async function fetchCart(id) {
//     return fetchJSON(`${API_BASE}/carts/${id}`);
//   }

//   async function fetchProduct(id) {
//     return fetchJSON(`${API_BASE}/products/${id}`);
//   }

//   function escapeHtml(str = '') {
//     return String(str)
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#39;');
//   }

//   function formatCurrency(value, currency = 'USD') {
//     return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
//   }

//   function createCard(product, qty) {
//     const li = document.createElement('li');
//     li.className = 'card';

//     const img = document.createElement('img');
//     img.src = product.image;
//     img.alt = product.title || 'product image';
//     img.loading = 'lazy';
//     img.onerror = () => { img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888">No image</text></svg>'; };

//     const body = document.createElement('div');
//     body.className = 'body';

//     const h2 = document.createElement('h2');
//     h2.innerText = product.title;

//     const price = document.createElement('p');
//     price.className = 'price';
//     price.innerText = formatCurrency(product.price, 'USD');

//     const qtyEl = document.createElement('p');
//     qtyEl.className = 'qty';
//     qtyEl.innerText = `Qty: ${qty}`;

//     body.appendChild(h2);
//     body.appendChild(price);
//     body.appendChild(qtyEl);

//     li.appendChild(img);
//     li.appendChild(body);

//     return li;
//   }

//   // --- Main init flow ---
//   let lastFailed = []; // keep track of failed product ids

//   async function loadCartAndProducts(options = { retryFailedOnly: false }) {
//     setStatus('Fetching cart…');
//     productsEl.innerHTML = '';
//     summaryEl.style.display = 'none';
//     retryBtn.style.display = 'none';

//     try {
//       const cart = await fetchCart(CART_ID);
//       const products = Array.isArray(cart.products) ? cart.products : [];

//       if (products.length === 0) {
//         setStatus('Cart is empty');
//         return;
//       }

//       // Deduplicate productIds and sum quantities
//       const map = new Map();
//       for (const item of products) {
//         const id = Number(item.productId);
//         const q = Number(item.quantity) || 1;
//         map.set(id, (map.get(id) || 0) + q);
//       }

//       // If user asked to retry only previously failed IDs, filter
//       let entries = Array.from(map.entries()); // [ [id, qty], ... ]
//       if (options.retryFailedOnly && lastFailed.length) {
//         entries = entries.filter(([id]) => lastFailed.includes(id));
//       }

//       setStatus('Fetching product details…');

//       // Fetch all product details in parallel, but be resilient to failures
//       const promises = entries.map(([id, qty]) =>
//         fetchProduct(id)
//           .then(data => ({ status: 'fulfilled', id, data, qty }))
//           .catch(err => ({ status: 'rejected', id, err, qty }))
//       );

//       const results = await Promise.all(promises);

//       // Separate successes and failures
//       const successes = results.filter(r => r.status === 'fulfilled');
//       const failures = results.filter(r => r.status === 'rejected');

//       lastFailed = failures.map(f => f.id);

//       if (successes.length) {
//         // Render successes
//         for (const item of successes) {
//           productsEl.appendChild(createCard(item.data, item.qty));
//         }

//         // summary
//         const count = successes.length;
//         const total = successes.reduce((acc, cur) => acc + (Number(cur.data.price) || 0) * (cur.qty || 1), 0);
//         summaryEl.style.display = '';
//         countEl.textContent = `${count} product${count > 1 ? 's' : ''}`;
//         totalEl.textContent = `Total: ${formatCurrency(total, 'USD')}`;

//         setStatus(`Loaded ${count} product${count > 1 ? 's' : ''}${failures.length ? ` — ${failures.length} failed` : ''}`);
//       } else {
//         setStatus('Failed to load any product details', true);
//       }

//       if (failures.length) {
//         retryBtn.style.display = '';
//         retryBtn.onclick = () => loadCartAndProducts({ retryFailedOnly: true });
//       }

//     } catch (err) {
//       console.error(err);
//       setStatus('Failed to fetch cart: ' + err.message, true);
//     }
//   }

//   // --- wire UI ---
//   refreshBtn.addEventListener('click', () => loadCartAndProducts({ retryFailedOnly: false }));

//   // initial load
//   loadCartAndProducts();

//   </script>
// </body>
// </html>
