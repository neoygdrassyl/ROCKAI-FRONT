import { Outlet } from "react-router";

export default function LayoutPage() {
    return (
        <div className="page-layout">
           
            <div className="page-body"><Outlet /></div>
          
        </div>
    );
}