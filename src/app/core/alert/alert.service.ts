import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) { }

  private openSnackBar(message: string, panelClass: string[], config?: MatSnackBarConfig): void {
    const snackBarConfig: MatSnackBarConfig = {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: panelClass,
      ...config 
    };

    this.snackBar.open(message, undefined, snackBarConfig);
  }

  public showSuccess(message: string, config?: MatSnackBarConfig): void {
    this.openSnackBar(message, ['snackbar-success'], config);
  }

  public showWarning(message: string, config?: MatSnackBarConfig): void {
    this.openSnackBar(message, ['snackbar-warning'], config);
  }

  public showError(message: string, config?: MatSnackBarConfig): void {
    this.openSnackBar(message, ['snackbar-danger'], config);
  }
}
