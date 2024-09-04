from datetime import datetime, timedelta
from django.contrib import admin, messages
from django.utils.translation import ngettext
from .models import UserReport


class CreationPeriodListFilter(admin.SimpleListFilter):
    title = "Creation period"
    parameter_name = "created"

    def lookups(self, request, model_admin):
        return [
            ("today", "Today"),
            ("yesterday", "Yesterday"),
            ("last_week", "Last week")
        ]
    
    def queryset(self, request, queryset):
        datetime_now = datetime.now()
        timedelta_day = timedelta(days=1)
        timedelta_week = timedelta(weeks=1)

        def _day_start(datetime):
            return datetime.replace(hour=0, minute=0, second=0)
        def _day_end(datetime):
            return datetime.replace(hour=23, minute=59, second=59)

        if self.value() == "today":
            return queryset.filter(
                created__range=(
                    _day_start(datetime_now),
                    _day_end(datetime_now)
                )
            )
        if self.value() == "yesterday":
            return queryset.filter(
                created__range=(
                    _day_start(datetime_now - timedelta_day),
                    _day_end(datetime_now - timedelta_day)
                )
            )
        if self.value() == "last_week":
            return queryset.filter(
                created__range=(
                    _day_start(datetime_now - timedelta_week),
                    _day_end(datetime_now)
                )
            )


@admin.register(UserReport)
class UserReportAdmin(admin.ModelAdmin):
    list_display = ["report_id", "snippet_text", "is_check", "admin_created", "more"]
    list_display_links = ["more"]
    show_facets = admin.ShowFacets.ALWAYS
    date_hierarchy = "created"
    actions = ["make_checked"]
    list_filter = [
        ("is_check", admin.BooleanFieldListFilter),
        CreationPeriodListFilter
    ]

    @admin.action(description="Mark selected reports as checked")
    def make_checked(self, request, queryset):
        updated = queryset.update(is_check=True)
        self.message_user(
            request,
            ngettext(
                f"{updated} report was successfully marked as checked.",
                f"{updated} reports were successfully marked as checked",
                updated
            ),
            messages.SUCCESS
        )

    @admin.display(description="Report ID")
    def report_id(self, obj):
        return obj.id

    def snippet_text(self, obj):
        return obj.text[:20].strip() + "..."
    
    @admin.display(description="Created")
    def admin_created(self, obj):
        return obj.created.strftime("%d/%m/%Y %H:%M")
    
    @admin.display(description="")
    def more(self, obj):
        return "More..."
