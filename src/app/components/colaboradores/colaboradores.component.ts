import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from '../../services/colaborador.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent implements OnInit {

  colaboradores: any[] = [];
  colaboradorForm: FormGroup;
  modoEdicion = false;
  idColaboradorAEditar: number | null = null;

  constructor(
    private colaboradorService: ColaboradorService,
    private fb: FormBuilder
  ) {
    this.colaboradorForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      empresa: ['', Validators.required],
      area: ['', Validators.required],
      departamento: ['', Validators.required],
      puesto: ['', Validators.required],
      fecha_de_alta: ['', Validators.required],
      estatus: [true, Validators.required],
      fotografia: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerColaboradores();
    this.suscribirASockets();
  }

  obtenerColaboradores(): void {
    this.colaboradorService.getColaboradores().subscribe({
      next: (data) => {
        this.colaboradores = data;
      },
      error: (error) => {
        console.error('Error al obtener los colaboradores:', error);
      }
    });
  }

  suscribirASockets(): void {
    // Suscribirse al evento de creación
    this.colaboradorService.onColaboradorCreado().subscribe((colaborador: any) => {
      this.colaboradores.push(colaborador);
    });

    // Suscribirse al evento de actualización
    this.colaboradorService.onColaboradorActualizado().subscribe((colaboradorActualizado: any) => {
      const index = this.colaboradores.findIndex(c => c.id === colaboradorActualizado.id);
      if (index !== -1) {
        this.colaboradores[index] = colaboradorActualizado;
      }
    });

    // Suscribirse al evento de eliminación
    this.colaboradorService.onColaboradorEliminado().subscribe((data: any) => {
      this.colaboradores = this.colaboradores.filter(c => c.id !== data.id);
    });
  }

  onSubmit(): void {
    const formData = new FormData();
    Object.keys(this.colaboradorForm.controls).forEach(key => {
      const control = this.colaboradorForm.get(key);
      // Si el valor es null, envía una cadena vacía
      if (control) {
        formData.append(key, control.value !== null && control.value !== undefined ? control.value : '');
      }
    });

    // Debug: imprime el contenido de FormData (type cast para evitar error TS)
    for (const pair of (formData as any).entries()) {
      console.log(pair[0]+ ':', pair[1]);
    }

    if (this.modoEdicion) {
      // Lógica para actualizar
      this.colaboradorService.actualizarColaborador(this.idColaboradorAEditar!, formData).subscribe(() => {
        this.obtenerColaboradores();
        this.resetearFormulario();
        Swal.fire('¡Actualizado!', 'Colaborador actualizado correctamente.', 'success');
      });
    } else {
      // Lógica para crear
      this.colaboradorService.crearColaborador(formData).subscribe(() => {
        this.obtenerColaboradores();
        this.resetearFormulario();
        Swal.fire('¡Creado!', 'Colaborador creado correctamente.', 'success');
      });
    }
  }

  eliminarColaborador(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.colaboradorService.eliminarColaborador(id).subscribe(() => {
          this.obtenerColaboradores();
          Swal.fire('¡Eliminado!', 'Colaborador eliminado correctamente.', 'success');
        });
      }
    });
  }

  editarColaborador(colaborador: any): void {
    this.modoEdicion = true;
    this.idColaboradorAEditar = colaborador.id;
    this.colaboradorForm.patchValue(colaborador);
    const fotografiaControl = this.colaboradorForm.get('fotografia');
    if (fotografiaControl) {
      fotografiaControl.setValue(null);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fotografiaControl = this.colaboradorForm.get('fotografia');
      if (fotografiaControl) {
        fotografiaControl.setValue(file);
      }
    }
  }

  resetearFormulario(): void {
    this.colaboradorForm.reset({ estatus: true });
    this.modoEdicion = false;
    this.idColaboradorAEditar = null;
  }
}
