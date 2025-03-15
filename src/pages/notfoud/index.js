import { Icon } from "@blueprintjs/core";
export default function NotFound() {

    return (
        <div className="app-container">
            <div className="app-overlay">
                <div className="row m-0 p-o">
                    <div className="container">
                        <div className="row justify-content-center m-5">
                            <div className="col-md-6 col-sm-12">

                                <div className="text-center mb-4"><Icon icon={'issue'} size={96} color="#5e4239" /></div>
                                <h1 className="text-center">404 - NO SE ENCUENTRA LA PAGINA</h1>
                                <p>La pagina la  cual intenta acceder no existe o se ha presentado un error, inténtelo nuevamente o si el problema persiste contactase con el soporte técnico.</p>
                                <p className="text-center"><a href="/">Ir a inicio</a></p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}
