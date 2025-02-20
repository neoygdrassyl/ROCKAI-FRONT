import { Outlet } from "react-router";
import Footer from "./footer";
import SideBar from "./sidebar";
import { useState } from "react";


export default function LayoutApp() {
  const [isExpand, setExpand] = useState(false)


  return (
    <div>
        <div className="app-sidebar" style={isExpand ? { width: '250px' } : { width: '60px' }}>
          <SideBar isExpand={isExpand} setExpand={setExpand} />
        </div>

        <div className="app-content" style={isExpand ? { marginLeft: '250px' } : { marginLeft: '60px' }}>

          <div className="row">
            <Outlet />
          </div>

          <div className="row">
            <Footer />
          </div>

        </div>
    </div>
  );
}