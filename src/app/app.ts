import { Component } from '@angular/core';
import { AgentDashboardComponent } from './agent-dashboard.component';
// import { RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AgentDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'multi-agent-dashboard';
}

