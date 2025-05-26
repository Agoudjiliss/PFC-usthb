
package com.chatbot.service;

import com.chatbot.dto.settings.*;
import com.chatbot.model.Settings;
import com.chatbot.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SettingsService {
    
    @Autowired
    private SettingsRepository settingsRepository;
    
    // Chat Settings Keys
    private static final String WELCOME_MESSAGE = "chat.welcome_message";
    private static final String FALLBACK_MESSAGE = "chat.fallback_message";
    private static final String HELP_MESSAGE = "chat.help_message";
    private static final String ENABLE_WELCOME = "chat.enable_welcome";
    
    // General Settings Keys
    private static final String BOT_ENABLED = "general.bot_enabled";
    private static final String RESPONSE_FREQUENCY = "general.response_frequency";
    private static final String ENABLE_LOGGING = "general.enable_logging";
    private static final String ENABLE_ANALYTICS = "general.enable_analytics";
    
    public ChatSettingsResponse getChatSettings() {
        return new ChatSettingsResponse(
            getSettingValue(WELCOME_MESSAGE, "Bonjour ! Je suis USTHB-Bot, votre assistant pour l'entrepreneuriat et l'innovation."),
            getSettingValue(FALLBACK_MESSAGE, "Je n'ai pas compris votre question. Pouvez-vous la reformuler ?"),
            getSettingValue(HELP_MESSAGE, "Vous pouvez me poser des questions sur les startups, les PFE technologiques ou l'innovation."),
            Boolean.valueOf(getSettingValue(ENABLE_WELCOME, "true"))
        );
    }
    
    public void updateChatSettings(ChatSettingsRequest request) {
        saveSetting(WELCOME_MESSAGE, request.getWelcomeMessage());
        saveSetting(FALLBACK_MESSAGE, request.getFallbackMessage());
        if (request.getHelpMessage() != null) {
            saveSetting(HELP_MESSAGE, request.getHelpMessage());
        }
        if (request.getEnableWelcomeMessage() != null) {
            saveSetting(ENABLE_WELCOME, request.getEnableWelcomeMessage().toString());
        }
    }
    
    public GeneralSettingsResponse getGeneralSettings() {
        return new GeneralSettingsResponse(
            Boolean.valueOf(getSettingValue(BOT_ENABLED, "true")),
            Integer.valueOf(getSettingValue(RESPONSE_FREQUENCY, "1000")),
            Boolean.valueOf(getSettingValue(ENABLE_LOGGING, "true")),
            Boolean.valueOf(getSettingValue(ENABLE_ANALYTICS, "false"))
        );
    }
    
    public void updateGeneralSettings(GeneralSettingsRequest request) {
        if (request.getBotEnabled() != null) {
            saveSetting(BOT_ENABLED, request.getBotEnabled().toString());
        }
        if (request.getResponseFrequency() != null) {
            saveSetting(RESPONSE_FREQUENCY, request.getResponseFrequency().toString());
        }
        if (request.getEnableLogging() != null) {
            saveSetting(ENABLE_LOGGING, request.getEnableLogging().toString());
        }
        if (request.getEnableAnalytics() != null) {
            saveSetting(ENABLE_ANALYTICS, request.getEnableAnalytics().toString());
        }
    }
    
    private String getSettingValue(String key, String defaultValue) {
        return settingsRepository.findByKey(key)
                .map(Settings::getValue)
                .orElse(defaultValue);
    }
    
    private void saveSetting(String key, String value) {
        Settings setting = settingsRepository.findByKey(key)
                .orElse(new Settings(key, value));
        setting.setValue(value);
        settingsRepository.save(setting);
    }
}
