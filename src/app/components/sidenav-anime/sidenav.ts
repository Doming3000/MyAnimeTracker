import { Component} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css']
})

export class SideNav {  
  // Abrir el menú desplegable
  isOpen: boolean = false;

  openNav() {
    this.isOpen = true;
  }

  closeNav() {
    this.isOpen = false;
  }

  // Método para exportar archivo csv con el almacenamiento local
  exportData() {
    // Obtener el contenido actual del almacenamiento local
    const storedData = localStorage.getItem("my_anime");
    
    if (storedData !== null && storedData !== "[]") {
      // Crear un blob con el contenido JSON
      const blob = new Blob([storedData], { type: "application/json" });
      
      // Crear una URL para el blob
      const url = URL.createObjectURL(blob);
      
      // Crear un enlace <a> para descargar el archivo
      const a = document.createElement("a");
      a.href = url;
      a.download = "Data.csv";
      
      // Agregar el enlace al documento y simular un clic para iniciar la descarga
      document.body.appendChild(a);
      a.click();
      
      // Eliminar el enlace del documento
      document.body.removeChild(a);
    } else {
      alert("No hay nada que descargar");
    }
  }
}