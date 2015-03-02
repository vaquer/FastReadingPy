from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'FastReading.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^/?$', 'FastReading.views.home.home', {}, 'home_view'),
    url(r'^testeando/?$', 'FastReading.views.home.test', {}, 'test'),
)
