from django.core.cache import caches


class CachedGamesFilterBackend:
    __redis_cache = caches["default"]

    @classmethod
    def by_field(cls, key_regex, field_name, field_value):
        cached_games = cls.__redis_cache.get_many(
            cls.__redis_cache.keys(key_regex)
        )

        filtered_games = []
        for game in cached_games.values():
            if getattr(game, field_name) == field_value:
                filtered_games.append(game)

        return filtered_games
