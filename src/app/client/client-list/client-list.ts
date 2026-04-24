import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { Client } from '../model/client';
import { ClientService } from '../client.service';
import { ClientEdit } from '../client-edit/client-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './client-list.html',
  styleUrls: ['./client-list.scss']
})
export class ClientList implements OnInit {

  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients()
      .subscribe(clients => this.dataSource.data = clients);
  }

  createClient() {
    const dialogRef = this.dialog.open(ClientEdit, { data: {} });

    dialogRef.afterClosed().subscribe(() => this.loadClients());
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEdit, {
      data: { client }
    });

    dialogRef.afterClosed().subscribe(() => this.loadClients());
  }

  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar cliente',
        description: 'Si borra el cliente se perderán sus datos.<br>¿Desea eliminar el cliente?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(client.id)
          .subscribe(() => this.loadClients());
      }
    });
  }
}
