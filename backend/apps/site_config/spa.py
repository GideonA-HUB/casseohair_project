"""Serve the React SPA shell, with Open Graph meta injected for product URLs.

WhatsApp / Facebook / Telegram crawlers do not run JavaScript, so client-side
Helmet tags never appear in the HTML they fetch. Injecting og:* tags here makes
shared product links show title, description, and image previews.
"""

from __future__ import annotations

import html
import re

from django.conf import settings
from django.template.response import TemplateResponse
from django.views import View

from apps.core.media import absolute_media_url

PRODUCT_PATH_RE = re.compile(r'^/product/([^/]+)/?$')


def _absolute_url(request, path: str) -> str:
    if path.startswith(('http://', 'https://')):
        return path
    if not path.startswith('/'):
        path = f'/{path}'
    if request:
        return request.build_absolute_uri(path)
    base = (settings.FRONTEND_URL or settings.SITE_URL or '').rstrip('/')
    return f'{base}{path}'


def _truncate(text: str, max_len: int = 200) -> str:
    text = (text or '').strip()
    if len(text) <= max_len:
        return text
    return text[: max_len - 1].rsplit(' ', 1)[0] + '…'


def build_product_og_tags(request, slug: str) -> str:
    from apps.products.models import Product

    try:
        product = (
            Product.objects.filter(
                slug=slug,
                is_active=True,
                is_archived=False,
            )
            .prefetch_related('images')
            .first()
        )
    except Exception:
        return ''

    if not product:
        return ''

    title = product.meta_title or product.name
    full_title = f'{title} | CasseoHair'
    description = _truncate(
        product.meta_description
        or product.short_description
        or product.description
        or 'Premium luxury wigs and hair from CasseoHair.',
    )
    page_url = _absolute_url(request, f'/product/{product.slug}')

    image = None
    primary = product.primary_image
    if primary and primary.image:
        image = absolute_media_url(request, primary.image)
    if image and not image.startswith(('http://', 'https://')):
        image = _absolute_url(request, image)
    if not image:
        image = _absolute_url(request, '/static/frontend/logo.png')

    esc = html.escape

    tags = [
        f'<title>{esc(full_title)}</title>',
        f'<meta name="description" content="{esc(description)}" />',
        f'<link rel="canonical" href="{esc(page_url)}" />',
        f'<meta property="og:title" content="{esc(full_title)}" />',
        f'<meta property="og:description" content="{esc(description)}" />',
        f'<meta property="og:type" content="product" />',
        f'<meta property="og:url" content="{esc(page_url)}" />',
        f'<meta property="og:image" content="{esc(image)}" />',
        f'<meta property="og:image:alt" content="{esc(product.name)}" />',
        '<meta property="og:site_name" content="CasseoHair" />',
        '<meta name="twitter:card" content="summary_large_image" />',
        f'<meta name="twitter:title" content="{esc(full_title)}" />',
        f'<meta name="twitter:description" content="{esc(description)}" />',
        f'<meta name="twitter:image" content="{esc(image)}" />',
    ]
    return '\n    '.join(tags) + '\n    '


class SpaIndexView(View):
    """Serve index.html for all SPA routes; inject product OG meta when applicable."""

    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        response = TemplateResponse(request, self.template_name, {})
        response.render()

        match = PRODUCT_PATH_RE.match(request.path)
        if not match:
            return response

        og_block = build_product_og_tags(request, match.group(1))
        if not og_block:
            return response

        content = response.content.decode('utf-8')

        # Prefer replacing the default title so crawlers see the product name
        content = re.sub(
            r'<title>[^<]*</title>',
            '',
            content,
            count=1,
            flags=re.IGNORECASE,
        )
        if '</head>' in content.lower():
            # Case-preserving replace of closing head tag
            idx = content.lower().rfind('</head>')
            content = content[:idx] + og_block + content[idx:]
        else:
            content = og_block + content

        response.content = content.encode('utf-8')
        return response
