import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { login } from './services/api'

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

let appInitialized = false;

const initializeApp = async () => {
  if (appInitialized) {
    return;
  }
  appInitialized = true;

  try {

    await login();
  } catch (error) {
 
    console.log("Endpoint de login indisponível, continuando sem token.");
  } finally {

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
};

initializeApp();