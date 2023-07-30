const translation = {
    apiServer: "API Server",
    apiKey: "API Key",
    status: "Status",
    disabled: "Disabled",
    ok: "In Service",
    copy: "Copy",
    copied: "Copied",
    never: "Never",
    apiKeyModal: {
        apiSecretKey: "API Secret key",
        apiSecretKeyTips: "To prevent API abuse, protect your API Key. Avoid using it as plain text in front-end code. :)",
        createNewSecretKey: "Create new Secret key",
        secretKey: "Secret Key",
        created: "CREATED",
        lastUsed: "LAST USED",
        generateTips: "Keep this key in a secure and accessible place."
    },
    actionMsg: {
        deleteConfirmTitle: "Delete this secret key?",
        deleteConfirmTips: "This action cannot be undone.",
        ok: "OK"
    },
    completionMode: {
        title: "Completion App API",
        info: "For high-quality text generation, such as articles, summaries, and translations, use the completion-messages API with user input. Text generation relies on the model parameters and prompt templates set in 沃比医疗 Prompt Engineering.",
        createCompletionApi: "Create Completion Message",
        createCompletionApiTip: "Create a Completion Message to support the question-and-answer mode.",
        inputsTips: "(Optional) Provide user input fields as key-value pairs, corresponding to variables in Prompt Eng. Key is the variable name, Value is the parameter value. If the field type is Select, the submitted Value must be one of the preset choices.",
        queryTips: "User input text content.",
        blocking: "Blocking type, waiting for execution to complete and returning results. (Requests may be interrupted if the process is long)",
        streaming: "streaming returns. Implementation of streaming return based on SSE (Server-Sent Events).",
        messageFeedbackApi: "Message feedback (like)",
        messageFeedbackApiTip: "Rate received messages on behalf of end-users with likes or dislikes. This data is visible in the Logs & Annotations page and used for future model fine-tuning.",
        messageIDTip: "Message ID",
        ratingTip: "like or dislike, null is undo",
        parametersApi: "Obtain application parameter information",
        parametersApiTip: "Retrieve configured Input parameters, including variable names, field names, types, and default values. Typically used for displaying these fields in a form or filling in default values after the client loads."
    },
    chatMode: {
        title: "Chat App API",
        info: "For versatile conversational apps using a Q&A format, call the chat-messages API to initiate dialogue. Maintain ongoing conversations by passing the returned conversation_id. Response parameters and templates depend on 沃比医疗 Prompt Eng. settings.",
        createChatApi: "Create chat message",
        createChatApiTip: "Create a new conversation message or continue an existing dialogue.",
        inputsTips: "(Optional) Provide user input fields as key-value pairs, corresponding to variables in Prompt Eng. Key is the variable name, Value is the parameter value. If the field type is Select, the submitted Value must be one of the preset choices.",
        queryTips: "User input/question content",
        blocking: "Blocking type, waiting for execution to complete and returning results. (Requests may be interrupted if the process is long)",
        streaming: "streaming returns. Implementation of streaming return based on SSE (Server-Sent Events).",
        conversationIdTip: "(Optional) Conversation ID: leave empty for first-time conversation; pass conversation_id from context to continue dialogue.",
        messageFeedbackApi: "Message terminal user feedback, like",
        messageFeedbackApiTip: "Rate received messages on behalf of end-users with likes or dislikes. This data is visible in the Logs & Annotations page and used for future model fine-tuning.",
        messageIDTip: "Message ID",
        ratingTip: "like or dislike, null is undo",
        chatMsgHistoryApi: "Get the chat history message",
        chatMsgHistoryApiTip: "The first page returns the latest `limit` bar, which is in reverse order.",
        chatMsgHistoryConversationIdTip: "Conversation ID",
        chatMsgHistoryFirstId: "ID of the first chat record on the current page. The default is none.",
        chatMsgHistoryLimit: "How many chats are returned in one request",
        conversationsListApi: "Get conversation list",
        conversationsListApiTip: "Gets the session list of the current user. By default, the last 20 sessions are returned.",
        conversationsListFirstIdTip: "The ID of the last record on the current page, default none.",
        conversationsListLimitTip: "How many chats are returned in one request",
        conversationRenamingApi: "Conversation renaming",
        conversationRenamingApiTip: "Rename conversations; the name is displayed in multi-session client interfaces.",
        conversationRenamingNameTip: "New name",
        parametersApi: "Obtain application parameter information",
        parametersApiTip: "Retrieve configured Input parameters, including variable names, field names, types, and default values. Typically used for displaying these fields in a form or filling in default values after the client loads."
    },
    develop: {
        requestBody: "Request Body",
        pathParams: "Path Params",
        query: "Query"
    }
}

export default translation
