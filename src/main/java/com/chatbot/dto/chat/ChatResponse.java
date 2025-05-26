
package com.chatbot.dto.chat;

public class ChatResponse {
    private String response;
    private String intent;
    private Double confidence;
    private Long messageId;

    public ChatResponse() {}

    public ChatResponse(String response, String intent, Double confidence, Long messageId) {
        this.response = response;
        this.intent = intent;
        this.confidence = confidence;
        this.messageId = messageId;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }
}
