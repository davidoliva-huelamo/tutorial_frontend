import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { LoanService } from '../loan.service';
import { Loan } from '../model/loan';

import { ClientService } from '../../client/client.service';
import { GameService } from '../../game/game.service';
import { Client } from '../../client/model/client';
import { Game } from '../../game/model/Game';

@Component({
    standalone: true,
    selector: 'app-loan-edit',
    imports: [
      CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatSelectModule
    ],
    templateUrl: './loan-edit.html',
    styleUrls: ['./loan-edit.scss']
})

export class LoanEdit implements OnInit {
  loan: Loan = {
    clientId: null as any,
    gameId: null as any,
    startDate: '',
    endDate: ''
  };

  clients: Client[] = [];
  games: Game[] = [];

  constructor(
    private loanService: LoanService,
    private clientService: ClientService,
    private gameService: GameService,
    private dialogRef: MatDialogRef<LoanEdit>
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(c => {
      this.clients = c;
    });
    this.gameService.getGames().subscribe(g => {
      this.games = g;
    });
  }

  onSave(): void {

    const payload = {
      id: this.loan.id ?? null,
      clientId: this.loan.clientId,
      gameId: this.loan.gameId,
      startDate: this.loan.startDate,
      endDate: this.loan.endDate
    };

    this.loanService.saveLoan(payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: err => {
        alert(err?.error?.message || 'Error al guardar el préstamo');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}