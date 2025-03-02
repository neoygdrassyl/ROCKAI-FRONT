import { Suspense } from "react";
import { Outlet } from "react-router";

export default function LayoutPage() {
    return (
        <div className="page-layout">
            <div className="page-body">
                <Suspense fallback="Loading...">
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
}