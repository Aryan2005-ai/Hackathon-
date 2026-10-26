"""Supabase client configuration for server-side operations."""
import os
from supabase import create_client, Client

def get_supabase_admin_client() -> Client:
    """Get Supabase admin client with service role key for backend operations."""
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    
    if not url or not key or "your-project" in url or key.startswith("replace-"):
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env"
        )
    
    return create_client(url, key)


def get_supabase_user_client(access_token: str | None = None) -> Client:
    """Get Supabase client for user-specific operations with RLS."""
    url = os.getenv("SUPABASE_URL", "").strip()
    anon_key = os.getenv("SUPABASE_PUBLISHABLE_KEY", "").strip()
    
    if not url or not anon_key:
        raise RuntimeError("Supabase URL and publishable key must be configured")
    
    client = create_client(url, anon_key)
    
    if access_token:
        client.auth.set_session(access_token, "")
    
    return client