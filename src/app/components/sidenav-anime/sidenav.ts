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
    const storedData = localStorage.getItem("my_anime");
    
    if (storedData === null || storedData === "[]") {
      alert("No hay nada que descargar");
      return;
    }
    
    else {
      // Crear un blob con el contenido JSON
      const blob = new Blob([storedData], { type: "application/json" });
      
      // Crear una URL para el blob
      const url = URL.createObjectURL(blob);
      
      // Crear un enlace <a> para descargar el archivo
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      
      // Agregar el enlace al documento y simular un clic para iniciar la descarga
      document.body.appendChild(a);
      a.click();
      
      // Eliminar el enlace del documento
      document.body.removeChild(a);
    }
  }
  
  // Método para importar datos desde un archivo CSV al almacenamiento local
  importData(event: any) {
    const file = event.target.files[0];
    
    // Verificar si se seleccionó un archivo
    if (!file) {
      alert("No se seleccionó ningún archivo");
      return;
    }
    
    else if (file.name !== "data.csv") {
      alert("Este no parece ser el archivo correcto");
      return;
    }
    
    const reader = new FileReader();
    
    // Leer el contenido del archivo
    reader.onload = (e: any) => {
      const content = e.target.result;
      try {
        // Intentar parsear el contenido como JSON
        const data = JSON.parse(content);
        
        // Verificar que el contenido sea un array (ajustar según tu estructura esperada)
        if (!Array.isArray(data)) {
          throw new Error("El contenido no tiene el formato correcto");
        }
        
        // Almacenar los datos en el almacenamiento local
        localStorage.setItem("my_anime", JSON.stringify(data));
        
        // Mostrar un mensaje de éxito
        alert("Datos importados con éxito");
        
        // Recargar la ventana
        window.location.reload();
      } catch (error) {
        // Mostrar un mensaje de error en caso de problemas con el parseo
        alert("El archivo parece estar dañado y no es posible importarlo");
        console.error(error);
      }
    };
    
    // Leer el archivo como texto
    reader.readAsText(file);
  }
}