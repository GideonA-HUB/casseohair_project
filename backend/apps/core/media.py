def absolute_media_url(request, file_field):
    """Build a browser-ready URL for an uploaded file."""
    if not file_field:
        return None

    url = file_field.url

    # Cloudinary and other CDNs return full URLs — use as-is.
    if url.startswith(('http://', 'https://')):
        return url

    # Normalize path (Cloudinary + MEDIA_URL can produce /media/media/...).
    if not url.startswith('/'):
        url = f'/{url}'
    while '/media/media/' in url:
        url = url.replace('/media/media/', '/media/')

    if request:
        return request.build_absolute_uri(url)
    return url
