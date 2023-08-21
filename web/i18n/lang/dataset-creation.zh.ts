const translation = {
  steps: {
    header: {
      creation: '创建数据集',
      update: '上传文件',
    },
    one: '选择数据源',
    two: '文本分段与清洗',
    three: '处理并完成',
  },
  error: {
    unavailable: '该数据集不可用',
  },
  stepOne: {
    filePreview: '文件预览',
    pagePreview: '页面预览',
    dataSourceType: {
      file: '导入已有文本',
      notion: '同步自 Notion 内容',
      web: '同步自 Web 站点',
    },
    uploader: {
      title: '上传文本文件',
      button: '拖拽文件至此，或者',
      browse: '从本地上传',
      tip: '已支持 TXT、 HTML、 Markdown、 PDF、 XLSX，每个文件不超过 15 MB。',
      validation: {
        typeError: '文件类型不支持',
        size: '文件太大了，不能超过 15MB',
        count: '暂不支持多个文件',
      },
      cancel: '取消',
      change: '更改文件',
      failed: '上传失败',
    },
    notionSyncTitle: 'Notion 未绑定',
    notionSyncTip: '同步 Notion 内容前，须先绑定 Notion 空间',
    connect: '去绑定',
    button: '下一步',
    emptyDatasetCreation: '创建一个空数据集',
    modal: {
      title: '创建空数据集',
      tip: '空数据集中还没有文档，你可以在今后任何时候上传文档至该数据集。',
      input: '数据集名称',
      placeholder: '请输入数据集名称',
      nameNotEmpty: '名称不能为空',
      nameLengthInvaild: '名称长度不能超过 40 个字符',
      cancelButton: '取消',
      confirmButton: '创建',
      failed: '创建失败',
    },
  },
  stepTwo: {
    fileName: '预处理文档',
    segmentation: '分段设置',
    auto: '自动分段与清洗',
    autoDescription:
      '自动设置分段规则与预处理规则，如果不了解这些参数建议选择此项',
    custom: '自定义',
    customDescription: '自定义分段规则、分段长度以及预处理规则等参数',
    separator: '分段标识符',
    separatorPlaceholder: '例如换行符（\n）或特定的分隔符（如 "***"）',
    maxLength: '分段最大长度',
    rules: '文本预处理规则',
    removeExtraSpaces: '替换掉连续的空格、换行符和制表符',
    removeUrlEmails: '删除所有 URL 和电子邮件地址',
    removeStopwords: '去除停用词，例如 “a”，“an”，“the” 等',
    preview: '确认并预览',
    reset: '重置',
    indexMode: '索引方式',
    qualified: '高质量',
    recommend: '推荐',
    qualifiedTip:
      '调用 OpenAI 的嵌入接口进行处理，以在用户查询时提供更高的准确度',
    warning: '请先完成模型供应商的 API KEY 设置。.',
    click: '前往设置',
    economical: '经济',
    economicalTip:
      '使用离线的向量引擎、关键词索引等方式，降低了准确度但无需花费 Token',
    emstimateCost: '执行嵌入预估消耗',
    emstimateSegment: '预估分段数',
    segmentCount: '段',
    calculating: '计算中...',
    fileSource: '预处理文档',
    notionSource: '预处理页面',
    other: '和其他 ',
    fileUnit: ' 个文件',
    notionUnit: ' 个页面',
    lastStep: '上一步',
    nextStep: '保存并处理',
    save: '保存并处理',
    cancel: '取消',
    sideTipTitle: '为什么要分段和预处理？',
    sideTipP1: '在处理文本数据时，分段和清洗是两个重要的预处理步骤。',
    sideTipP2:
      '分段的目的是将长文本拆分成较小的段落，以便模型更有效地处理和理解。这有助于提高模型生成的结果的质量和相关性。',
    sideTipP3:
      '清洗则是对文本进行预处理，删除不必要的字符、符号或格式，使数据集更加干净、整洁，便于模型解析。',
    sideTipP4:
      '通过对数据集进行适当的分段和清洗，可以提高模型在实际应用中的表现，从而为用户提供更准确、更有价值的结果。',
    previewTitle: '分段预览',
    characters: '字符',
    indexSettedTip: '要更改索引方法，请转到',
    datasetSettingLink: '数据集设置。',
  },
  stepThree: {
    creationTitle: '数据集已创建',
    creationContent: '我们自动为该数据集起了个名称，您也可以随时修改',
    label: '数据集名称',
    additionTitle: '文档已上传',
    additionP1: '文档已上传至数据集：',
    additionP2: '，你可以在数据集的文档列表中找到它。',
    stop: '停止处理',
    resume: '恢复处理',
    navTo: '前往文档',
    sideTipTitle: '接下来做什么',
    sideTipContent:
      '当文档完成索引处理后，数据集即可集成至应用内作为上下文使用，你可以在提示词编排页找到上下文设置。你也可以创建成可独立使用的 ChatGPT 索引插件发布。',
    modelTitle: '确认停止索引过程吗？',
    modelContent: '如果您需要稍后恢复处理，则从停止处继续。',
    modelButtonConfirm: '确认停止',
    modelButtonCancel: '取消',
  },
}

export default translation
