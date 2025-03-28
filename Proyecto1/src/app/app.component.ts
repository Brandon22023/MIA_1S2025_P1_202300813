import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalyzerService } from './analyzer.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'Proyecto1';
  entrada: string = '';
  salida: string = '';
  mensaje: string = ''; // esto sera para mostrar el exito de lo metico

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
    this.mensaje = ''; // Limpiar el mensaje
  }

  ejecutar(): void {
    this.analyzerService.analyze(this.entrada).subscribe({
      next: (response) => {
        // Imprime la respuesta en la consola
        console.log('Respuesta del servidor:', response);
        // Asegúrate de que la respuesta tenga la estructura esperada
        if (response && response.output) {
          this.salida = response.output;
          console.log('Salida procesada:', this.salida);

          // Verificar si el comando es mkdisk
          if (this.entrada.trim().toLowerCase().startsWith('mkdisk')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de MKDISK logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();
          
          } else if (this.entrada.trim().toLowerCase().startsWith('rmdisk')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de RMDISK logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();

          }else if (this.entrada.trim().toLowerCase().startsWith('fdisk')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de FDISK logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();

          }else if (this.entrada.trim().toLowerCase().startsWith('mount')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de MOUNT logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();

          }else if (this.entrada.trim().toLowerCase().startsWith('mkfs')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de MKFS logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();

          }else if (this.entrada.trim().toLowerCase().startsWith('rep')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de REP logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();

          }else if (this.entrada.trim().toLowerCase().startsWith('mkdir')) {
            // Establecer el mensaje
            this.mensaje = 'Comando de MKDIR logrado con éxito';
            // Mostrar el modal de éxito
            this.showModal();

          }
          else {
            this.mensaje = ''; // Limpiar el mensaje si no es mkdisk
          }

        } else {
          this.salida = 'Respuesta inesperada del servidor';

          this.mensaje = ''; // Limpiar el mensaje en caso de error
        }
      },
      error: (error) => {

        // Manejo mejorado del error
        console.error('Error del servidor:', error);
        // Manejo mejorado del error
        if (error.error && error.error.error) {
          this.salida = `Error: ${error.error.error}`;
          this.mensaje = this.salida;
          this.showModal();
        } else if (error.message) {
          this.salida = `Error: ${error.message}`;
          this.mensaje = this.salida;
          this.showModal();
        } else {
          this.salida = 'Error desconocido';
          this.mensaje = this.salida;
          this.showModal();
        }
        // Mostrar el mensaje de error en el modal solo si coincide con las frases específicas
        if (this.salida.startsWith('Error: el archivo no existe') || this.salida.startsWith('Error: error al eliminar el archivo') || this.salida.startsWith('Archivo eliminado con éxito')) {
          this.mensaje = this.salida;
          this.showModal();
        }
        
      }
    });
  }

  showModal(): void {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal(): void {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

}
