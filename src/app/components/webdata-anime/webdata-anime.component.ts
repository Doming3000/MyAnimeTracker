import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webdata-anime',
  templateUrl: './webdata-anime.component.html',
  styleUrls: ['./webdata-anime.component.css']
})

export class WebDataAnimeComponent {  
  
  exportData() {
    // Obtener el contenido actual del almacenamiento local
    const storedData = localStorage.getItem("my_anime");
    
    if (storedData !== null) {
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