import { useContext } from "react";
import { AuthContext } from "../../utils/context/auth.context.ts";
import { useTranslation } from "react-i18next";
import GEN_IMG from "./gen.jpg"
import TRAX_IMG from "./trax.jpg"
import PRO_IMG from "./project.png"
import WALLET_IMG from "./wallet.jpg"

export default function Home() {

  const { t } = useTranslation();
  const authContext = useContext(AuthContext)
  const { user, verify } = authContext

  return (
    <div>
      <h1>ROCKAI</h1>
      <h3>{user?.name || ''}: {t(`users.role.${user?.cargo || ''}`)}</h3>

      <div className="row">

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card mb-3">
            <div className="card-header bg-warning"><h5>Vista General</h5></div>
            <img src={GEN_IMG} class="card-img-top" alt="..." height={120}  />
            <div class="card-body">
              <p class="card-text">
                <ul>
                  <li>Proyectos en Curso: 3</li>
                  <li>Proyectos Facturados: 2</li>
                  <li>Proyecto 3</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card mb-3">
            <div className="card-header bg-warning"><h5>Proyectos a entregar</h5></div>
            <img src={PRO_IMG} class="card-img-top" alt="..." height={120}  />
            <div class="card-body">
              <p class="card-text">
                <ul>
                  <li>Proyecto 1</li>
                  <li>Proyecto 2</li>
                  <li>Proyecto 3</li>
                </ul>
              </p>
            </div>
          </div>
        </div>


        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card mb-3">
            <div className="card-header bg-warning"><h5>Ultimas transacciones</h5></div>
            <img src={TRAX_IMG} class="card-img-top" alt="..." height={120}  />
            <div class="card-body">
              <p class="card-text">
                <ul>
                  <li>TRAX 1 - Ingreso : &4.500.000</li>
                  <li>TRAX 2 - Ingreso : &4.500.000</li>
                  <li>TRAX 3 - Ingreso : &4.500.000</li>
                  <li>TRAX 3 - Ingreso : &4.500.000</li>
                  <li>TRAX 3 - Ingreso : &4.500.000</li>
                  <li>TRAX 3 - Ingreso : &4.500.000</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-sm-12">
          <div className="card mb-3">
            <div className="card-header bg-warning"><h5>Saldo de Cartera</h5></div>
            <img src={WALLET_IMG} class="card-img-top" alt="..." height={120}  />
            <div class="card-body">
              <p class="card-text">
                <ul>
                  <li>Cuenta 1: $4.500.000</li>
                  <li>Cuenta 2: $4.500.000</li>
                  <li>Cuenta 3: $4.500.000</li>
                  <li>Total: $4.500.000</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}