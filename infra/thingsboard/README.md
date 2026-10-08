# ThingsBoard CE — demostración local

## Compose principal

El punto de entrada es ahora `builder.yml`, perfil `thingsboard`, servicios
`thingsboard-ce` y `thingsboard-postgres`. El entorno existente ya tiene el
volumen inicializado; **no repetir la instalación**. Desde la raíz:

```powershell
docker compose --env-file backend/.env --env-file .env -f builder.yml --profile thingsboard up -d thingsboard-postgres thingsboard-ce
docker compose --env-file backend/.env --env-file .env -f builder.yml --profile thingsboard stop thingsboard-ce thingsboard-postgres
```

Los dos archivos de entorno resuelven las variables que el Compose principal
ya exige, incluso al seleccionar solo ThingsBoard. No arrancar todo el stack
para explorar el demo. En Coolify usar sus variables runtime equivalentes.

Los servicios leen `tmp/thingsboard-demo.env` (ignorado por Git), que contiene
POSTGRES_PASSWORD y SPRING_DATASOURCE_PASSWORD iguales a la contraseña existente.
Puede seleccionarse otro archivo mediante THINGSBOARD_ENV_FILE; si falta,
PostgreSQL no podrá inicializarse. El archivo es opcional al parsear Compose
para que el perfil apagado no impida trabajar con el resto del proyecto.

El volumen externo por defecto es
`comunard-thingsboard-demo_postgres-data`, conservado del demo inicial.
THINGSBOARD_DB_VOLUME permite elegir otro volumen explícito. En una instalación
nueva crear ese volumen antes de inicializar con INSTALL_TB=true (LOAD_DEMO=true
solo para demo). No usar los ejemplos ni credenciales demo en producción.

La base solo pertenece a ThingsBoard: no sustituye MongoDB ni se publica en el
host. No ejecutar ambos Compose a la vez contra este volumen. El Compose
separado de abajo se conserva como opción independiente anterior.

## Compose independiente anterior

Instancia separada de Comunard, AWS y MongoDB. PostgreSQL dedicado en volumen
Docker; consola solo en `http://localhost:18080`. No se publican puertos MQTT,
CoAP ni PostgreSQL. Cola in-memory adecuada para explorar, no para producción.
Los dispositivos y dashboards de demostración no son inventario ni telemetría
real de Comunard. El adapter AWS→TB, provisioning y RBAC de soporte siguen
pendientes.

Preparación desde la raíz, PowerShell (la variable solo vive en esa sesión):

```powershell
$env:TB_DEMO_DB_PASSWORD = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
docker compose -f infra/thingsboard/compose.yaml run --rm -e INSTALL_TB=true -e LOAD_DEMO=true thingsboard-ce
docker compose -f infra/thingsboard/compose.yaml up -d
```

La inicialización es para un volumen nuevo: no repetir sobre una instalación
existente. Guardar la contraseña fuera del repositorio para reinicios posteriores;
no generar otra contraseña para un volumen ya inicializado.

Abrir `http://localhost:18080`, con cuenta demo local de tenant
`tenant@thingsboard.org` y contraseña demo `tenant`. Entrar en Dashboards,
Devices y Alarms para explorar los ejemplos incluidos por ThingsBoard.
Son credenciales públicas del demo: no exponer este entorno fuera de localhost.
Para detener conservando los datos:

```powershell
docker compose -f infra/thingsboard/compose.yaml stop
```

No usar `down -v` salvo que se desee eliminar explícitamente todo el demo.
Guía y versión base: [instalación oficial](https://thingsboard.io/docs/installation/docker/).

## Instancia preparada por Codex

La ejecución local usa `tmp/thingsboard-demo.env`, excluido de Git, con una
contraseña aleatoria de PostgreSQL. Para esa instancia no regenerar la variable
del ejemplo. Tras migrar al principal, usar los comandos de la primera sección.
Estos comandos corresponden únicamente al modo independiente anterior:

```powershell
docker compose --env-file tmp/thingsboard-demo.env -f infra/thingsboard/compose.yaml up -d
docker compose --env-file tmp/thingsboard-demo.env -f infra/thingsboard/compose.yaml stop
```

Mantener ese archivo en el equipo; no enviarlo al chat ni incluirlo en commits.
