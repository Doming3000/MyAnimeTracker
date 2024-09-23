# 💀 Pendiente a realizar:

• Agilizar la forma para organizar los elementos de la lista en tiempo real
• Aplicar reglas media en imágenes y buscador.
• Encontrar diseños definitivos (dejar de usar escalas de grises).
• Mejorar las animaciones de las alertas tipo Toast al aparecer y desaparecer.
• Mejorar los diseños de alertas en general (Modal y Toast).
• Ponerle un nombre a la aplicación.
• Lógica para modificar el contador de episodios cuando un anime está en emisión o no tiene episodios definidos.

# 🧠 Ideas:

• Incluir selección de Mangas.
• Botones en header para reordenar la lista al gusto del usuario (a-z, z-a, visto - no visto, no visto - visto, etc), requiere crear variables para
  recordar los ajustes, además de modificar la lógica para organizar la lista al cargar la página.
• Notificaciones de episodios nuevos (no se como mierda hacer esto).
• Encontrar la forma de redirigir a algún lado al hacer click en un elemento de la lista (imágen).
  - Dar la opción al usuario de agregar manualmente su propio enlace a cada elemento.
  - No dar la opción y redirigir siempre a MAL.

# 🐞 Errores encontrados:

• Si se retrocede a la página anterior mediante el menú de navegación o botones del mouse, el término de búsqueda no se limpia del buscador.
  Posible solución: Implementar cualquier lógica para detectar si se cambia de página para limpiar término de búsqueda.
• Al importar datos, la página debería actualizar el almacenamiento local sin necesidad de recargar la página, del mismo modo o similar a como se hace al
  agregar un elemento a mi lista.
• Si se está en la página de resultados y se realiza una búsqueda, los resultados deberían limpiarse u ocultarse para que el gif de carga se vea bien.
• El footer está mal posicionado si no hay elementos en la lista.
• Si el anime está en emisión el botón para decrementar episodios se posiciona mal.
• Los elementos con más de mil episodios causan problemas de espacio.