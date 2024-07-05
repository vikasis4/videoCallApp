import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import "./output.css";

import Home from './routes/Home';
import SocketProvider from './context/socket';
import Video from './routes/Video';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/video/:roomId",
    element: <Video />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
        <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
