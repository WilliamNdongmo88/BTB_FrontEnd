import { ComponentRef, EnvironmentInjector, inject, Injectable, ViewContainerRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConfirmationDialogComponent } from "../dialog/dialogComponent/confirmation-dialog.component";



@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogHost: ViewContainerRef | null = null;
  private currentDialogRef: ComponentRef<any> | null = null;
  private readonly environmentInjector = inject(EnvironmentInjector); 

  setDialogHost(vcr: ViewContainerRef): void {
    this.dialogHost = vcr;
  }

  openConfirmationDialog(
    title: string,
    message: string,
    confirmButtonText: string = 'Confirm',
    cancelButtonText: string = 'Cancel'
  ): Observable<boolean> {
    if (!this.dialogHost) {
      console.error('Dialog host is not set. Please set it using setDialogHost().');
      return new Observable(observer => observer.error('Dialog host not set.'));
    }

    this.closeDialog();

    // Création du composant de dialogue dynamiquement
    this.currentDialogRef = this.dialogHost.createComponent(ConfirmationDialogComponent, {
      environmentInjector: this.environmentInjector
    });

    const dialogComponent = this.currentDialogRef.instance;

    dialogComponent.title = title;
    dialogComponent.message = message;
    dialogComponent.confirmButtonText = confirmButtonText;
    dialogComponent.cancelButtonText = cancelButtonText;

    const resultSubject = new Subject<boolean>();

    dialogComponent.confirmed.subscribe((result: boolean) => {
      resultSubject.next(result); 
      this.closeDialog();      
      resultSubject.complete(); 
    });

    return resultSubject.asObservable();
  }

  closeDialog(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.destroy();
      this.currentDialogRef = null;
    }
  }
}