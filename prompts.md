# Testing Journey: Prompts Evolution

## Primer Prompt (Original)
```
Como expert senior qa engineer, tu misión será crear una suite de tests unitarios en Jest para la funcionalidad de insertar candidatos en base de datos. 
Hay 2 familias principales de tests, recepción de los datos del formulario, y guardado en la base de datos. Queremos ver tests que cubran ambos procesos con al menos un test.
utiliza las mejores practicas de desarrollo, testing y base de datos. Si alguno de los tests requiere modificar algo en base de datos, recuerda que lo ideal cuando las pruebas unitarias requieren interacción con base de datos, es mockearla para no alterar los datos. 
Si hay test cases fallidos por vulnerabilidades en el sistema, crear un documento detallado llamado vulnerabilidades.md (formato markdown) que liste todas las vulnerabilidades con un id y el test case fallido asociado, y skipear los test cases fallidos correspondientes.
Todavia no desarrolles nada, explica por pasos que hay que hacer para lograr lo que te pedi y que objetos tienen que usar mocks
```

## Prompt Actual (Contexto Completo)
```
ahora crea un archivo llamado prompts.md (markdown format) con mi primer prompt, mi prompt actual y el prompt perfecto que crees (meta prompting) para lograr lo que hicimos hasta ahora de testing (unitario y de integracion).

El prompt solo debe estar enfocado en las tareas de testing implementadas en el proyecto hasta el momento, aplicando las mejores practicas de testing y desarrollo.
```

## Prompt Perfecto (Meta-Prompting)

### 🎯 **META-PROMPT: Implementación Completa de Testing Unitario e Integración**

# 🧪 IMPLEMENTACIÓN COMPLETA DE TESTING SUITE
## Proyecto: Node.js/TypeScript + Express + Prisma + Jest

### 📋 **CONTEXTO Y ROL**
Actúa como **Senior QA Engineer** con 10+ años de experiencia en testing automatizado. Tu objetivo es implementar una suite completa de testing unitario e integración para un proyecto Node.js/TypeScript que maneja candidatos con validaciones complejas, operaciones CRUD y subida de archivos.

---

### 🎯 **OBJETIVOS PRINCIPALES**

#### ✅ **Testing Unitario**
- [ ] Tests aislados para cada capa de la arquitectura
- [ ] Cobertura del 100% de métodos públicos
- [ ] Mocks apropiados para dependencias externas
- [ ] Validación de casos edge y error handling

#### 🔗 **Testing de Integración**
- [ ] Flujos completos de operaciones CRUD
- [ ] Validación con base de datos real
- [ ] Manejo de errores en escenarios reales
- [ ] Performance testing básico

#### 🏗️ **Arquitectura y Setup**
- [ ] Configuración robusta de Jest + TypeScript
- [ ] Estructura de carpetas escalable
- [ ] Factories y helpers reutilizables
- [ ] CI/CD ready configuration

#### 📚 **Documentación y Seguridad**
- [ ] Documentación completa de testing
- [ ] Análisis de vulnerabilidades de seguridad
- [ ] Guías de mejores prácticas
- [ ] Meta-prompting para reutilización

---

### 🏛️ **ARQUITECTURA DEL PROYECTO**

**Estructura de Carpetas:**
- `backend/src/presentation/controllers/` - Capa HTTP
- `backend/src/application/services/` - Lógica de negocio
- `backend/src/application/validator.ts` - Validaciones
- `backend/src/domain/models/` - Modelos de datos
- `backend/prisma/` - Esquema de base de datos
- `backend/src/__tests__/` - Suite de tests
- `backend/VULNERABILIDADES.md` - Análisis de seguridad
- `prompts.md` - Meta-prompting y documentación

**Organización de Tests:**
- `__tests__/unit/` - Tests unitarios por capa
- `__tests__/integration/` - Tests de integración
- `__tests__/factories/` - Factories de datos de prueba
- `__tests__/helpers/` - Utilidades de testing

---

### 📦 **STACK TECNOLÓGICO**

| Capa | Tecnología | Propósito |
|------|------------|-----------|
| **Runtime** | Node.js + TypeScript | Base de la aplicación |
| **Framework** | Express.js | HTTP Server |
| **ORM** | Prisma | Database operations |
| **Testing** | Jest + ts-jest | Test framework |
| **Validation** | Custom validators | Data validation |
| **File Upload** | Multer | File handling |
| **Documentation** | Markdown | Project documentation |

---

### 🚀 **IMPLEMENTACIÓN PASO A PASO**

#### **FASE 1: SETUP Y CONFIGURACIÓN** ⚙️

**1.1 Configuración de Jest**
- Configurar Jest con ts-jest para TypeScript
- Establecer estructura de carpetas para tests
- Configurar coverage thresholds (80%+)
- Setup de mocks globales para PrismaClient
- Configurar test environment y matchers

**1.2 Estructura de Carpetas**
- Crear estructura organizada por tipo de test
- Separar tests unitarios de integración
- Organizar factories y helpers reutilizables
- Setup de archivos de configuración global

**1.3 Global Setup**
- Mock global de PrismaClient
- Configuración de test utilities globales
- Setup de helpers para mocks de Express
- Configuración de test data factories

#### **FASE 2: FACTORIES Y HELPERS** 🏭

**2.1 Candidate Factory**
- Factory para datos válidos de candidatos
- Factory para datos inválidos (testing de errores)
- Factory para casos edge (datos límite)
- Factory para datos anidados (educación, experiencia)

**2.2 Mock Helpers**
- Helpers para crear mocks de PrismaClient
- Helpers para mocks de Express request/response
- Helpers para mocks de file upload
- Helpers para mocks de validaciones

**2.3 Test Utilities**
- Funciones helper para assertions comunes
- Utilities para setup/teardown de tests
- Helpers para validación de respuestas HTTP
- Utilities para manejo de errores en tests

#### **FASE 3: TESTS UNITARIOS** 🔬

**3.1 Validator Tests** ✅
- Tests para validación de nombres (español, acentos, caracteres especiales)
- Tests para validación de emails (formatos válidos e inválidos)
- Tests para validación de teléfonos (formatos internacionales)
- Tests para validación de fechas (rangos válidos, fechas futuras)
- Tests para validación de archivos (tipos, tamaños, formatos)
- Tests para datos anidados (educación, experiencia laboral)
- Tests para casos edge (datos límite, valores extremos)
- Tests para error handling (datos inválidos, excepciones)

**3.2 Model Tests** 📊
- Tests para método save() (crear y actualizar)
- Tests para método findOne() (búsqueda por ID)
- Tests para método update() (actualización parcial)
- Tests para método delete() (eliminación)
- Tests para error handling (errores de base de datos)
- Tests para casos edge (datos duplicados, constraints)

**3.3 Service Tests** 🧠
- Tests para lógica de negocio
- Tests para validaciones de servicios
- Tests para manejo de errores
- Tests para casos edge y límites
- Tests para integración entre servicios

**3.4 Controller Tests** 🎮
- Tests para endpoints HTTP (GET, POST, PUT, DELETE)
- Tests para manejo de requests (body, params, query)
- Tests para respuestas HTTP (status codes, JSON)
- Tests para error handling (400, 500, validation errors)
- Tests para file upload handling
- Tests para middleware integration

#### **FASE 4: TESTS DE INTEGRACIÓN** 🔗

**4.1 Candidate CRUD Operations**
- Tests completos de creación de candidatos
- Tests de actualización de datos
- Tests de eliminación de candidatos
- Tests de búsqueda y filtrado
- Tests con base de datos real

**4.2 File Upload Integration**
- Tests de subida de archivos CV
- Tests de validación de archivos
- Tests de almacenamiento de archivos
- Tests de manejo de errores en upload

**4.3 Database Integration**
- Tests con Prisma real
- Tests de transacciones
- Tests de relaciones entre entidades
- Tests de performance básico

#### **FASE 5: DOCUMENTACIÓN Y SEGURIDAD** 📚

**5.1 Análisis de Vulnerabilidades**
- Crear archivo VULNERABILIDADES.md
- Documentar vulnerabilidades identificadas
- Clasificar por severidad (Crítica, Alta, Media, Baja)
- Proporcionar recomendaciones de mitigación
- Incluir ejemplos de código vulnerable y seguro

**5.2 Meta-Prompting**
- Crear archivo prompts.md
- Documentar evolución de prompts
- Crear meta-prompt reutilizable
- Incluir mejores prácticas identificadas
- Documentar patrones de testing aplicados

**5.3 Documentación de Testing**
- Guías de mejores prácticas
- Patrones de testing implementados
- Ejemplos de uso de factories y mocks
- Troubleshooting común

---

### 🎯 **MEJORES PRÁCTICAS IMPLEMENTADAS**

#### **1. Patrón AAA (Arrange-Act-Assert)** 📐
- **Arrange:** Preparar datos, mocks y configuración
- **Act:** Ejecutar la función o método bajo test
- **Assert:** Verificar resultados y comportamientos esperados

#### **2. Mocks Apropiados** 🎭
- ✅ **SÍ usar mocks para:** PrismaClient, Express req/res, File system, HTTP calls
- ❌ **NO usar mocks para:** Lógica de negocio pura, validaciones internas, cálculos

#### **3. Factories para Datos de Prueba** 🏭
- Datos consistentes y reutilizables
- Variaciones para casos edge
- Datos inválidos para testing de errores
- Factories anidadas para datos complejos

#### **4. Naming Conventions** 📝
- Nombres descriptivos para describe blocks
- Nombres claros para test cases
- Organización por funcionalidad
- Separación clara entre casos de éxito y error

#### **5. Error Handling Testing** ⚠️
- Tests para todos los tipos de errores
- Validación de mensajes de error
- Tests para excepciones no esperadas
- Coverage de error scenarios

#### **6. Test Isolation** 🔒
- Tests independientes entre sí
- Setup/teardown apropiado
- Mocks reseteados entre tests
- Base de datos limpia entre tests

#### **7. Documentación y Seguridad** 🛡️
- Análisis continuo de vulnerabilidades
- Documentación de patrones de testing
- Meta-prompting para reutilización
- Guías de mejores prácticas

---

### 📊 **COBERTURA Y MÉTRICAS**

#### **Cobertura Objetivo**
- **Statements:** 90%+
- **Branches:** 85%+
- **Functions:** 95%+
- **Lines:** 90%+

#### **Tipos de Tests por Capa**
| Capa | Tests Unitarios | Tests Integración | Total |
|------|----------------|-------------------|-------|
| **Validators** | 90+ | 10+ | 100+ |
| **Models** | 40+ | 15+ | 55+ |
| **Services** | 30+ | 10+ | 40+ |
| **Controllers** | 25+ | 15+ | 40+ |
| **Integration** | - | 20+ | 20+ |
| **Total** | 185+ | 70+ | 255+ |

---

### 🚀 **COMANDOS DE EJECUCIÓN**

**Comandos Principales:**
- `yarn test` - Ejecutar todos los tests
- `yarn test:coverage` - Ejecutar tests con coverage
- `yarn test:unit` - Ejecutar solo tests unitarios
- `yarn test:integration` - Ejecutar solo tests de integración
- `yarn test:watch` - Ejecutar tests en modo watch
- `yarn test -- --testNamePattern="pattern"` - Ejecutar tests específicos

---

### 📋 **CHECKLIST DE IMPLEMENTACIÓN**

#### **Fase 1: Setup** ⚙️
- [ ] Jest configurado con TypeScript
- [ ] Estructura de carpetas creada
- [ ] Global setup implementado
- [ ] Factories básicas creadas
- [ ] Mock helpers implementados

#### **Fase 2: Validators** ✅
- [ ] Tests para validación de nombres
- [ ] Tests para validación de emails
- [ ] Tests para validación de teléfonos
- [ ] Tests para validación de fechas
- [ ] Tests para validación de archivos
- [ ] Tests para datos anidados
- [ ] Tests para casos edge

#### **Fase 3: Models** 📊
- [ ] Tests para método save()
- [ ] Tests para método findOne()
- [ ] Tests para método update()
- [ ] Tests para método delete()
- [ ] Tests para error handling
- [ ] Tests para casos edge

#### **Fase 4: Services** 🧠
- [ ] Tests para lógica de negocio
- [ ] Tests para validaciones
- [ ] Tests para error handling
- [ ] Tests para casos edge

#### **Fase 5: Controllers** 🎮
- [ ] Tests para endpoints HTTP
- [ ] Tests para manejo de requests
- [ ] Tests para respuestas HTTP
- [ ] Tests para error handling
- [ ] Tests para validaciones

#### **Fase 6: Integration** 🔗
- [ ] Tests de operaciones CRUD completas
- [ ] Tests con base de datos real
- [ ] Tests de file upload
- [ ] Tests de performance básico

#### **Fase 7: Documentación** 📚
- [ ] Análisis de vulnerabilidades (VULNERABILIDADES.md)
- [ ] Meta-prompting (prompts.md)
- [ ] Documentación de patrones
- [ ] Guías de mejores prácticas

#### **Fase 8: Optimización** ⚡
- [ ] Revisión de cobertura
- [ ] Optimización de mocks
- [ ] Documentación de patrones
- [ ] CI/CD configuration

---

### 🎯 **ENTREGABLES FINALES**

1. **Configuración Completa**
   - Jest config optimizado
   - TypeScript setup
   - Prisma mocking

2. **Suite de Tests**
   - 255+ tests organizados
   - Cobertura 90%+
   - Casos edge cubiertos

3. **Utilities y Helpers**
   - Factories reutilizables
   - Mock helpers
   - Test utilities

4. **Documentación**
   - Patrones de testing
   - Guías de implementación
   - Mejores prácticas
   - Meta-prompting (prompts.md)

5. **Análisis de Seguridad**
   - VULNERABILIDADES.md
   - Clasificación de vulnerabilidades
   - Recomendaciones de mitigación
   - Ejemplos de código seguro

6. **CI/CD Ready**
   - GitHub Actions config
   - Coverage reporting
   - Test automation

---

### 🔍 **CASOS DE USO ESPECÍFICOS**

#### **Validación de Nombres Españoles**
- Nombres con acentos (José, María)
- Nombres con ñ (Ñoño, Niño)
- Nombres compuestos (María José)
- Nombres con apellidos múltiples

#### **Validación de Emails**
- Formatos estándar
- Emails con subdominios
- Emails con caracteres especiales
- Emails inválidos (sin @, sin dominio)

#### **Validación de Teléfonos**
- Formatos internacionales
- Teléfonos con códigos de país
- Teléfonos móviles vs fijos
- Formatos inválidos

#### **Validación de Fechas**
- Fechas de nacimiento válidas
- Rechazo de fechas futuras
- Manejo de timezones
- Formatos de fecha múltiples

#### **File Upload**
- Tipos de archivo permitidos
- Límites de tamaño
- Validación de contenido
- Manejo de errores de upload

---

### 🚨 **ERROR HANDLING COMPREHENSIVE**

#### **Tipos de Errores a Testear**
- Errores de validación (400)
- Errores de base de datos (500)
- Errores de archivo (413, 415)
- Errores de autenticación (401)
- Errores de autorización (403)
- Errores de recurso no encontrado (404)

#### **Estrategias de Testing de Errores**
- Tests para cada tipo de error
- Validación de mensajes de error
- Tests para error logging
- Tests para error recovery
- Tests para graceful degradation

---

### 🛡️ **ANÁLISIS DE VULNERABILIDADES**

#### **Vulnerabilidades Identificadas**
- **SQL Injection** - Prevención con Prisma ORM
- **XSS (Cross-Site Scripting)** - Validación de inputs
- **File Upload Vulnerabilities** - Validación de archivos
- **Input Validation** - Sanitización de datos
- **Error Information Disclosure** - Manejo seguro de errores

#### **Documentación de Seguridad**
- Archivo VULNERABILIDADES.md
- Clasificación por severidad
- Ejemplos de código vulnerable vs seguro
- Recomendaciones de mitigación
- Mejores prácticas de seguridad

---

**Implementa paso a paso, ejecutando tests después de cada fase para validar funcionamiento, y ajusta configuración según errores encontrados. Mantén el foco en la calidad, cobertura del código y seguridad.**

---

## Resumen de lo Implementado

### ✅ Completado:
1. **Setup y Configuración**
   - Jest configurado con ts-jest
   - Estructura de carpetas organizada
   - Mocks globales para PrismaClient
   - Factories para datos de prueba
   - Helpers para mocks de Express

2. **Tests Unitarios**
   - **Validators:** 90 tests cubriendo todas las reglas de validación
   - **Models:** Tests para save() con mocks de Prisma
   - Configuración de mocks apropiados por capa

3. **Mejores Prácticas Aplicadas**
   - Mocks solo para dependencias externas
   - Tests aislados y determinísticos
   - Factories para datos consistentes
   - Naming conventions descriptivos

4. **Documentación y Seguridad**
   - Archivo VULNERABILIDADES.md creado
   - Meta-prompting documentado en prompts.md
   - Análisis de vulnerabilidades de seguridad

### 🔄 En Progreso:
- Tests unitarios completos para Models (findOne, update, delete)
- Tests unitarios para Services y Controllers
- Tests de integración para operaciones CRUD

### 📋 Pendiente:
- Cobertura completa de error handling
- Tests de integración para flujos completos
- Optimización de configuración de Jest
- Documentación de patrones aplicados 