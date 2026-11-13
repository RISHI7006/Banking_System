import os
import sys
import socket
import uvicorn

def is_port_available(port: int, host: str = "127.0.0.1") -> bool:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind((host, port))
        s.close()
        return True
    except Exception:
        return False

def get_available_port(preferred_port: int = 8000) -> int:
    env_port = os.getenv("PORT")
    if env_port and env_port.isdigit():
        return int(env_port)

    for arg in sys.argv[1:]:
        if arg.isdigit():
            return int(arg)
        if arg.startswith("--port="):
            return int(arg.split("=")[1])
    
    for p in [preferred_port, 8001, 8080, 5000]:
        if is_port_available(p):
            return p
    return preferred_port

if __name__ == "__main__":
    is_cloud = bool(os.getenv("PORT") or os.getenv("RENDER"))
    host = "0.0.0.0" if is_cloud else "127.0.0.1"
    port = get_available_port(8000)
    
    print("==================================================")
    print("Starting Modern Banking Management System API...")
    if port != 8000 and not is_cloud:
        print(f"[Notice] Port 8000 is occupied/restricted by Windows.")
        print(f"         Automatically switched to Port {port}!")
    print(f"API Docs available at: http://{host}:{port}/docs")
    print("==================================================")
    
    if is_cloud:
        uvicorn.run("backend.app.main:app", host=host, port=port, reload=False)
    else:
        try:
            uvicorn.run("backend.app.main:app", host=host, port=port, reload=True)
        except Exception as e:
            fallback_port = 8001 if port == 8000 else 8080
            print(f"[Fallback] Retrying on Port {fallback_port}... ({e})")
            uvicorn.run("backend.app.main:app", host=host, port=fallback_port, reload=False)
