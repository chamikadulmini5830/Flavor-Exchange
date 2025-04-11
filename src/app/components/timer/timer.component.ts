import { Component, Input, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-timer',
  template: `
    <div class="timer-container">
      <div class="timer-display">
        <span class="time">{{minutes}}:{{seconds < 10 ? '0' : ''}}{{seconds}}</span>
      </div>
      <div class="timer-controls">
        <button mat-mini-fab color="primary" (click)="startTimer()" *ngIf="!isRunning">
          <mat-icon>play_arrow</mat-icon>
        </button>
        <button mat-mini-fab color="warn" (click)="pauseTimer()" *ngIf="isRunning">
          <mat-icon>pause</mat-icon>
        </button>
        <button mat-mini-fab (click)="resetTimer()">
          <mat-icon>restart_alt</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .timer-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .timer-display {
      font-size: 2rem;
      font-weight: bold;
      font-family: monospace;
      color: #333;
    }

    .timer-controls {
      display: flex;
      gap: 1rem;
    }

    .time {
      background: #f5f5f5;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      min-width: 100px;
      display: inline-block;
      text-align: center;
    }
  `]
})
export class TimerComponent implements OnDestroy {
  @Input() set cookingTime(value: number) {
    this.totalSeconds = value * 60; // Convert minutes to seconds
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  private totalSeconds: number = 0;
  private remainingSeconds: number = 0;
  private timerId: any = null;
  
  minutes: number = 0;
  seconds: number = 0;
  isRunning: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  startTimer() {
    if (!this.isRunning && this.remainingSeconds > 0) {
      this.isRunning = true;
      this.timerId = setInterval(() => {
        this.remainingSeconds--;
        this.updateDisplay();
        
        if (this.remainingSeconds <= 0) {
          this.pauseTimer();
          this.snackBar.open('Timer finished! Your food is ready! 🍳', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      }, 1000);
    }
  }

  pauseTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.isRunning = false;
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  private updateDisplay() {
    this.minutes = Math.floor(this.remainingSeconds / 60);
    this.seconds = this.remainingSeconds % 60;
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
} 