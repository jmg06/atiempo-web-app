# A tiempo · Aplicación web

Prototipo funcional de **a tiempo**, una aplicación para acompañar el tratamiento de medicamentos en casa:
crear el hogar, armar el esquema de dosis del día e invitar a la otra persona que administra las dosis.

Es un prototipo para evaluación de experiencia de usuario: **no tiene servidor ni base de datos**. Todos los
datos viven en la memoria del navegador, así que al recargar la página todo vuelve al estado inicial.

## Alcance de la entrega

La entrega pedía construir seis pantallas que completaran un flujo principal, y las pantallas de registro e
ingreso no contaban dentro de esas seis. Decidimos ir más allá: diseñamos en Figma las diecisiete pantallas
del producto y las construimos todas en esta aplicación web, incluidas las de acceso y los estados de error
(correo que ya tiene cuenta, clave incorrecta, dos bloques a menos de treinta minutos, invitación reenviada,
esquema recién publicado).

Lo hicimos porque queríamos poder recorrer la experiencia completa, de principio a fin, y no solo un tramo del
camino.

## Distribución de pantallas

El diseño completo son treinta y nueve pantallas: las diecisiete de esta aplicación web y veintidós de la
aplicación móvil. Se repartieron cruzando las dos plataformas, para que cada integrante quedara con pantallas
del flujo principal en las dos aplicaciones.

| Integrante         | Pantallas de esta aplicación web                                                                            | Cuántas |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | ------- |
| **Juan Gutiérrez** | Esquema del tratamiento, flujo principal `FW3`: `PW5` `PW6` `PW6b` `PW7` `PW7b` `PW8` `PW8b`                | 7       |
| **Nicolás Munar**  | Acceso: `PW1` `PW1b` `PW2` `PW3` `PW4` `PW4b` `PW11` · Personas, flujo principal `FW4`: `PW9` `PW9b` `PW10` | 10      |

Las otras veintidós pantallas están en el repositorio de la versión móvil.

## Enlaces

| Recurso                         | Enlace                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Aplicación desplegada           | [miso-4302-atiempo.netlify.app](https://miso-4302-atiempo.netlify.app)                                                                |
| Repositorio de la versión móvil | [github.com/jmg06/atiempo-mobile-app](https://github.com/jmg06/atiempo-mobile-app)                                                    |
| Diseño en Figma                 | [A tiempo App · Mockups](https://www.figma.com/design/XqwhO9RKSVZWD79l1027zh/A-tiempo-App---Mockups?node-id=0-1&t=o7KXrs4ZtAV0vbuD-1) |

## Herramientas necesarias

| Herramienta | Versión                                    | Para qué sirve                         |
| ----------- | ------------------------------------------ | -------------------------------------- |
| Node.js     | 22.22.3 o superior, **o** 24.15 o superior | Ejecuta la aplicación en el computador |
| npm         | 8 o superior (viene incluido con Node.js)  | Instala las librerías del proyecto     |
| Navegador   | Chrome, Edge o Safari actualizados         | Ver la aplicación                      |
| Git         | Cualquier versión reciente (opcional)      | Descargar el código                    |

Recomendado: **Node.js 24 LTS**, que es la versión con la que se desarrolló el proyecto, y **Google Chrome**.

**Se necesita conexión a internet** la primera vez, tanto para instalar las librerías como para que carguen la
tipografía y los íconos.

### Editor recomendado

[Visual Studio Code](https://code.visualstudio.com/). Al abrir la carpeta del proyecto, el propio editor
ofrece instalar las extensiones recomendadas; basta con aceptar.

El editor solo hace falta para leer o modificar el código. Para ejecutar la aplicación basta con una terminal.

## Instalación paso a paso

### 1. Instalar Node.js

Descargar la versión **LTS** desde [nodejs.org](https://nodejs.org/) e instalarla aceptando todas las opciones
por defecto. Después de instalar, **cerrar y volver a abrir** la terminal.

Para comprobar que quedó bien instalado, abrir una terminal (en Windows: menú Inicio → escribir
`PowerShell` → Enter) y ejecutar:

```bash
node -v
npm -v
```

La primera línea debe mostrar algo como `v24.18.0` y la segunda algo como `11.16.0`.

### 2. Descargar el proyecto

Con Git:

```bash
git clone https://github.com/jmg06/atiempo-web-app.git
```

Sin Git: en GitHub, botón verde **Code** → **Download ZIP** → descomprimir la carpeta.

### 3. Abrir la carpeta del proyecto en la terminal

```bash
cd atiempo-web-app
```

En VS Code: menú **File → Open Folder**, elegir la carpeta, y luego **Terminal → New Terminal**. La terminal
ya queda abierta dentro de la carpeta correcta.

Para saber que está en la carpeta correcta, el comando `dir` (Windows) o `ls` (macOS y Linux) debe mostrar un
archivo llamado `package.json`.

### 4. Instalar las librerías

```bash
npm install
```

Tarda entre 1 y 3 minutos la primera vez y descarga alrededor de 200 MB en una carpeta llamada `node_modules`.
Es normal que muestre advertencias (`warn`); lo importante es que termine sin decir `error`.

### 5. Ejecutar la aplicación

```bash
npm start
```

Cuando termine de compilar, la terminal muestra:

```
➜  Local:   http://localhost:4200/
```

Abrir esa dirección en el navegador: **http://localhost:4200/**

La terminal debe quedar abierta mientras se usa la aplicación. Para detenerla: hacer clic sobre la terminal y
presionar `Ctrl + C`.

## Cómo recorrer el prototipo

La aplicación abre en la pantalla **Entra a tu cuenta**, con el correo y la clave ya escritos. Basta con
presionar **ENTRAR** para entrar al escritorio.

Estas son las diecisiete pantallas del diseño y dónde encontrarlas. Los códigos (`PW1`, `PW1b`, …) son los
mismos del archivo de Figma, para poder compararlas con las maquetas.

| Código | Pantalla                           | Dónde se ve                                                  |
| ------ | ---------------------------------- | ------------------------------------------------------------ |
| `PW1`  | Crea tu cuenta                     | `/crear-cuenta`                                              |
| `PW1b` | El correo ya tiene una cuenta      | En `/crear-cuenta`, al presionar CONTINUAR                   |
| `PW2`  | Tus datos de salud                 | `/permiso-datos`                                             |
| `PW3`  | Crea tu hogar                      | `/crear-hogar`                                               |
| `PW4`  | Entra a tu cuenta                  | `/entrar`                                                    |
| `PW4b` | Clave incorrecta                   | En `/entrar`, al cambiar la clave y presionar ENTRAR         |
| `PW11` | Recupera tu clave                  | `/recuperar-clave`                                           |
| `PW5`  | Escritorio del tratamiento         | `/`                                                          |
| `PW6`  | Esquema vigente                    | `/esquema`                                                   |
| `PW6b` | Esquema recién publicado           | En `/esquema`, después de publicar el esquema                |
| `PW7`  | Editor del bloque                  | `/esquema/bloque`                                            |
| `PW7b` | Editor con el medicamento nuevo    | En `/esquema/bloque`, al agregar otro medicamento            |
| `PW8`  | Revisión del día antes de publicar | `/esquema/revisar`                                           |
| `PW8b` | Dos bloques a menos de 30 minutos  | En `/esquema/revisar`, si dos bloques quedan demasiado cerca |
| `PW9`  | Personas del hogar                 | `/personas`                                                  |
| `PW9b` | Invitación reenviada               | En `/personas`, al presionar REENVIAR LA INVITACIÓN          |
| `PW10` | Nueva invitación                   | `/personas/invitar`                                          |

Las pantallas con `b` no son direcciones aparte: son estados que aparecen sobre la misma pantalla.

Los formularios vienen con datos de ejemplo ya escritos, tal como en los diseños. La cuenta de prueba es
`carlos.restrepo@correo.com` y su clave ya viene puesta en la pantalla de entrada.

Como el prototipo no guarda nada, al recargar el navegador se vuelve al estado inicial. Eso es intencional.

## Tecnologías

- **Angular 22** (componentes independientes, signals y Signal Forms)
- **Angular Material 3** para los componentes de interfaz
- **Tailwind CSS 4** conectado a los tokens de color y tipografía de Material
- **TypeScript 6**
- **Prettier** para el formato del código

## Compilar para producción (opcional)

```bash
npm run build
```

Genera la versión optimizada en la carpeta `dist/atiempo-web-app/`.

## Solución de problemas

**`npm` o `node` "no se reconoce como un comando"**
Node.js no está instalado, o la terminal se abrió antes de instalarlo. Cerrar la terminal, abrirla de nuevo y
repetir. Si sigue igual, reiniciar el computador.

**Windows dice "no se puede cargar el archivo npm.ps1 porque la ejecución de scripts está deshabilitada"**
Es una restricción de PowerShell. La solución más rápida es usar la aplicación **Símbolo del sistema** (CMD)
en lugar de PowerShell. La otra opción es ejecutar una sola vez, en PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**Un error que menciona "engine", "Node.js version" o "unsupported"**
La versión de Node.js es muy antigua. Comprobar con `node -v` e instalar la versión LTS desde
[nodejs.org](https://nodejs.org/).

**`npm install` falla o se queda congelado**
Casi siempre es la conexión a internet o la red de una empresa o universidad. Comprobar la conexión, borrar la
carpeta `node_modules` si alcanzó a crearse y volver a ejecutar `npm install`. Si la red bloquea la descarga,
intentar desde otra red o con los datos del celular.

**"Port 4200 is already in use" (el puerto está ocupado)**
Otra aplicación está usando ese puerto. Ejecutar la aplicación en otro:

```bash
npm start -- --port 4300
```

Y abrir entonces http://localhost:4300/

**La página sale en blanco o no carga**
Esperar a que la terminal muestre la línea `Local: http://localhost:4200/`; la primera compilación tarda unos
segundos. Luego recargar la página con `Ctrl + F5`. Usar Chrome, Edge o Safari actualizados.

**La letra o los íconos se ven distintos a los diseños**
La tipografía y los íconos se descargan de Google Fonts, así que hace falta conexión a internet.

**Los datos que escribo desaparecen al recargar**
Es el comportamiento esperado: el prototipo no tiene servidor y guarda todo en memoria.

**`npm test` da error**
El prototipo no incluye pruebas automatizadas, así que ese comando no aplica.
