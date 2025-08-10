import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from '../../services/colaborador.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  onSubmit(): void {
    const formData = new FormData();
    Object.keys(this.colaboradorForm.controls).forEach(key => {
      const control = this.colaboradorForm.get(key);
      if (control) {
        formData.append(key, control.value);
      }
    });

    if (this.modoEdicion) {
      // Lógica para actualizar
      this.colaboradorService.actualizarColaborador(this.idColaboradorAEditar!, formData).subscribe(() => {
        this.obtenerColaboradores();
        this.resetearFormulario();
        alert('Colaborador actualizado correctamente.');
      });
    } else {
      // Lógica para crear
      this.colaboradorService.crearColaborador(formData).subscribe(() => {
        this.obtenerColaboradores();
        this.resetearFormulario();
        alert('Colaborador creado correctamente.');
      });
    }
  }

  eliminarColaborador(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este colaborador?')) {
      this.colaboradorService.eliminarColaborador(id).subscribe(() => {
        this.obtenerColaboradores();
        alert('Colaborador eliminado correctamente.');
      });
    }
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