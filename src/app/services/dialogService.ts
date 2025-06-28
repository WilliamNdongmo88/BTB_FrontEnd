import { ComponentRef, EnvironmentInjector, inject, Injectable, ViewContainerRef } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ConfirmationDialogComponent } from "../dialog/dialogComponent/confirmation-dialog.component";



@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogHost: ViewContainerRef | null = null;
  private currentDialogRef: ComponentRef<any> | null = null;
  private readonly environmentInjector = inject(EnvironmentInjector); // Pour Angular 14+

  setDialogHost(vcr: ViewContainerRef): void {
    this.dialogHost = vcr;
  }

  /**
   * Ouvre un dialogue de confirmation et retourne un Observable pour le résultat.
   * @param title Titre de la boîte de dialogue.
   * @param message Message de la boîte de dialogue.
   * @param confirmButtonText Texte du bouton de confirmation.
   * @param cancelButtonText Texte du bouton d'annulation.
   * @returns Observable qui émet `true` pour confirmer, `false` pour annuler.
   */
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

    // Supprimer l'ancien dialogue s'il existe
    this.closeDialog();

    // Créer le composant de dialogue dynamiquement
    this.currentDialogRef = this.dialogHost.createComponent(ConfirmationDialogComponent, {
      environmentInjector: this.environmentInjector // Nécessaire pour les composants standalone
    });

    const dialogComponent = this.currentDialogRef.instance;

    // Passer les inputs au composant de dialogue
    dialogComponent.title = title;
    dialogComponent.message = message;
    dialogComponent.confirmButtonText = confirmButtonText;
    dialogComponent.cancelButtonText = cancelButtonText;

    const resultSubject = new Subject<boolean>();

    // S'abonner à l'événement 'confirmed' du composant de dialogue
    dialogComponent.confirmed.subscribe((result: boolean) => {
      resultSubject.next(result); // Émettre le résultat
      this.closeDialog();       // Fermer le dialogue après la réponse
      resultSubject.complete(); // Compléter l'Observable
    });

    return resultSubject.asObservable();
  }

  /**
   * Ferme le dialogue actuellement ouvert.
   */
  closeDialog(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.destroy();
      this.currentDialogRef = null;
    }
  }
}