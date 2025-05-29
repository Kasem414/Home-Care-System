from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagePagination(PageNumberPagination):
    page_size_query_param = 'limit'  # use ?limit=...
    page_query_param = 'page'        # use ?page=...
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'total': self.page.paginator.count,
                'page': self.page.number,
                'limit': self.get_page_size(self.request),
            },
            'data': data
        })