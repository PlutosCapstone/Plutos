import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()


SUPABASE_URL = os.environ.get("supabaseUrl")
SUPABASE_KEY = os.environ.get("supabaseAnonKey")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL or Key not set in the environment variables")

db = create_client(SUPABASE_URL, SUPABASE_KEY)
