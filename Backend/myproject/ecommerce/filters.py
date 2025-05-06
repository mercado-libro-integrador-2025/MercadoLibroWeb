import django_filters
from .models import Libro

class LibroFilter(django_filters.FilterSet):
    nombre_categoria = django_filters.CharFilter(
        field_name='categoria__nombre_categoria',
        lookup_expr='exact'
    )

    class Meta:
        model = Libro
        fields = {
            'titulo': ['icontains'],
            'precio': ['lte', 'gte'],
            'stock': ['lte', 'gte'],
            'nombre_categoria': ['exact'],
        }
