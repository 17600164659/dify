const translation = {
  api: {
    success: 'Успешно',
    actionSuccess: 'Действие выполнено успешно',
    saved: 'Сохранено',
    create: 'Создано',
    remove: 'Удалено',
  },
  operation: {
    create: 'Создать',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    clear: 'Очистить',
    save: 'Сохранить',
    saveAndEnable: 'Сохранить и включить',
    edit: 'Редактировать',
    add: 'Добавить',
    added: 'Добавлено',
    refresh: 'Перезапустить',
    reset: 'Сбросить',
    search: 'Поиск',
    change: 'Изменить',
    remove: 'Удалить',
    send: 'Отправить',
    copy: 'Копировать',
    lineBreak: 'Разрыв строки',
    sure: 'Я уверен',
    download: 'Скачать',
    delete: 'Удалить',
    settings: 'Настройки',
    setup: 'Настроить',
    getForFree: 'Получить бесплатно',
    reload: 'Перезагрузить',
    ok: 'ОК',
    log: 'Журнал',
    learnMore: 'Узнать больше',
    params: 'Параметры',
    duplicate: 'Дублировать',
    rename: 'Переименовать',
    audioSourceUnavailable: 'AudioSource недоступен',
    zoomIn: 'Увеличить',
    zoomOut: 'Уменьшение масштаба',
    openInNewTab: 'Открыть в новой вкладке',
    copyImage: 'Скопировать изображение',
    close: 'Закрывать',
    regenerate: 'Регенерировать',
    view: 'Вид',
    viewMore: 'ПОДРОБНЕЕ',
    saveAndRegenerate: 'Сохранение и повторное создание дочерних блоков',
  },
  errorMsg: {
    fieldRequired: '{{field}} обязательно',
    urlError: 'URL должен начинаться с http:// или https://',
  },
  placeholder: {
    input: 'Пожалуйста, введите',
    select: 'Пожалуйста, выберите',
  },
  voice: {
    language: {
      zhHans: 'Китайский',
      zhHant: 'Традиционный китайский',
      enUS: 'Английский',
      deDE: 'Немецкий',
      frFR: 'Французский',
      esES: 'Испанский',
      itIT: 'Итальянский',
      thTH: 'Тайский',
      idID: 'Индонезийский',
      jaJP: 'Японский',
      koKR: 'Корейский',
      ptBR: 'Португальский',
      ruRU: 'Русский',
      ukUA: 'Украинский',
      viVN: 'Вьетнамский',
      plPL: 'Польский',
      roRO: 'Румынский',
      hiIN: 'Хинди',
      trTR: 'Турецкий',
      faIR: 'Персидский',
    },
  },
  unit: {
    char: 'символов',
  },
  actionMsg: {
    noModification: 'На данный момент нет изменений.',
    modifiedSuccessfully: 'Изменено успешно',
    modifiedUnsuccessfully: 'Изменено неудачно',
    copySuccessfully: 'Скопировано успешно',
    paySucceeded: 'Оплата прошла успешно',
    payCancelled: 'Оплата отменена',
    generatedSuccessfully: 'Сгенерировано успешно',
    generatedUnsuccessfully: 'Сгенерировано неудачно',
  },
  model: {
    params: {
      temperature: 'Temperature',
      temperatureTip:
        'Контролирует случайность: более низкое значение приводит к менее случайным завершениям. По мере приближения температуры к нулю модель станет детерминированной и повторяющейся.',
      top_p: 'Top P',
      top_pTip:
        'Контролирует разнообразие с помощью ядерной выборки: 0,5 означает, что рассматривается половина всех вариантов, взвешенных по вероятности.',
      presence_penalty: 'Presence penalty',
      presence_penaltyTip:
        'Насколько штрафовать новые токены в зависимости от того, появляются ли они в тексте до сих пор.\nУвеличивает вероятность того, что модель будет говорить о новых темах.',
      frequency_penalty: 'Frequency penalty',
      frequency_penaltyTip:
        'Насколько штрафовать новые токены в зависимости от их существующей частоты в тексте до сих пор.\nУменьшает вероятность того, что модель будет повторять одну и ту же строку дословно.',
      max_tokens: 'Максимальное количество токенов',
      max_tokensTip:
        'Используется для ограничения максимальной длины ответа в токенах. \nБольшие значения могут ограничивать пространство, оставленное для подсказок, журналов чата и знаний. \nРекомендуется установить его ниже двух третей\ngpt-4-1106-preview, gpt-4-vision-preview max token (input 128k output 4k)',
      maxTokenSettingTip: 'Ваша настройка максимального количества токенов высока, что потенциально ограничивает пространство для подсказок, запросов и данных. Подумайте о том, чтобы установить его ниже 2/3.',
      setToCurrentModelMaxTokenTip: 'Максимальное количество токенов обновлено до 80% максимального количества токенов текущей модели {{maxToken}}.',
      stop_sequences: 'Стоп-последовательности',
      stop_sequencesTip: 'До четырех последовательностей, где API прекратит генерировать дальнейшие токены. Возвращаемый текст не будет содержать стоп-последовательность.',
      stop_sequencesPlaceholder: 'Введите последовательность и нажмите Tab',
    },
    tone: {
      Creative: 'Творческий',
      Balanced: 'Сбалансированный',
      Precise: 'Точный',
      Custom: 'Пользовательский',
    },
    addMoreModel: 'Перейдите в настройки, чтобы добавить больше моделей',
  },
  menus: {
    status: 'бета',
    explore: 'Исследовать',
    apps: 'Студия',
    plugins: 'Плагины',
    pluginsTips: 'Интегрируйте сторонние плагины или создавайте совместимые с ChatGPT AI-плагины.',
    datasets: 'Знания',
    datasetsTips: 'СКОРО: Импортируйте свои собственные текстовые данные или записывайте данные в режиме реального времени через Webhook для улучшения контекста LLM.',
    newApp: 'Новое приложение',
    newDataset: 'Создать знания',
    tools: 'Инструменты',
  },
  userProfile: {
    settings: 'Настройки',
    emailSupport: 'Поддержка по электронной почте',
    workspace: 'Рабочее пространство',
    createWorkspace: 'Создать рабочее пространство',
    helpCenter: 'Помощь',
    communityFeedback: 'Обратная связь',
    roadmap: 'План развития',
    community: 'Сообщество',
    about: 'О нас',
    logout: 'Выйти',
  },
  settings: {
    accountGroup: 'АККАУНТ',
    workplaceGroup: 'РАБОЧЕЕ ПРОСТРАНСТВО',
    account: 'Моя учетная запись',
    members: 'Участники',
    billing: 'Оплата',
    integrations: 'Интеграции',
    language: 'Язык',
    provider: 'Поставщик модели',
    dataSource: 'Источник данных',
    plugin: 'Плагины',
    apiBasedExtension: 'API расширение',
  },
  account: {
    avatar: 'Аватар',
    name: 'Имя',
    email: 'Электронная почта',
    password: 'Пароль',
    passwordTip: 'Вы можете установить постоянный пароль, если не хотите использовать временные коды входа',
    setPassword: 'Установить пароль',
    resetPassword: 'Сбросить пароль',
    currentPassword: 'Текущий пароль',
    newPassword: 'Новый пароль',
    confirmPassword: 'Подтвердите пароль',
    notEqual: 'Два пароля различаются.',
    langGeniusAccount: 'Учетная запись Dify',
    langGeniusAccountTip: 'Ваша учетная запись Dify и связанные с ней пользовательские данные.',
    editName: 'Редактировать имя',
    showAppLength: 'Показать {{length}} приложений',
    delete: 'Удалить учетную запись',
    deleteTip: 'Удаление вашей учетной записи приведет к безвозвратному удалению всех ваших данных, и их невозможно будет восстановить.',
    deleteConfirmTip: 'Для подтверждения, пожалуйста, отправьте следующее с вашего зарегистрированного адреса электронной почты на ',
    account: 'Счет',
    studio: 'Студия Dify',
    myAccount: 'Моя учетная запись',
  },
  members: {
    team: 'Команда',
    invite: 'Добавить',
    name: 'ИМЯ',
    lastActive: 'ПОСЛЕДНЯЯ АКТИВНОСТЬ',
    role: 'РОЛИ',
    pending: 'Ожидание...',
    owner: 'Владелец',
    admin: 'Администратор',
    adminTip: 'Может создавать приложения и управлять настройками команды',
    normal: 'Обычный',
    normalTip: 'Может только использовать приложения, не может создавать приложения',
    builder: 'Разработчик',
    builderTip: 'Может создавать и редактировать собственные приложения',
    editor: 'Редактор',
    editorTip: 'Может создавать и редактировать приложения',
    datasetOperator: 'Администратор знаний',
    datasetOperatorTip: 'Может управлять только базой знаний',
    inviteTeamMember: 'Добавить участника команды',
    inviteTeamMemberTip: 'Они могут получить доступ к данным вашей команды сразу после входа в систему.',
    emailNotSetup: 'Почтовый сервер не настроен, поэтому приглашения по электронной почте не могут быть отправлены. Пожалуйста, уведомите пользователей о ссылке для приглашения, которая будет выдана после приглашения.',
    email: 'Электронная почта',
    emailInvalid: 'Неверный формат электронной почты',
    emailPlaceholder: 'Пожалуйста, введите адреса электронной почты',
    sendInvite: 'Отправить приглашение',
    invitedAsRole: 'Приглашен как пользователь с ролью {{role}}',
    invitationSent: 'Приглашение отправлено',
    invitationSentTip: 'Приглашение отправлено, и они могут войти в Dify, чтобы получить доступ к данным вашей команды.',
    invitationLink: 'Ссылка для приглашения',
    failedInvitationEmails: 'Следующие пользователи не были успешно приглашены',
    ok: 'ОК',
    removeFromTeam: 'Удалить из команды',
    removeFromTeamTip: 'Удалить доступ к команде',
    setAdmin: 'Назначить администратором',
    setMember: 'Назначить обычным участником',
    setBuilder: 'Назначить разработчиком',
    setEditor: 'Назначить редактором',
    disInvite: 'Отменить приглашение',
    deleteMember: 'Удалить участника',
    you: '(Вы)',
  },
  integrations: {
    connected: 'Подключено',
    google: 'Google',
    googleAccount: 'Войти с помощью учетной записи Google',
    github: 'GitHub',
    githubAccount: 'Войти с помощью учетной записи GitHub',
    connect: 'Подключить',
  },
  language: {
    displayLanguage: 'Язык отображения',
    timezone: 'Часовой пояс',
  },
  provider: {
    apiKey: 'Ключ API',
    enterYourKey: 'Введите свой ключ API здесь',
    invalidKey: 'Неверный ключ API OpenAI',
    validatedError: 'Ошибка валидации: ',
    validating: 'Проверка ключа...',
    saveFailed: 'Ошибка сохранения ключа API',
    apiKeyExceedBill: 'Этот API-ключ не имеет доступной квоты, пожалуйста, прочитайте',
    addKey: 'Добавить ключ',
    comingSoon: 'Скоро',
    editKey: 'Редактировать',
    invalidApiKey: 'Неверный ключ API',
    azure: {
      apiBase: 'Базовый API',
      apiBasePlaceholder: 'Базовый URL-адрес API вашей конечной точки Azure OpenAI.',
      apiKey: 'Ключ API',
      apiKeyPlaceholder: 'Введите свой ключ API здесь',
      helpTip: 'Узнать о службе Azure OpenAI',
    },
    openaiHosted: {
      openaiHosted: 'Размещенный OpenAI',
      onTrial: 'ПРОБНАЯ ВЕРСИЯ',
      exhausted: 'КВОТА ИСЧЕРПАНА',
      desc: 'Хостинговая служба OpenAI, предоставляемая Dify, позволяет вам использовать такие модели, как GPT-3.5. Прежде чем ваша пробная квота будет исчерпана, вам необходимо настроить других поставщиков моделей.',
      callTimes: 'Количество вызовов',
      usedUp: 'Пробная квота исчерпана. Добавьте собственного поставщика модели.',
      useYourModel: 'В настоящее время используется собственный поставщик модели.',
      close: 'Закрыть',
    },
    anthropicHosted: {
      anthropicHosted: 'Anthropic Claude',
      onTrial: 'ПРОБНАЯ ВЕРСИЯ',
      exhausted: 'КВОТА ИСЧЕРПАНА',
      desc: 'Мощная модель, которая отлично справляется с широким спектром задач, от сложных диалогов и создания творческого контента до подробных инструкций.',
      callTimes: 'Количество вызовов',
      usedUp: 'Пробная квота исчерпана. Добавьте собственного поставщика модели.',
      useYourModel: 'В настоящее время используется собственный поставщик модели.',
      close: 'Закрыть',
    },
    anthropic: {
      using: 'Возможность встраивания использует',
      enableTip: 'Чтобы включить модель Anthropic, вам необходимо сначала привязаться к OpenAI или Azure OpenAI Service.',
      notEnabled: 'Не включено',
      keyFrom: 'Получите свой ключ API от Anthropic',
    },
    encrypted: {
      front: 'Ваш API-ключ будет зашифрован и сохранен с использованием',
      back: ' технологии.',
    },
  },
  modelProvider: {
    notConfigured: 'Системная модель еще не полностью настроена, и некоторые функции могут быть недоступны.',
    systemModelSettings: 'Настройки системной модели',
    systemModelSettingsLink: 'Зачем нужно настраивать системную модель?',
    selectModel: 'Выберите свою модель',
    setupModelFirst: 'Пожалуйста, сначала настройте свою модель',
    systemReasoningModel: {
      key: 'Модель системного мышления',
      tip: 'Установите модель вывода по умолчанию, которая будет использоваться для создания приложений, а также такие функции, как генерация имени диалога и предложение следующего вопроса, также будут использовать модель вывода по умолчанию.',
    },
    embeddingModel: {
      key: 'Модель встраивания',
      tip: 'Установите модель по умолчанию для обработки встраивания документов знаний, как поиск, так и импорт знаний используют эту модель встраивания для обработки векторизации. Переключение приведет к несоответствию векторного измерения между импортированными знаниями и вопросом, что приведет к сбою поиска. Чтобы избежать сбоя поиска, пожалуйста, не переключайте эту модель по своему усмотрению.',
      required: 'Модель встраивания обязательна',
    },
    speechToTextModel: {
      key: 'Модель преобразования речи в текст',
      tip: 'Установите модель по умолчанию для ввода речи в текст в разговоре.',
    },
    ttsModel: {
      key: 'Модель преобразования текста в речь',
      tip: 'Установите модель по умолчанию для ввода текста в речь в разговоре.',
    },
    rerankModel: {
      key: 'Модель повторного ранжирования',
      tip: 'Модель повторного ранжирования изменит порядок списка документов-кандидатов на основе семантического соответствия запросу пользователя, улучшая результаты семантического ранжирования',
    },
    apiKey: 'API-КЛЮЧ',
    quota: 'Квота',
    searchModel: 'Поиск модели',
    noModelFound: 'Модель не найдена для {{model}}',
    models: 'Модели',
    showMoreModelProvider: 'Показать больше поставщиков моделей',
    selector: {
      tip: 'Эта модель была удалена. Пожалуйста, добавьте модель или выберите другую модель.',
      emptyTip: 'Нет доступных моделей',
      emptySetting: 'Пожалуйста, перейдите в настройки для настройки',
      rerankTip: 'Пожалуйста, настройте модель повторного ранжирования',
    },
    card: {
      quota: 'КВОТА',
      onTrial: 'Пробная версия',
      paid: 'Платный',
      quotaExhausted: 'Квота исчерпана',
      callTimes: 'Количество вызовов',
      tokens: 'Токены',
      buyQuota: 'Купить квоту',
      priorityUse: 'Приоритетное использование',
      removeKey: 'Удалить API-ключ',
      tip: 'Приоритет будет отдаваться платной квоте. Пробная квота будет использоваться после исчерпания платной квоты.',
    },
    item: {
      deleteDesc: '{{modelName}} используются в качестве моделей системного мышления. Некоторые функции будут недоступны после удаления. Пожалуйста, подтвердите.',
      freeQuota: 'БЕСПЛАТНАЯ КВОТА',
    },
    addApiKey: 'Добавьте свой API-ключ',
    invalidApiKey: 'Неверный API-ключ',
    encrypted: {
      front: 'Ваш API-ключ будет зашифрован и сохранен с использованием',
      back: ' технологии.',
    },
    freeQuota: {
      howToEarn: 'Как заработать',
    },
    addMoreModelProvider: 'ДОБАВИТЬ БОЛЬШЕ ПОСТАВЩИКОВ МОДЕЛЕЙ',
    addModel: 'Добавить модель',
    modelsNum: '{{num}} Моделей',
    showModels: 'Показать модели',
    showModelsNum: 'Показать {{num}} моделей',
    collapse: 'Свернуть',
    config: 'Настройка',
    modelAndParameters: 'Модель и параметры',
    model: 'Модель',
    featureSupported: '{{feature}} поддерживается',
    callTimes: 'Количество вызовов',
    credits: 'Кредиты на сообщения',
    buyQuota: 'Купить квоту',
    getFreeTokens: 'Получить бесплатные токены',
    priorityUsing: 'Приоритетное использование',
    deprecated: 'Устаревший',
    confirmDelete: 'Подтвердить удаление?',
    quotaTip: 'Оставшиеся доступные бесплатные токены',
    loadPresets: 'Загрузить предустановки',
    parameters: 'ПАРАМЕТРЫ',
    loadBalancing: 'Балансировка нагрузки',
    loadBalancingDescription: 'Снизьте нагрузку с помощью нескольких наборов учетных данных.',
    loadBalancingHeadline: 'Балансировка нагрузки',
    configLoadBalancing: 'Настроить балансировку нагрузки',
    modelHasBeenDeprecated: 'Эта модель устарела',
    providerManaged: 'Управляется поставщиком',
    providerManagedDescription: 'Используйте один набор учетных данных, предоставленный поставщиком модели.',
    defaultConfig: 'Настройка по умолчанию',
    apiKeyStatusNormal: 'Статус APIKey в норме',
    apiKeyRateLimit: 'Достигнут предел скорости, доступен через {{seconds}}s',
    addConfig: 'Добавить конфигурацию',
    editConfig: 'Редактировать конфигурацию',
    loadBalancingLeastKeyWarning: 'Для включения балансировки нагрузки необходимо включить не менее 2 ключей.',
    loadBalancingInfo: 'По умолчанию балансировка нагрузки использует стратегию Round-robin. Если срабатывает ограничение скорости, будет применен 1-минутный период охлаждения.',
    upgradeForLoadBalancing: 'Обновите свой тарифный план, чтобы включить балансировку нагрузки.',
  },
  dataSource: {
    add: 'Добавить источник данных',
    connect: 'Подключить',
    configure: 'Настроить',
    notion: {
      title: 'Notion',
      description: 'Использование Notion в качестве источника данных для знаний.',
      connectedWorkspace: 'Подключенное рабочее пространство',
      addWorkspace: 'Добавить рабочее пространство',
      connected: 'Подключено',
      disconnected: 'Отключено',
      changeAuthorizedPages: 'Изменить авторизованные страницы',
      pagesAuthorized: 'Авторизованные страницы',
      sync: 'Синхронизировать',
      remove: 'Удалить',
      selector: {
        pageSelected: 'Выбранные страницы',
        searchPages: 'Поиск страниц...',
        noSearchResult: 'Нет результатов поиска',
        addPages: 'Добавить страницы',
        preview: 'ПРЕДПРОСМОТР',
      },
    },
    website: {
      title: 'Веб-сайт',
      description: 'Импортировать контент с веб-сайтов с помощью веб-краулера.',
      with: 'С',
      configuredCrawlers: 'Настроенные краулеры',
      active: 'Активный',
      inactive: 'Неактивный',
    },
  },
  plugin: {
    serpapi: {
      apiKey: 'Ключ API',
      apiKeyPlaceholder: 'Введите свой ключ API',
      keyFrom: 'Получите свой ключ SerpAPI на странице учетной записи SerpAPI',
    },
  },
  apiBasedExtension: {
    title: 'API-расширения обеспечивают централизованное управление API, упрощая настройку для удобного использования в приложениях Dify.',
    link: 'Узнайте, как разработать собственное API-расширение.',
    linkUrl: 'https://docs.dify.ai/features/extension/api_based_extension',
    add: 'Добавить API Extension',
    selector: {
      title: 'API Extension',
      placeholder: 'Пожалуйста, выберите API-расширение',
      manage: 'Управление API-расширением',
    },
    modal: {
      title: 'Добавить API-расширение',
      editTitle: 'Редактировать API-расширение',
      name: {
        title: 'Имя',
        placeholder: 'Пожалуйста, введите имя',
      },
      apiEndpoint: {
        title: 'API Endpoint',
        placeholder: 'Пожалуйста, введите конечную точку API',
      },
      apiKey: {
        title: 'API-ключ',
        placeholder: 'Пожалуйста, введите API-ключ',
        lengthError: 'Длина API-ключа не может быть меньше 5 символов',
      },
    },
    type: 'Тип',
  },
  about: {
    changeLog: 'Журнал изменений',
    updateNow: 'Обновить сейчас',
    nowAvailable: 'Dify {{version}} теперь доступен.',
    latestAvailable: 'Dify {{version}} - последняя доступная версия.',
  },
  appMenus: {
    overview: 'Мониторинг',
    promptEng: 'Оркестрация',
    apiAccess: 'Доступ к API',
    logAndAnn: 'Журналы и аннотации',
    logs: 'Журналы',
  },
  environment: {
    testing: 'ТЕСТИРОВАНИЕ',
    development: 'РАЗРАБОТКА',
  },
  appModes: {
    completionApp: 'Генератор текста',
    chatApp: 'Чат-приложение',
  },
  datasetMenus: {
    documents: 'Документы',
    hitTesting: 'Тестирование поиска',
    settings: 'Настройки',
    emptyTip: 'Знания не были связаны, пожалуйста, перейдите в приложение или плагин, чтобы завершить связывание.',
    viewDoc: 'Просмотреть документацию',
    relatedApp: 'связанные приложения',
    noRelatedApp: 'Нет связанных приложений',
  },
  voiceInput: {
    speaking: 'Говорите сейчас...',
    converting: 'Преобразование в текст...',
    notAllow: 'микрофон не авторизован',
  },
  modelName: {
    'gpt-3.5-turbo': 'GPT-3.5-Turbo',
    'gpt-3.5-turbo-16k': 'GPT-3.5-Turbo-16K',
    'gpt-4': 'GPT-4',
    'gpt-4-32k': 'GPT-4-32K',
    'text-davinci-003': 'Text-Davinci-003',
    'text-embedding-ada-002': 'Text-Embedding-Ada-002',
    'whisper-1': 'Whisper-1',
    'claude-instant-1': 'Claude-Instant',
    'claude-2': 'Claude-2',
  },
  chat: {
    renameConversation: 'Переименовать разговор',
    conversationName: 'Название разговора',
    conversationNamePlaceholder: 'Пожалуйста, введите название разговора',
    conversationNameCanNotEmpty: 'Название разговора обязательно',
    citation: {
      title: 'ЦИТАТЫ',
      linkToDataset: 'Ссылка на знания',
      characters: 'Символы:',
      hitCount: 'Количество совпадений:',
      vectorHash: 'Векторный хэш:',
      hitScore: 'Оценка совпадения:',
    },
    inputPlaceholder: 'Поговорить с ботом',
  },
  promptEditor: {
    placeholder: 'Напишите здесь свое ключевое слово подсказки, введите \'{\', чтобы вставить переменную, введите \'/\', чтобы вставить блок содержимого подсказки',
    context: {
      item: {
        title: 'Контекст',
        desc: 'Вставить шаблон контекста',
      },
      modal: {
        title: '{{num}} знаний в контексте',
        add: 'Добавить контекст ',
        footer: 'Вы можете управлять контекстами в разделе «Контекст» ниже.',
      },
    },
    history: {
      item: {
        title: 'История разговоров',
        desc: 'Вставить шаблон исторического сообщения',
      },
      modal: {
        title: 'ПРИМЕР',
        user: 'Привет',
        assistant: 'Привет! Как я могу вам помочь сегодня?',
        edit: 'Редактировать имена ролей разговора',
      },
    },
    variable: {
      item: {
        title: 'Переменные и внешние инструменты',
        desc: 'Вставить переменные и внешние инструменты',
      },
      outputToolDisabledItem: {
        title: 'Переменные',
        desc: 'Вставить переменные',
      },
      modal: {
        add: 'Новая переменная',
        addTool: 'Новый инструмент',
      },
    },
    query: {
      item: {
        title: 'Запрос',
        desc: 'Вставить шаблон запроса пользователя',
      },
    },
    existed: 'Уже существует в подсказке',
  },
  imageUploader: {
    uploadFromComputer: 'Загрузить с компьютера',
    uploadFromComputerReadError: 'Ошибка чтения изображения, повторите попытку.',
    uploadFromComputerUploadError: 'Ошибка загрузки изображения, загрузите еще раз.',
    uploadFromComputerLimit: 'Загружаемые изображения не могут превышать {{size}} МБ',
    pasteImageLink: 'Вставить ссылку на изображение',
    pasteImageLinkInputPlaceholder: 'Вставьте ссылку на изображение здесь',
    pasteImageLinkInvalid: 'Неверная ссылка на изображение',
    imageUpload: 'Загрузка изображения',
  },
  tag: {
    placeholder: 'Все теги',
    addNew: 'Добавить новый тег',
    noTag: 'Нет тегов',
    noTagYet: 'Еще нет тегов',
    addTag: 'Добавить теги',
    editTag: 'Редактировать теги',
    manageTags: 'Управление тегами',
    selectorPlaceholder: 'Введите для поиска или создания',
    create: 'Создать',
    delete: 'Удалить тег',
    deleteTip: 'Тег используется, удалить его?',
    created: 'Тег успешно создан',
    failed: 'Ошибка создания тега',
  },
  fileUploader: {
    pasteFileLinkInputPlaceholder: 'Введите URL...',
    pasteFileLink: 'Вставить ссылку на файл',
    uploadFromComputer: 'Локальная загрузка',
    fileExtensionNotSupport: 'Расширение файла не поддерживается',
    uploadFromComputerReadError: 'Чтение файла не удалось, пожалуйста, повторите попытку.',
    pasteFileLinkInvalid: 'Неверная ссылка на файл',
    uploadFromComputerLimit: 'Файл загрузки не может превышать {{size}}',
    uploadFromComputerUploadError: 'Загрузка файла не удалась, пожалуйста, загрузите еще раз.',
  },
  license: {
    expiring: 'Срок действия истекает за один день',
    expiring_plural: 'Срок действия истекает через {{count}} дней',
  },
  pagination: {
    perPage: 'Элементов на странице',
  },
}

export default translation
