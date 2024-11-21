# Use a lightweight Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the custom HTTP Server python script
COPY log_server.py /app/

# Set startup command
CMD ["python3", "log_server.py"]