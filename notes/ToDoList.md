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
• Lógica para modificar el contador de episodios cuando un anime está en emisión.
• Notificaciones de episodios nuevos.

# 🐞 Errores encontrados:

• Si se retrocede a la página anterior mediante el menú de navegación o botones del mouse, el término de búsqueda no se limpia del buscador.
   Posible solución: Implementar cualquier lógica para detectar si se cambia de página para limpiar término de búsqueda.

• Si se está en la página de resultados y se realiza una búsqueda, los resultados deberían limpiarse para que el gif de carga se vea bien.  

    Comando para ejecutar: ng serve --o