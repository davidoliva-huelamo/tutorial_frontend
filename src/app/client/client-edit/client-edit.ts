import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Client } from '../model/client';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './client-edit.html',
  styleUrls: ['./client-edit.scss']
})
export class ClientEdit implements OnInit {

  client: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientEdit>,
    @Inject(MAT_DIALOG_DATA) public data: { client: Client },
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.client = this.data.client
      ? { ...this.data.client }
      : { id: null, name: '' };
  }

  onSave() {
    this.clientService.saveClient(this.client)
      .subscribe(() => this.dialogRef.close());
  }

  onClose() {
    this.dialogRef.close();
  }
}
