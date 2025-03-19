import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalyzerService } from './analyzer.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'Proyecto1';
  entrada: string = '';
  salida: string = '';

  constructor(private analyzerService: AnalyzerService) {}

  @ViewChild('fileInput') fileInput!: ElementRef;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = reader.result as string;
        this.entrada = text;
      };
      this.entrada = '';
      reader.readAsText(file);
    }
  }

  limpiar(): void {
    this.entrada = '';
    this.salida = '';
  }

  ejecutar(): void {
    this.analyzerService.analyze(this.entrada).subscribe({
      next: (response) => {
        this.salida = JSON.stringify(response.command, null, 2);
      },
      error: (error) => {
        // Manejo mejorado del error
        if (error.error && error.error.error) {
          this.salida = `Error: ${error.error.error}`;
        } else if (error.message) {
          this.salida = `Error: ${error.message}`;
        } else {
          this.salida = 'Error desconocido';
        }
      }
    });
  }
}
