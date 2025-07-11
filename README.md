# Как настроить CI/CD для Cloud Functions из GitHub
В современной разработке автоматизация процессов доставки кода в боевое окружение играет критическую роль, позволяя сократить время выпуска новых версий и снизить количество ошибок при развертывании. Данная инструкция поможет вам настроить полноценный CI/CD пайплайн для Yandex Cloud Functions с использованием GitHub.

Следуя пошаговому руководству, вы создадите необходимую инфраструктуру в Yandex.Cloud, настроите автоматизированные процессы развертывания, а также реализуете разделение на тестовое и production окружения. Это позволит вашей команде безопасно и эффективно вносить изменения в облачные функции без ручных операций по деплою.
## Подготовка инфраструктуры в Yandex.Cloud
1. Создаем/проверяем функции в прод и небоевом окружениях. Этот шаг необязателен, так как action создаст функцию при её отсутствии, но во избежании ошибок лучше скопировать имя функции непосредственно из Яндекс.Облака 
2. Создаем сервисные аккаунты с ролью ```functions.admin``` в тестовом и боевом окружениях для доступа к Cloud API . Обратите внимание, что в некоторых случаях вам могут потребоваться дополнительные роли, например, роль ```vpc.user``` для создания функции в заданной сети
3. Создаем федерацию сервисных аккаунтов для механизма OpenID Connect. Указываем.
- Issuer ```https://token.actions.githubusercontent.com```.
- Aud ```https://github.com/<имяпользователя>```.
- JWKS ```https://token.actions.githubusercontent.com/.well-known/jwks```.
4. Создаем привязки сервисного аккаунта к федерации. Задаем Sub : ```repo:<имяпользователя>/<имярепозитория>:environment:preprod``` для тестового окружения, и ```repo:<имяпользователя>/<имярепозитория>:ref:refs/heads/main``` для боевого окружения. Обратите внимание, прод требует изоляции. Например, можно использовать отдельный фолдер, отдельный сервисный аккаунт, отдельная федерация и привязки. Больше деталей по тому, как настроить привязки, вы можете найти [здесь](https://nikolaymatrosov.ru/2025-05-04-Authorizing-in-GitHub-Actions-via-Workload-Identities/#типы-subject-в-github) и [здесь](https://docs.github.com/en/actions/concepts/security/about-security-hardening-with-openid-connect#example-subject-claims)
## Готовим репозиторий с кодом функции 
1. Клонируем ```git@github.com:ilyashikalov/serverless-is-the-best.git``` или создаем из шаблона [ilyashikalov/serverless-is-the-best](https://github.com/ilyashikalov/serverless-is-the-best).
2. Клонируем целевой репозиторий с кодом функции. Исходный код функции уже должны быть в нем.
3. Копируем файлы ci.yml, cd.yml и сt.yml из папки serverless-is-the-best/.github/workflows в .github/workflows репозитория с кодом нашей функции.
4. Изменяем переменные.
5. Коммитим и пушим файлы ci.yml, cd.yml и сt.yml.
## Проверяем работоспособность
1. Создаем ветку ```feature/smoke-test```.
2. Модифицируем файл или файлы кода.
3. Проверяем, что модифицированные файлы не подпадают под маску в параметре ```paths-ignore``` в секции ```on```.
4. Коммитим и пушим изменения.
5. Должен запуститься воркфлоу ```.github/workflows/ci.yml```.
6. Создаем пулл-реквест в ветку ```main```.
7. Должен запуститься пайплайн ```.github/workflows/ct.yml```.
8. Мержим пулл-реквест.
9. Должен запуститься воркфлоу ```.github/workflows/cd.yml```.

При ошибках с доступом используем https://github.com/github/actions-oidc-debugger для поиска ошибок OpenID Connect

![image](https://github.com/user-attachments/assets/6c7e5798-e422-42c2-a168-db3d1fc0d3ac)
# Полезные материалы
- [Репозиторий yc-sls-function, в котором реализован GitHub action, используемый в workflows](https://github.com/yc-actions/yc-sls-function/blob/main/action.yml).
- [Статья о пользовании GitHub action выше](https://nikolaymatrosov.ru/2021-11-08-Building-CI-CD-in-Yandex-Cloud-using-GitHub-Actions/).
- [GitHub action, помогающий разобраться в проблемах аутентификации через OpenID Connect](https://github.com/github/actions-oidc-debugger).
- [Статья о том, как работает авторизация в Yandex Cloud и как можно создавать привязки сервисных аккаунтов к федерациям](https://nikolaymatrosov.ru/2025-05-04-Authorizing-in-GitHub-Actions-via-Workload-Identities/).
