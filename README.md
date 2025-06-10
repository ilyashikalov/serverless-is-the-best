# Как настроить CI/CD для Cloud Functions из GitHub
## Подготовка инфраструктуры в Yandex.Cloud
1. Создаем/проверяем функции в прод и небоевом окружениях
2. Создаем сервисные аккаунты в тестовом и боевом окружениях
3. Создаем федерацию сервисных аккаунтов. Указываем
- Issuer ```https://token.actions.githubusercontent.com```
- Aud ```https://github.com/<имяпользователя>```
- JWKS ```https://token.actions.githubusercontent.com/.well-known/jwksv```
4. Создаем привязки sa к федерации. Задаем Sub : ```repo:<имяпользователя>/<имярепозитория>:environment:preprod``` для тестового окружения, и ```repo:<имяпользователя>/<имярепозитория>:ref:refs/heads/main``` для боевого окружения. Обратите внимание, прод требует изоляции. Например, можно использовать отдельный фолдер, отдельный сервисный аккаунт, отдельная федерация и привязки 
## Готовим репозиторий с кодом функции 
1. Клонируем ```git@github.com:ilyashikalov/serverless-is-the-best.git```
2. Клонируем целевой репозиторий с кодом функции. Исходный код функции уже должны быть в нем.
3. Копируем serverless-is-the-best/.github/workflows/c[dit].yml в .github/workflows репозитория с кодом нашей функции
4. Изменяем переменные
5. Коммитим и пушим c[dit].yml
## Проверяем работоспособность. При ошибках с доступом используем https://github.com/github/actions-oidc-debugger для поиска ошибок OpenID Connect

![image](https://github.com/user-attachments/assets/6c7e5798-e422-42c2-a168-db3d1fc0d3ac)
# Полезные материалы
- [Репозиторий yc-sls-function, в котором реализован GitHub action, используемый в workflows](https://github.com/yc-actions/yc-sls-function/blob/main/action.yml)
- [Статья о пользовании GitHub action выше](https://nikolaymatrosov.ru/2021-11-08-Building-CI-CD-in-Yandex-Cloud-using-GitHub-Actions/)
- [GitHub action, помогающий разобраться в проблемах аутентификации через OpenID Connect](https://github.com/github/actions-oidc-debugger)
- [Статья о том, как работает авторизация в Yandex Cloud и как можно создавать привязвки сервисных аккаунтов к федерациям](https://nikolaymatrosov.ru/2025-05-04-Authorizing-in-GitHub-Actions-via-Workload-Identities/)
