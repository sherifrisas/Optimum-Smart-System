# Code Citations

## License: MIT
https://github.com/kalaspuffar/fastapi-example/tree/132f2d217e7f4c8976768c4680ed092600d4baff/sql_app/main.py

```
.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app
```


## License: unknown
https://github.com/pucrs-poli/constr-sw-2022-1-g2/tree/9cf3e541b655424d5130697257b461a604055686/P2/main.py

```
,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("
```

