define({ "api": [
  {
    "type": "POST",
    "url": "/api/auth",
    "title": "do auth",
    "description": "<p>Авторизует пользователя с помощью логина и пароля, переводоит все изделия временного пользователя на него, возвращает новый токен</p>",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "mail",
            "description": "<p>Почта</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>Пароль</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Auth",
    "name": "PostApiAuth",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "token",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token.token",
            "description": "<p>Токен</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "token.userId",
            "description": "<p>Id пользователя</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    }
  },
  {
    "type": "POST",
    "url": "/api/getTemporaryToken",
    "title": "get temporary token",
    "description": "<p>Создает временного пользователя с ограниченными правами и возвращает токен авторизации</p>",
    "group": "Auth",
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Auth",
    "name": "PostApiGettemporarytoken",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "token",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token.token",
            "description": "<p>Токен</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "token.userId",
            "description": "<p>Id пользователя</p>"
          }
        ]
      }
    }
  },
  {
    "type": "POST",
    "url": "/api/register",
    "title": "do register",
    "description": "<p>Регистрирует нового пользователя с логином и паролем, переводит все изделия временного пользователя на нового, возвращает новый токен</p>",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": false,
            "field": "mail",
            "description": "<p>Почта</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "password",
            "description": "<p>Пароль</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "address",
            "description": "<p>Адрес</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Auth",
    "name": "PostApiRegister",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "token",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token.token",
            "description": "<p>Токен</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "token.userId",
            "description": "<p>Id пользователя</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    }
  },
  {
    "type": "GET",
    "url": "/api/materials",
    "title": "get materials",
    "description": "<p>Отдает доступные для печати материалы</p>",
    "group": "Product",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "material",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "material.materialId",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "material.type",
            "description": "<p>Тип материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "material.color",
            "description": "<p>Цвет материала</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "material.count",
            "description": "<p>Количество материала в граммах</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Product",
    "name": "GetApiMaterials",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    }
  },
  {
    "type": "POST",
    "url": "/api/product",
    "title": "create product",
    "description": "<p>Загружает 3d модель, создает с ней новое изделие на сервере, возвращает изделие</p>",
    "group": "Product",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "model",
            "description": "<p>Файл с моделью</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "name",
            "description": "<p>Название изделия</p>"
          },
          {
            "group": "Parameter",
            "optional": false,
            "field": "materialId",
            "description": "<p>Id материала</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "description",
            "description": "<p>Описание изделия</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Product",
    "name": "PostApiProduct",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "product",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "product.productId",
            "description": "<p>Id изделия</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "product.name",
            "description": "<p>Название изделия</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "product.materialId",
            "description": "<p>Id материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "product.description",
            "description": "<p>Описание изделия</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    }
  },
  {
    "type": "POST",
    "url": "/duplicateProduct/(:productId)",
    "title": "duplicate product",
    "description": "<p>Дублирует изделие, позволяя не загружать модель заново</p>",
    "group": "Product",
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Product",
    "name": "PostDuplicateproductProductid",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "product",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "product.productId",
            "description": "<p>Id изделия</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "product.name",
            "description": "<p>Название изделия</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "product.materialId",
            "description": "<p>Id материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "product.description",
            "description": "<p>Описание изделия</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    }
  },
  {
    "type": "PUT",
    "url": "/api/product/(:productId)",
    "title": "update product",
    "description": "<p>Обновляет данные изделия, возвращает новые данные</p>",
    "group": "Product",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": true,
            "field": "name",
            "description": "<p>Название изделия</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "materialId",
            "description": "<p>Id материала</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "description",
            "description": "<p>Описание изделия</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "count",
            "description": "<p>Количество изделий</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Product",
    "name": "PutApiProductProductid",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "product",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "product.productId",
            "description": "<p>Id изделия</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "product.name",
            "description": "<p>Название изделия</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "product.materialId",
            "description": "<p>Id материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "product.description",
            "description": "<p>Описание изделия</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    }
  },
  {
    "type": "PUT",
    "url": "/api/file/(:fileId)",
    "title": "update file",
    "description": "<p>Обновляет данные модели</p>",
    "group": "Server",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "optional": true,
            "field": "status",
            "description": "<p>Статус модели</p>"
          },
          {
            "group": "Parameter",
            "optional": true,
            "field": "amount",
            "description": "<p>Размеры модели</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/api.js",
    "groupTitle": "Server",
    "name": "PutApiFileFileid",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "optional": false,
            "field": "X-Auth-Token",
            "description": "<p>токен серверной авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "401",
            "description": "<p>Токен не был передан</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "403",
            "description": "<p>Токен не найден в базе</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "file",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "file.fileId",
            "description": "<p>Id файла</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "file.size",
            "description": "<p>Размер файла</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "file.filename",
            "description": "<p>Имя файла</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "file.status",
            "description": "<p>Статус файла</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "file.amount",
            "description": "<p>Объем модели</p>"
          }
        ]
      }
    }
  }
] });
