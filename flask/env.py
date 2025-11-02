from dotenv import load_dotenv
import os

load_dotenv()

FLASK_ENV = os.getenv('FLASK_ENV', 'development')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
