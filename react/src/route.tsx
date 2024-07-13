import { BrowserRouter, Route } from "react-router-dom";
import { App } from "./App";

export const Routes = () => {
    return (
        <BrowserRouter>
            <Route path="/" element={<App />} />
            {/* <Route path="/about" element={About} /> */}
        </BrowserRouter>
    );
};
