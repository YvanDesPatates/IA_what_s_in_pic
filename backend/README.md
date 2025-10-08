# Config file

To run the App you need to create a .env file at the root of the project.

Config should follow next example :
```.dotenv
PORT=number
```

# Launch the app with docker compose

Thanks to docker compose you can launch the app directly on the port configured in the .env file with the following command :
```bash
sudo docker-compose up
```
### ⚠️ Important: Python virtual environment (venv)

This project expects you to create a Python virtual environment before installing the backend Python packages.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

Notes:
- `ImageController` will prefer `./backend/venv/bin/python`, then fall back to `python3`.
- `.env` files are used to configure the Node server (backend and frontend). They do not install Python packages. Use `pip install -r backend/requirements.txt` inside an activated venv to install required Python packages.