
#!/bin/bash
cd Chatbot_USTHB_Github
echo "Starting Rasa server..."
rasa run --enable-api --cors "*" --port 5005 --host 0.0.0.0 &
echo "Rasa server started on port 5005"
