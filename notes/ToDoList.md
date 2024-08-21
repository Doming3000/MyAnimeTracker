# 💀 Pendiente a realizar:

• Aplicar reglas media en imágenes y buscador.
• Encontrar diseños definitivos (dejar de usar escalas de grises).
• Encontrar la forma de redirigir a algún lado al hacer click en un elemento de la lista (imágen).
• Mejorar las animaciones de las alertas tipo Toast al aparecer y desaparecer.
• Mejorar los diseños de alertas en general (Modal y Toast).
• Ponerle un nombre a la aplicación.

# 🧠 Ideas:

• Incluir selección de Mangas.
• Lógica para modificar el contador de episodios cuando un anime está en emisión.
• Botones en header para reordenar la lista al gusto del usuario (a-z, z-a, visto - no visto, no visto - visto, etc), requiere crear variables para
  recordar los ajustes, además de modificar la lógica para organizar la lista al cargar la página.
• Notificaciones de episodios nuevos (no se como mierda hacer esto).

# 🐞 Errores encontrados:

• Si se retrocede a la página anterior mediante el menú de navegación o botones del mouse, el término de búsqueda no se limpia del buscador.
  Posible solución: Implementar cualquier lógica para detectar si se cambia de página para limpiar término de búsqueda.
• Al importar datos, la página debería actualizar el almacenamiento local sin necesidad de recargar la página, del mismo modo o similar a como se hace al
  agregar un elemento a mi lista.
• Si se está en la página de resultados y se realiza una búsqueda, los resultados deberían limpiarse para que el gif de carga se vea bien.
• Footer mal posicionado si no hay elementos en la lista.
• Sospecha: Llamadas duplicadas a Fontawesome al cargar la aplicación.