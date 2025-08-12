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

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {

  /**
   * Reset all agents to their initial state (all steps done except last, last step active if any)
   */
  resetAllAgents() {
    this.agents.forEach(agent => {
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
  agentEvents: Array<{ agent: string; text: string; time: string; type: string; icon: string }> = [
    { agent: 'Agent 1', text: 'Started extraction', time: '10:01 AM', type: 'status', icon: '⚡' },
    { agent: 'Agent 2', text: 'Risk score calculated', time: '10:02 AM', type: 'message', icon: '💬' },
    { agent: 'Agent 3', text: 'Stopped by user', time: '10:03 AM', type: 'error', icon: '⛔' },
    { agent: 'Agent 4', text: 'Portfolio generated', time: '10:04 AM', type: 'status', icon: '✅' },
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
    const activeStep = agent.steps.find((s) => s.active) || agent.steps.find((s) => !s.done) || agent.steps[0];
    this.selectedAgentStep = activeStep?.label || '';
    this.selectedAgentProgress = Math.round((agent.steps.filter((s) => s.done).length / agent.steps.length) * 100);
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
        { label: 'Portfolio Generation in Progress', done: true, active: false },
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
    const agentNum = agentNumber ?? this.agents.findIndex((a) => a === agent) + 1;
    this.agentIntervals[idx] = setInterval(() => {
      if (!agent.active) return;
      let current = agent.steps.findIndex((s) => s.active);
      if (current === -1) current = 0;
      if (current > 0) agent.steps[current - 1].done = true;
      agent.steps.forEach((s, i) => (s.active = false));
      const now = new Date().toLocaleTimeString();
      if (current < agent.steps.length) {
        agent.steps[current].active = true;
        this.logs.unshift(`[${now}] Agent ${agentNum}: ${agent.steps[current].label} started`);
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
}
