def absolute_media_url(request, file_field):
    """Build a browser-ready URL for an uploaded file."""
    if not file_field:
        return None
    url = file_field.url
    if url.startswith(('http://', 'https://')):
        return url
    if request:
        return request.build_absolute_uri(url)
    return url
