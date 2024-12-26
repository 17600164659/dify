const translation = {
  knowledge: 'ナレッジ',
  documentCount: ' ドキュメント',
  wordCount: ' k 単語',
  appCount: ' リンクされたアプリ',
  createDataset: 'ナレッジを作成',
  createDatasetIntro: '独自のテキストデータをインポートするか、LLMコンテキストの強化のためにWebhookを介してリアルタイムでデータを書き込むことができます。',
  deleteDatasetConfirmTitle: 'このナレッジを削除しますか？',
  deleteDatasetConfirmContent:
    'ナレッジを削除すると元に戻すことはできません。ユーザーはもはやあなた様のナレッジにアクセスできず、すべてのプロンプトの設定とログが永久に削除されます。',
  datasetUsedByApp: 'このナレッジは一部のアプリによって使用されています。アプリはこのナレッジを使用できなくなり、すべてのプロンプト設定とログは永久に削除されます。',
  datasetDeleted: 'ナレッジが削除されました',
  datasetDeleteFailed: 'ナレッジの削除に失敗しました',
  didYouKnow: 'ご存知ですか？',
  intro1: 'ナレッジはDifyアプリケーションに統合することができます',
  intro2: 'コンテキストとして',
  intro3: '、',
  intro4: 'または',
  intro5: '作成することができます',
  intro6: '単体のChatGPTインデックスプラグインとして公開するために',
  unavailable: '利用不可',
  unavailableTip: '埋め込みモデルが利用できません。デフォルトの埋め込みモデルを設定する必要があります',
  datasets: 'ナレッジ',
  datasetsApi: 'API',
  retrieval: {
    semantic_search: {
      title: 'ベクトル検索',
      description: 'クエリの埋め込みを生成し、そのベクトル表現に最も類似したテキストチャンクを検索します。',
    },
    full_text_search: {
      title: '全文検索',
      description: 'ドキュメント内のすべての用語をインデックス化し、ユーザーが任意の用語を検索してそれに関連するテキストチャンクを取得できるようにします。',
    },
    hybrid_search: {
      title: 'ハイブリッド検索',
      description: '全文検索とベクトル検索を同時に実行し、ユーザーのクエリに最適なマッチを選択するためにRerank付けを行います。RerankモデルAPIの設定が必要です。',
      recommend: 'おすすめ',
    },
    invertedIndex: {
      title: '転置インデックス',
      description: '効率的な検索に使用される構造です。各用語が含まれるドキュメントまたはWebページを指すように、用語ごとに整理されています。',
    },
    change: '変更',
    changeRetrievalMethod: '検索方法の変更',
  },
  docsFailedNotice: 'ドキュメントのインデックスに失敗しました',
  retry: '再試行',
  indexingTechnique: {
    high_quality: '高品質',
    economy: '経済',
  },
  indexingMethod: {
    semantic_search: 'ベクトル検索',
    full_text_search: 'フルテキスト検索',
    hybrid_search: 'ハイブリッド検索',
    invertedIndex: '転置',
  },
  mixtureHighQualityAndEconomicTip: '高品質なナレッジベースと経済的なナレッジベースを混在させるには、Rerankモデルを構成する必要がある。',
  inconsistentEmbeddingModelTip: '選択されたナレッジベースが一貫性のない埋め込みモデルで構成されている場合、Rerankモデルの構成が必要です。',
  retrievalSettings: '検索設定',
  rerankSettings: 'Rerank設定',
  weightedScore: {
    title: 'ウェイト設定',
    description: '重みを調整することで、並べ替え戦略はセマンティックマッチングとキーワードマッチングのどちらを優先するかを決定します。',
    semanticFirst: 'セマンティック優先',
    keywordFirst: 'キーワード優先',
    customized: 'カスタマイズ',
    semantic: 'セマンティクス',
    keyword: 'キーワード',
  },
  nTo1RetrievalLegacy: '製品計画によると、N-to-1 Retrievalは9月に正式に廃止される予定です。それまでは通常通り使用できます。',
  nTo1RetrievalLegacyLink: '詳細を見る',
  nTo1RetrievalLegacyLinkText: ' N-to-1 retrievalは9月に正式に廃止されます。',
  defaultRetrievalTip: 'デフォルトでは、マルチパス取得が使用されます。ナレッジは複数のナレッジ ベースから取得され、再ランク付けされます。',
  editExternalAPIConfirmWarningContent: {
    front: 'この外部ナレッジAPIは、',
    end: '外部の知識、そしてこの変更はそれらすべてに適用されます。この変更を保存してもよろしいですか?',
  },
  editExternalAPIFormWarning: {
    end: '外部の知識',
    front: 'この外部APIはにリンクされています',
  },
  deleteExternalAPIConfirmWarningContent: {
    title: {
      end: '?',
      front: '削除',
    },
    content: {
      front: 'この外部ナレッジAPIは、',
      end: '外部の知識。このAPIを削除すると、それらすべてが無効になります。この API を削除してもよろしいですか ?',
    },
    noConnectionContent: 'この API を削除してもよろしいですか ?',
  },
  selectExternalKnowledgeAPI: {
    placeholder: '外部ナレッジ API を選択する',
  },
  connectDatasetIntro: {
    content: {
      link: '外部 API の作成方法を学ぶ',
      front: '外部ナレッジ ベースに接続するには、まず外部 API を作成する必要があります。よくお読みになり、以下を参照してください。',
      end: '.次に、対応するナレッジIDを見つけて、左側のフォームに入力します。すべての情報が正しい場合は、接続ボタンをクリックした後、ナレッジベースの検索テストに自動的にジャンプします。',
    },
    title: '外部ナレッジベースに接続する方法',
    learnMore: '詳細を見る',
  },
  connectHelper: {
    helper2: '取得機能のみがサポートされています',
    helper3: '.次のことを強くお勧めします。',
    helper4: 'ヘルプドキュメントを読む',
    helper5: 'この機能を使用する前に慎重に。',
    helper1: 'APIとナレッジベースIDを介して外部ナレッジベースに接続します。',
  },
  externalKnowledgeForm: {
    cancel: 'キャンセル',
    connect: '繋ぐ',
  },
  externalAPIForm: {
    encrypted: {
      front: 'APIトークンは暗号化され、',
      end: 'テクノロジー。',
    },
    apiKey: 'APIキー',
    name: '名前',
    edit: '編集',
    save: 'セーブ',
    cancel: 'キャンセル',
    endpoint: 'API エンドポイント',
  },
  externalTag: '外',
  editExternalAPITooltipTitle: 'リンクされた知識',
  externalKnowledgeName: '外部ナレッジ名',
  externalAPI: '外部 API',
  externalAPIPanelDocumentation: 'External Knowledge API の作成方法を学ぶ',
  editExternalAPIFormTitle: '外部ナレッジ API の編集',
  externalAPIPanelTitle: '外部ナレッジAPI',
  externalKnowledgeId: '外部ナレッジID',
  connectDataset: '外部ナレッジベースへの接続',
  externalKnowledgeIdPlaceholder: 'ナレッジIDを入力してください',
  createNewExternalAPI: '新しい外部ナレッジ API を作成する',
  noExternalKnowledge: 'External Knowledge APIはまだありませんので、こちらをクリックして作成してください',
  mixtureInternalAndExternalTip: '再ランク付けモデルは、内部知識と外部知識の混合に必要です。',
  learnHowToWriteGoodKnowledgeDescription: '良い知識の説明を書く方法を学ぶ',
  externalKnowledgeNamePlaceholder: 'ナレッジベースの名前を入力してください',
  externalKnowledgeDescription: 'ナレッジの説明',
  createExternalAPI: '外部ナレッジ API を追加する',
  externalKnowledgeDescriptionPlaceholder: 'このナレッジベースの内容を説明する(オプション)',
  allExternalTip: '外部ナレッジのみを使用する場合、ユーザーは Rerank モデルを有効にするかどうかを選択できます。有効にしない場合、取得されたチャンクはスコアに基づいて並べ替えられます。異なるナレッジベースの検索戦略に一貫性がない場合、不正確になります。',
  externalAPIPanelDescription: '外部ナレッジAPIは、Difyの外部のナレッジベースに接続し、そのナレッジベースからナレッジを取得するために使用されます。',
  chunkingMode: {
    general: '全般',
    parentChild: '親子',
  },
  parentMode: {
    fullDoc: 'フルドキュメント',
    paragraph: '段落',
  },
  batchAction: {
    delete: '削除',
    selected: '入選',
    archive: 'アーカイブ',
    enable: 'エネーブル',
    disable: '無効にする',
    cancel: 'キャンセル',
  },
  documentsDisabled: '{{num}}ドキュメントが無効 - 30日以上非アクティブ',
  localDocs: 'ローカルドキュメント',
  enable: 'エネーブル',
  preprocessDocument: '{{数値}}ドキュメントの前処理',
}

export default translation
