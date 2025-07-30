import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AgentStep {
  label: string;
  done: boolean;
  active: boolean;
}

interface Agent {
  active: boolean;
  steps: AgentStep[];
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {
  agents: Agent[] = [
    {
      active: false,
      steps: [
        { label: 'Extraction', done: true, active: false },
        { label: 'Processing', done: true, active: false },
        { label: 'Uploading', done: true, active: false },
        { label: 'Mapped', done: true, active: false },
      ]
    },
    {
      active: false,
      steps: [
        { label: 'Risk Score Calculation', done: true, active: false },
        { label: 'Risk Score Completed', done: true, active: false },
        { label: 'Strategy Generation', done: true, active: false },
        { label: 'Strategy Generated', done: true, active: false },
        { label: 'Strategy Allocated', done: true, active: false },
      ]
    },
    {
      active: false,
      steps: [
        { label: 'IPS Generation Started', done: true, active: false },
        { label: 'IPS Generation in Progress', done: true, active: false },
        { label: 'IPS Generated', done: true, active: false },
      ]
    },
    {
      active: true,
      steps: [
        { label: 'Portfolio Generation Started', done: true, active: false },
        { label: 'Portfolio Generation in Progress', done: true, active: false },
        { label: 'Portfolio Generated', done: true, active: false },
        { label: 'Portfolio ...', done: false, active: true },
      ]
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
    const agentNumber = this.agents.findIndex(a => a === agent) + 1;
    if (agent.active) {
      this.logs.unshift(`Agent ${agentNumber} started at ${new Date().toLocaleTimeString()}`);
      this.startAgentSimulation(agent, idx, agentNumber);
    } else {
      this.logs.unshift(`Agent ${agentNumber} stopped at ${new Date().toLocaleTimeString()}`);
      this.stopAgentSimulation(idx);
    }
    this.logs = this.logs.slice(0, 30);
  }

  startAgentSimulation(agent: Agent, idx: number, agentNumber?: number) {
    this.stopAgentSimulation(idx);
    let stepIdx = agent.steps.findIndex(s => s.active);
    if (stepIdx === -1) stepIdx = agent.steps.findIndex(s => !s.done);
    if (stepIdx === -1) stepIdx = 0;
    agent.steps.forEach((s, i) => {
      s.active = i === stepIdx;
      s.done = i < stepIdx;
    });
    const agentNum = agentNumber ?? (this.agents.findIndex(a => a === agent) + 1);
    this.agentIntervals[idx] = setInterval(() => {
      if (!agent.active) return;
      let current = agent.steps.findIndex(s => s.active);
      if (current === -1) current = 0;
      if (current > 0) agent.steps[current - 1].done = true;
      agent.steps.forEach((s, i) => s.active = false);
      if (current < agent.steps.length) {
        agent.steps[current].active = true;
        this.logs.unshift(`Agent ${agentNum}: ${agent.steps[current].label} started at ${new Date().toLocaleTimeString()}`);
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
        this.logs.unshift(`Agent ${agentNum}: All steps done at ${new Date().toLocaleTimeString()}`);
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
