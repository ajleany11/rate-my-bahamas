from django.conf import settings
from django.http import HttpResponse


def serve_frontend(request, *args, **kwargs):
    """Serves the built React app's index.html for any non-API/non-admin path.

    Reads the raw file rather than using Django's template engine, since
    index.html isn't a Django template and shouldn't be parsed as one.
    """
    index_path = settings.FRONTEND_DIST_DIR / 'index.html'
    if not index_path.exists():
        return HttpResponse(
            'Frontend build not found. Run `cd frontend && npm run build` first.',
            status=501,
        )
    return HttpResponse(index_path.read_text(encoding='utf-8'))
