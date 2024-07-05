# Welcome to what's in pic !

The purpose of this app is only to try to do something with my new comprehension of machine and deep learning

## How to launch the app

Set up the .env files in both frontend and backend directories

`cd [base_directory]`

if you run it directly from an IDE just hit "play" to the following block of code

```shell
cp frontend/.env.exemple frontend/.env
cp backend/.env.exemple backend/.env
```

you can personalize your .env files, but if you run it locally make sure that the base_url in frontend use the same port as describe in backend.

then update your dependencies :

```shell
npm install --prefix ./frontend
npm install --prefix ./backend
```
### launch the app in the browser

finally run server and frontend app in two different shell terminal

```shell
npm start --prefix ./backend
```
```shell
cd frontend
npx expo start
```

in the terminal that launched the frontend app, press W. It will open a web window with the app running.

### launch the app on an android device

the localhost network will not work on your smartphone, so you need to connect to another network. 
I use ngrok for that. [See the doc ton install it](https://dashboard.ngrok.com/get-started/setup/linux)

once it is install and token is configured, you can easily bind the port you use in the back to a public url. For the .env.exemple it would be :
```shell
ngrok http 34750
```

then copy the public url given in the terminal and paste it in the frontend/.env file as the base url.

run server and frontend app in two different shell terminal

```shell
npm start --prefix ./backend
```
```shell
cd frontend
npx expo start
```

in the terminal that launched the frontend app, scan the QR code with your camera (IOS) or the expo app (Android). It will open the app on your phone.