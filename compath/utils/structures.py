class AttrDict(dict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for key, val in self.items():
            if isinstance(val, dict):
                self[key] = AttrDict(val)

    def __getattr__(self, name):
        try:
            return self[name]
        except KeyError as e:
            raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'") from e

    def __setattr__(self, name, value):
        self[name] = value


class FrozenAttrDict:
    def __init__(self, mapping):
        object.__setattr__(self, '_data', {})
        for key, value in mapping.items():
            if isinstance(value, dict):
                value = FrozenAttrDict(value)
            object.__getattribute__(self, '_data')[key] = value

    def __getattr__(self, name):
        try:
            return self._data[name]
        except KeyError as e:
            raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'") from e

    def __getitem__(self, key):
        return self._data[key]

    def __iter__(self):
        return iter(self._data)

    def __len__(self):
        return len(self._data)

    def __contains__(self, key):
        return key in self._data

    def __repr__(self):
        return f'{self.__class__.__name__}({self._data})'

    def __setitem__(self, key, value):
        raise TypeError(f'{self.__class__.__name__} is immutable')

    def __setattr__(self, name, value):
        raise TypeError(f'{self.__class__.__name__} is immutable')

    def get(self, key, default=None):
        return self._data.get(key, default)

    def keys(self):
        return self._data.keys()

    def values(self):
        return self._data.values()

    def items(self):
        return self._data.items()
