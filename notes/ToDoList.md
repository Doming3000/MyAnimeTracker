# 💀 Pendiente a realizar:
• Agilizar la forma para organizar los elementos de la lista en tiempo real
• Aplicar reglas media en imágenes y buscador.
• Encontrar diseños definitivos (dejar de usar escalas de grises).
• Encontrar mejor diseño para el contador de episodios, los botones no deben moverse ni tampoco ocupar demasiado espacio.
• Lógica para modificar el contador de episodios cuando un anime está en emisión o no tiene episodios definidos.
• Mejorar las animaciones de las alertas tipo Toast al aparecer y desaparecer.
• Mejorar los diseños de alertas en general (Modal y Toast).
• Ponerle un nombre a la aplicación.

# 🧠 Ideas:
• Incluir selección de Mangas.
• Botones en header para reordenar la lista al gusto del usuario (a-z, z-a, visto - no visto, no visto - visto, etc), requiere crear variables para
  recordar los ajustes, además de modificar la lógica para organizar la lista al cargar la página.
• Notificaciones de episodios nuevos (no se como mierda hacer esto).
• Encontrar la forma de redirigir a algún lado al hacer click en un elemento de la lista (imágen).
  - Dar la opción al usuario de agregar manualmente su propio enlace a cada elemento.
  - No dar la opción y redirigir siempre a MAL.

# 🐞 Errores encontrados:
• Al importar datos, la página debería actualizar el almacenamiento local sin necesidad de recargar la página, del mismo modo o similar a como se hace al
  agregar un elemento a mi lista.
• El contador de episodios necesita estilos que se adapten al espacio y que a su vez, no se estire dependiendo de la cantidad de episodios que tiene un
  anime.
• Si se está en la página de resultados y se realiza una búsqueda, los resultados deberían limpiarse u ocultarse para que el gif de carga se vea bien.
• Si se retrocede a la página anterior mediante el menú de navegación o botones del mouse, el término de búsqueda no se limpia del buscador.