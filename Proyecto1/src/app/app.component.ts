import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Proyecto1';
  entrada: string = '';
  salida: string = '';


     // Referencia al elemento de entrada de archivo
  @ViewChild('fileInput') fileInput!: ElementRef;
  // Método que se llama cuando se selecciona un archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      // Evento que se llama cuando se ha leído el archivo
      reader.onload = (e) => {
        const text = reader.result as string;
        this.entrada = text; // Asigna el contenido del archivo a la variable 'entrada'
      };
      this.entrada = '';
      reader.readAsText(file); // Lee el archivo como texto
    }
  }
  // Método para limpiar las variables 'entrada' y 'salida'
  limpiar(): void {
    this.entrada = '';
    this.salida = '';
  }
}
