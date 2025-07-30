import { Component } from '@angular/core';
import { AgentDashboardComponent } from './agent-dashboard.component';
// import { RouterOutlet } from '@angular/router';

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
