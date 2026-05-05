import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { LoanEdit } from '../loan-edit/loan-edit';
import { LoanService } from '../loan.service';
import { Loan } from '../model/loan';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/client';
import { GameService } from '../../game/game.service';
import { Game } from '../../game/model/Game';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './loan-list.html',
  styleUrls: ['./loan-list.scss']
})

export class LoanList implements OnInit {

  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;

  clients: Client[] = [];
  games: Game[] = [];

  filters = {
    gameId: null as number | null,
    clientId: null as number | null,
    date: null as Date | null
  };

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = [
    'id',
    'game',
    'client',
    'startDate',
    'endDate',
    'action'
  ];

  constructor(
    private loanService: LoanService,
    private dialog: MatDialog,
    private clientsService: ClientService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.loadPage();

    this.clientsService.getClients().subscribe(data => {
      this.clients = data;
    });

    this.gameService.getGames().subscribe(data => {
      this.games = data;
    });
  }
  
  private formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadPage(event?: PageEvent): void {
    if (event) {
      this.pageNumber = event.pageIndex;
      this.pageSize = event.pageSize;
    }

  const formattedDate = this.filters.date
    ? this.formatDateLocal(this.filters.date)
    : null;

    this.loanService.getLoans(
      this.pageNumber,
      this.pageSize,
      this.filters.clientId ?? undefined,
      this.filters.gameId ?? undefined,
      formattedDate ?? undefined
    ).subscribe(page => {
      this.dataSource.data = page.content;
      this.totalElements = page.totalElements;
    });
  }

  onFilter(): void {
    this.pageNumber = 0;
    this.loadPage();
  }

  clearFilters(): void {
    this.filters = { gameId: null, clientId: null, date: null };
    this.pageNumber = 0;
    this.loadPage();
  }

  createLoan(): void {
    this.dialog.open(LoanEdit).afterClosed().subscribe(() => this.loadPage());
  }

  editLoan(loan: Loan): void {
    this.dialog.open(LoanEdit, { data: { loan } })
      .afterClosed()
      .subscribe(() => this.loadPage());
  }

  deleteLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar préstamo',
        description: '¿Desea eliminar el préstamo seleccionado?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loanService.deleteLoan(loan.id!).subscribe(() => {
          this.loadPage();
        });
      }
    });
  }
}
