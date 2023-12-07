from django.contrib import admin
from django.urls import path, include, re_path
# from django.views.generic import ServeReactView
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/', include('classifier.urls')),
    path('auth/', include('users.urls')),
    # re_path(r"^.*",ServeReactView.as_view(),name="serve_web_client_view")
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)