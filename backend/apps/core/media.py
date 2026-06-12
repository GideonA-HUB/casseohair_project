def absolute_media_url(request, file_field):
    """Build a browser-ready URL for an uploaded file."""
    if not file_field:
        return None
    url = file_field.url
    if url.startswith(('http://', 'https://')):
        return url
    # Remove any leading /media/ to avoid double prefix
    if url.startswith('/media/'):
        url = url[7:]  # Remove '/media/'
    if request:
        return request.build_absolute_uri(f'/media/{url}')
    return f'/media/{url}'
