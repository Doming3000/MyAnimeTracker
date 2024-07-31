# 💀 Pendiente a realizar:

• Aplicar reglas media en imágenes y buscador.
• Cambiar icono del botón "Añadir una URL".
• Encontrar diseños definitivos (dejar de usar escalas de grises).
• Encontrar la forma de redirigir a algún lado al hacer click en un elemento de la lista.
• Mejorar el css del contador de episodios, debe adaptarse a la cantidad de episodios para un tamaño más congruente.
• Mejorar las animaciones de las alertas tipo Toast al aparecer y desaparecer.
• Mejorar los diseños de alertas en general (Modal y Toast).
• Ponerle un nombre a la aplicación.

# 🧠 Ideas:

• Incluir selección de Mangas.
• Logica para modificar el contador de episodios cuando un anime está en emisión.
• Notificaciones de episodios nuevos.

# 🐞 Errores encontrados:

• No se muestran alertas de ningún tipo en la ruta de los resultados de búsqueda.
   Posible solución: Requiere mejorar la logica de visibilidad de componentes para arreglar.
   # Causa del error encontrada: Las alertas se llaman desde el componente MyList, por lo que no aparecen en el componente de resultados.

• Si se retrocede a la pagina anterior mediante el menú de navegación o botones del mouse, el término de búsqueda no se limpia del buscador.
   Posible solución: Implementar cualquier logíca para detectar si se cambia de página para limpiar término de búsqueda.

    Comando para ejecutar: ng serve --o