import { Icon } from "@blueprintjs/core";
import { useState } from "react";
import { useAuth } from './auth.hook.ts'
import { useNavigate  } from "react-router";

export default function SideBar(props) {
  const { isExpand, setExpand } = props
  const navigate = useNavigate();
  const [index, setIndex] = useState(-1)

  const menu = [
    { option: 'Cotizaciones', value: 'cotizaciones', icon: 'dollar' },
    { option: 'Proyectos', value: 'proyectos', icon: 'projects' },
    { option: 'Transacciones', value: 'ransacciones', icon: 'credit-card' },
    { option: null, value: null },
  ]

  const { logout } = useAuth();

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav>

      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
        
          <span className="navbar-brand mb-0 h1">{isExpand ? 'ROCKAI' : ''}</span>

          {isExpand
            ? <Icon icon="chevron-left" size={20} className="app-icon" onClick={() => setExpand(false)} />
            : <Icon icon="chevron-right" size={20} className="app-icon" onClick={() => setExpand(true)} />
          }

        </div>
      </nav>

      <ul className="nav flex-column">
        {menu.map((obj, i) => <>
          {obj.value ?
            <li className={"nav-item " + (i === index ? "active" : "")} onClick={() => setIndex(i)}>


              <div className="app-tooltip">

                <a className="nav-link" aria-current="page" href="#">
                  <Icon icon={obj.icon} />
                  <span className="nav-text">{isExpand ? obj.option : ''}</span>
                </a>

                {isExpand ? null : <span className="app-tooltiptext">{obj.option}</span>}

              </div>

            </li>
            : <hr />
          }
        </>)}
      </ul>

      <button onClick={() => handleLogout()}>Logout</button>

    </nav>
  );
}