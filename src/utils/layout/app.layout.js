import { Outlet } from "react-router";
import Footer from "../components/footer";
import SideBar from "../components/sidebar";
import { useState } from "react";


export default function LayoutApp() {
  const [isExpand, setExpand] = useState(true)

  return (
    <div>
      <div className={`app-sidebar ${isExpand ? 'expand' : ''}`}>
        <SideBar isExpand={isExpand} setExpand={setExpand} />
      </div>

      <div className="app-container">
        <div className="app-overlay">
          <div className={`app-content ${isExpand ? 'expand' : ''}`}>
            
            <div className="row pt-3">
              <Outlet />
            </div>

            <div className="row">
              <Footer />
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}