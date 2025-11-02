from flask import Flask
from flask_socketio import SocketIO, emit # type: ignore
from flask_cors import CORS # type: ignore
import env
import logging
from gevent import monkey

monkey.patch_all()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

app = Flask(__name__)

CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True,
)

@app.route('/')
def index():
    return "WebSocket demo running!"

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('message', {'data': 'Connected to server!'})

@socketio.on('message')
def handle_message(msg: str):
    print('Received:', msg)
    emit('message', {'data': f"Echo: {msg}"})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    print("Starting server with async mode:", socketio.async_mode) # type: ignore
    socketio.run(app, port=env.FLASK_PORT) # type: ignore
