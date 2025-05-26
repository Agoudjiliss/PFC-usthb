
FROM rasa/rasa:3.6.0

WORKDIR /app

COPY Chatbot_USTHB_Github .

# Train model
RUN rasa train

EXPOSE 5005

CMD ["rasa", "run", "--enable-api", "--cors", "*", "--port", "5005", "--host", "0.0.0.0"]
