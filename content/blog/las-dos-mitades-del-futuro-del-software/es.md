---
title: "Las dos mitades del futuro del software"
description: "Cognition construyó el motor que ejecuta la intención. Google construyó el formato donde la intención se guarda. Ninguno construyó la pieza del medio — y esa pieza es un problema de escritura, no de programación."
date: "2026-07-24"
tags:
  - ensayo
  - software
  - intención
  - IA
draft: false
---

*(y por qué la que falta no se escribe en código)*

Cognition construyó el motor que ejecuta la intención. Google construyó el formato donde la intención se guarda. Ninguno construyó la pieza del medio — y esa pieza es un problema de escritura, no de programación.

Los dos productos de los que habla este ensayo: [**Devin**](https://devin.ai/), de Cognition, el ingeniero de software autónomo, y [**DESIGN.md**](https://github.com/google-labs-code/design.md), de Google Labs, el formato de intención de diseño para agentes de código.

## Dos empresas construyeron la misma idea sin nombrarla

Hay una transformación en curso en la forma en que se hace software, y la parte rara es que las dos empresas que más cerca están de completarla no la están describiendo como lo que es. Cada una construyó una mitad. Ninguna dice en voz alta que son mitades de la misma cosa.

Este ensayo es sobre esa cosa. Sobre por qué Devin, de Cognition, y DESIGN.md, de Google, son los dos extremos de una única inversión estructural — y sobre por qué la pieza que falta en el medio, la que completaría el futuro del software, no es un problema de informática sino de lenguaje.

Para verlo hay que empezar un poco más atrás, por una dirección que atraviesa toda la historia del software.

## Hace setenta años que el software se mueve en una sola dirección

Cavá hacia abajo desde cualquier herramienta que uses hoy y encontrás una torre: un framework sobre una librería sobre un lenguaje sobre un runtime sobre un lenguaje de sistemas sobre instrucciones de máquina sobre voltaje. Cada piso de esa torre hace lo mismo: usa el de abajo para fingir algo más abstracto, y funciona precisamente porque oculta el de abajo. Programás en el nivel alto sin pensar en voltajes porque alguien construyó ese piso lo bastante sólido como para que te pares encima sin mirar.

Y hay una dirección en cómo crece esa torre. Cada capa nueva convierte un “cómo” tedioso en un “qué” cómodo. El ensamblador te sacó los unos y ceros. Los lenguajes de alto nivel te sacaron el ensamblador. Cada nivel te acerca a decir qué querés y te aleja de detallar cómo hacerlo.

Y fijate que el mecanismo que hace posible cada uno de esos saltos tiene un nombre preciso: un **compilador**. Un compilador toma una descripción escrita en un lenguaje más abstracto y la traduce a uno más concreto, rellenando por su cuenta todos los detalles de implementación que vos no escribiste. Toda la torre, en el fondo, es una pila de compiladores: cada capa traduce la de arriba a la de abajo. Guardá esa palabra, porque es la que importa.

El ejemplo más limpio de esa dirección es una librería de interfaz que hoy es estándar. Antes, actualizar la pantalla era un infierno de instrucciones manuales: “cambió este dato, buscá tal elemento, modificá este pedacito, sincronizá con este otro”. La idea que lo cambió todo fue darlo vuelta: vos describís cómo debería verse la pantalla para cada estado, y el sistema calcula solo la diferencia. Pasás de ordenar cambios a describir el resultado.

Eso tiene una estructura que conviene aislar, porque es la llave de todo lo que sigue. Se toman dos cosas que antes sincronizabas a mano —un estado y una pantalla— y se decide que una es la fuente y la otra la derivada. Vos sos dueño de la fuente; lo derivado se compila solo desde ella. No se agrega poder hacia el hardware: se cambia qué es fuente y qué es consecuencia. Es una inversión conceptual, no un piso más alto. Llamémosla el **molde de la inversión**.

## Intención y código: el último par que seguimos sincronizando a mano

Hoy queda un par que manejamos exactamente como antes se manejaban el estado y la pantalla —a pura sincronización manual: la **intención** y el **código**.

Tenés una intención. Producís el código. Y después los dos viven sueltos: la intención se evapora, vive en tu cabeza y desaparece, y el código queda como la verdad que guardás, editás y versionás. Sos vos corriendo entre los dos para mantenerlos alineados. Si dentro de un año abrís un archivo, ves el qué quedó, no el para qué lo hiciste — tenés que reconstruir tu propia intención leyendo el código al revés.

La próxima capa es aplicarle a ese par el molde de la inversión: que la intención sea la fuente de verdad —lo que guardás y versionás— y que el código pase a ser lo derivado, lo que se compila desde la intención cada vez, descartable como la pantalla que se rehace desde el estado. Dicho de otro modo: que la intención se vuelva el lenguaje fuente y el código el artefacto compilado — el objeto intermedio que hoy ya nadie edita a mano en las capas de abajo, y que dejaría de editarse a mano también acá.

Es un movimiento lateral, no hacia arriba. “Hacia arriba” sería más músculo: que la máquina escriba mejor código, más rápido. Eso no cambia nada estructural — el código sigue siendo el rey, con mejor escriba. “Lateral” es otra cosa: no toca el poder, cambia dónde vive la verdad.

Y acá viene lo interesante, porque esa inversión ya empezó a construirse —pero partida en dos, por dos empresas distintas, que no se dan la mano.

## La mitad que ya existe: Cognition construyó el compilador

Devin, de Cognition, es el motor que toma una intención y la ejecuta. Le das una tarea —un bug, una feature, una migración— y planea, escribe el código, corre los tests y abre un pull request, todo en su propio entorno con terminal, editor y browser. No es un autocomplete: es un agente autónomo. El dato que paró a la industria es que, adentro de Cognition, la enorme mayoría del código que se commitea ya lo escribe Devin, no un humano. El compilador de intención-a-código dejó de ser una idea y pasó a ser un producto que factura a escala empresarial.

Esa es, exactamente, la mitad del puente que llamamos “describir es obtener”. Nombrás el qué y aparece código que corre. La referencia muerta —“quiero esto”— se volvió accionable.

Pero fijate dónde queda la fuente de verdad, porque es el punto entero. Devin entrega su trabajo como un pull request. Lo que se revisa, lo que se mergea, lo que se versiona, lo que queda guardado en el repositorio para siempre, es el código. La intención que le diste —el prompt, la tarea— se evapora igual que siempre. Devin escribe la abrumadora mayoría del código, sí, pero el código sigue siendo el rey. Devin es un compilador extraordinario cuyo output se guarda en lugar de su input: cambió quién escribe, no qué es la fuente. Es la mitad del molde —la compilación— sin la otra mitad —la fuente persistente. Como si tuvieras un compilador de C brillante, pero versionaras el binario y tiraras el código fuente.

## La mitad que existe a medias: Google convirtió la intención en fuente

DESIGN.md, de Google Labs, es la otra mitad exacta, y es casi conmovedor lo complementarias que son.

Es un archivo markdown que combina tokens legibles por máquina —en el front matter— con prosa que explica por qué existen esos valores. Un agente que lo lee entiende el sistema de diseño y produce la interfaz correcta. Tiene su propio PHILOSOPHY.md. Tiene un comando diff que compara dos versiones y detecta “regresiones de prosa” — es decir, versiona la intención de diseño como artefacto de primera clase. En días juntó decenas de miles de estrellas.

Eso es el README como fuente, hecho producto: un documento de intención que deja de describir el resultado y pasa a generarlo. Es el lenguaje fuente que buscábamos — la verdad se corre del código hacia la descripción. Pero es la otra mitad del molde —la fuente persistente— sin motor propio: DESIGN.md no compila nada, es un formato, no un compilador. Y cubre una sola capa: la visual. Los tokens de color, tipografía, espaciado. Nada más.

## Lo que aparece cuando ponés las dos mitades una al lado de la otra

Cognition tiene el compilador sin la fuente persistente. Ejecuta la intención magníficamente y después la tira; lo que guarda es el artefacto compilado.

Google tiene la fuente persistente sin el compilador general. Guarda la intención como el artefacto que manda, pero solo para el diseño, y no compila nada por sí mismo.

Juntalas y aparece, exacta, la capa completa que la dirección venía anunciando: la intención guardada como lenguaje fuente + un compilador que la traduce al sistema entero, cada vez. El README como fuente más el motor que lo ejecuta. Ninguna de las dos, sola, es la inversión. Las dos juntas, sí.

Pero entre una y otra falta una pieza que todavía no existe, y es una pieza nombrable: el **formato de intención general**. Un “DESIGN.md para el sistema entero”, no solo para los tokens visuales — un documento donde vivan las reglas, los comportamientos, las decisiones, el para qué de un producto completo, con la precisión suficiente para que un motor tipo Devin lo tome como su única fuente de verdad y compile el código desde ahí, en vez de tratar la intención como un prompt que se descarta después de cada tarea.

Google mostró que la intención de diseño puede ser un lenguaje fuente versionado. Cognition mostró que una intención puede compilarse de punta a punta. Nadie mostró todavía el formato donde la intención del sistema completo se guarda como la verdad y el código cuelga de ella. Esa es la baldosa siguiente del sendero. Y está vacía.

## Ningún modelo más grande va a cerrar este hueco

Es tentador pensar que esto se resuelve con más potencia — que cuando Devin sea lo bastante bueno, el hueco se cierra. No. El hueco no es de capacidad, es de estructura. Podés tener el compilador más perfecto del universo y, si sigue entregando pull requests, la fuente de verdad sigue siendo el código. Más músculo no invierte nada; solo produce un mejor artefacto compilado.

Lo que cierra el hueco es una decisión estructural: elegir que el artefacto que se guarda y se versiona sea la intención —el lenguaje fuente— y que el código sea lo derivado. Eso no lo trae un modelo más grande. Lo trae un formato —humilde, de texto, como todos los que sostienen la torre— que alguien tiene que diseñar, probar y hacer circular hasta que se vuelva sendero.

Y acá está la parte reveladora, la que da título a este ensayo. Ese formato no es un problema de informática. La intención escrita para humanos es imprecisa a propósito: un README dice “maneja usuarios” y confía en que el lector rellena los huecos. Como lenguaje fuente ejecutable, esos huecos los rellena el compilador con sus elecciones, no las tuyas. Así que el formato de intención general tiene que ser un pariente más severo del README: preciso donde importa, deliberadamente abierto solo donde de verdad no te importa cómo se resuelva.

Eso no es escribir código — es escribir con la precisión de quien redacta una ley: saber en qué frase ser quirúrgico y en cuál soltar, anticipar cómo se va a interpretar cada palabra, cerrar los huecos que no querés que otro llene por vos. La mitad que falta del futuro del software se parece más a la jurisprudencia que a la ingeniería. El talento se corre de la lógica hacia la claridad de deseo.

## El único piso que la torre no puede construirse sola

Conviene marcar un límite, porque es fácil marearse y creer que la próxima capa es “que la máquina quiera cosas”. No lo es.

Toda esta capa funciona con la máquina de compilador de una intención que ponés vos. Vos querés, ella traduce. No necesita —y es mejor que no tenga— deseos propios: querés un compilador fiel a tu deseo, no uno que compita con él. En el momento en que intentás escribir el propósito de la máquina en un archivo, ese propósito vuelve a ser el tuyo, escrito prolijo. Que tengas que definir el borde es la prueba de que el querer sigue siendo tuyo.

Devin compila. DESIGN.md guarda. El formato que falta uniría las dos. Pero ninguna de las tres cosas genera la intención — la ponés vos. El lugar de quien decide qué vale la pena querer no es un hueco que la próxima capa venga a llenar: es lo que queda afuera de la torre, del lado de quien la usa. La torre puede crecer para siempre hacia arriba, y ese lugar sigue siendo humano. No porque la máquina no llegue — porque no es un piso de la torre. Es la mano que aprieta el interruptor de más arriba.

---

Dos de las empresas más capaces del mundo construyeron, cada una, una mitad de la misma inversión, sin nombrarla. La mitad que falta —la intención como lenguaje fuente del sistema entero— no la va a traer un modelo más grande, porque no es un problema de cómputo: es un problema de escritura exacta. No hace falta ser Google ni Cognition para resolverlo. Hace falta ver que las dos mitades son mitades, y entender que la pieza del medio se redacta, no se programa.
