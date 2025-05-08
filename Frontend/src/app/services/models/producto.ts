// Definimos las interfaces para Autor y Categoria anidados
export interface Autor {
    id_autor: number;
    nombre_autor: string;
}

export interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
}

// Definimos la interfaz para Libro, incluyendo las nuevas interfaces anidadas
export interface Libro {
    id_libro: number;
    autor: Autor; // Ahora es un objeto Autor
    pais: string;
    portada: string;
    idioma: string;
    link: string;
    paginas: number;
    titulo: string;
    anio: number;
    ISBN: string;
    categoria: Categoria; // Ahora es un objeto Categoria
    descripcion: string;
    precio: number;
    stock: number;
}
