import { Icon } from "@blueprintjs/core";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../context/auth.context.ts";
import { useTranslation } from "react-i18next";
import vars from "../json/variables.json"

export default function SideBar(props) {
  const { isExpand, setExpand } = props
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userContext = useContext(AuthContext);
  const { user } = userContext;
  const location = useLocation();

  const menu = {
    COT: { option: t(vars.mod_map.COT.t), value: vars.mod_map.COT.url, icon: vars.mod_map.COT.icon, order: 1,},
    PRO: { option: t(vars.mod_map.PRO.t), value: vars.mod_map.PRO.url, icon: vars.mod_map.PRO.icon, order: 2,},
    CON: { option: t(vars.mod_map.CON.t), value: vars.mod_map.CON.url, icon: vars.mod_map.CON.icon, order: 3,},
    HRS: { option: t(vars.mod_map.HRS.t), value: vars.mod_map.HRS.url, icon: vars.mod_map.HRS.icon, order: 4,},
  };

  const handleLogout = () => {
    navigate('/login')
  }

  const handleMenu = (path) => {
    navigate(path)
  }

  const menuOptions = (access) => {
    const MENU = [];

    access.map(a => {
      const OPTION = a.split(':')[0]
      if (OPTION in menu) {
        MENU.push(menu[OPTION])
      }
    }
    )
    MENU.sort((a, b) => (a.order - b.order))
    return MENU
  }

  return (
    <nav className={`navbar-container`}>

      <div className="navbar navbar-light bg-light">
        <div className="container-fluid">

          <span className="navbar-brand h1 nav-text">{t("sidebar.title")}</span>

          {isExpand
            ? <Icon icon="chevron-left" size={20} className="app-icon" onClick={() => setExpand(false)} />
            : <Icon icon="chevron-right" size={20} className="app-icon" onClick={() => setExpand(true)} />
          }

        </div>
      </div>
      {user ? <>
        <ul className="nav nav-title flex-column">
          <li key={`li-k-user`} className={"nav-item"} onClick={() => { }}>

            <a className="nav-link" aria-current="page">
              <Icon className="app-icon" icon={"user"} />
              <span className="nav-text title">{user.name}</span>
              <span className="nav-text subtitle">{t(`users.role.${user.cargo}`)} </span>
            </a>
          </li>
        </ul>

        <ul className="nav flex-column">

          <li key={`li-k-home`} className={"nav-item " + (location.pathname === '/home' ? "active" : "")} onClick={() => handleMenu("/home")}>

            <div className="app-tooltip">
              <a className="nav-link" aria-current="page">
                <Icon icon={'home'} />
                <span className="nav-text">{t('sidebar.menu.home')}</span>
              </a>
              {isExpand ? null : <span className="app-tooltiptext">{t('sidebar.menu.home')}</span>}
            </div>
          </li>

          {menuOptions(user.access).map((obj, i) => <>
            <li key={`li-k-${i}`} className={"nav-item " + (location.pathname === obj.value ? "active" : "")} onClick={() => handleMenu(obj.value)}>

              <div className="app-tooltip">
                <a className="nav-link" aria-current="page">
                  <Icon icon={obj.icon} />
                  <span className="nav-text">{obj.option}</span>
                </a>

                {isExpand ? null : <span className="app-tooltiptext">{obj.option}</span>}

              </div>

            </li>
          </>)}
        </ul>

      </> : null}


      <ul className="nav nav-logout flex-column">
        <li key={`li-k-logout`} className={"nav-item"} onClick={() => handleLogout()}>

          <a className="nav-link" aria-current="page" href="#">
            <Icon icon={'log-out'} />
            <span className="nav-text">{t("sidebar.exit")}</span>
          </a>
        </li>
      </ul>



    </nav>
  );
}